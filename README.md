Kindly use the below code  for orderlist component:
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "emailjs-com";
import "./AdminOrders.css";

const firebaseConfig = {
  apiKey: "AIzaSyD3Kc5IV2ZU3FgqAV0PLBGGj7YTLXTsV_o",
  authDomain: "crackers-shop-1ccee.firebaseapp.com",
  projectId: "crackers-shop-1ccee",
  storageBucket: "crackers-shop-1ccee.firebasestorage.app",
  messagingSenderId: "530523718936",
  appId: "1:530523718936:web:fa404d5ae610d804e30a6d",
  measurementId: "G-8JB07Y4M5J"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [status, setStatus] = useState("");
  const [tempDate, setTempDate] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort the orders by timestamp (most recent first)
        ordersData.sort((a, b) => {
          const dateA = a.timestamp ? a.timestamp.seconds * 1000 : 0; // Check if timestamp exists
          const dateB = b.timestamp ? b.timestamp.seconds * 1000 : 0;
          return dateB - dateA; // Sort in descending order (latest first)
        });

        setOrders(ordersData);
      } catch (err) {
        setError("Error fetching orders.");
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDateChange = (date, orderId) => {
    setDeliveryDate(date);
    if (window.confirm("Do you want to update the delivery date?")) {
      setTempDate(date);
      updateOrder(orderId, { deliveryDate: date });
    }
  };

  const handleStatusChange = (status, orderId) => {
    setStatus(status);
    if (window.confirm("Do you want to update the delivery status?")) {
      setTempStatus(status);
      updateOrder(orderId, { deliveryStatus: status });
    }
  };

  const updateOrder = async (orderId, updateData) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, updateData);
      console.log("Order updated successfully");
    } catch (err) {
      console.error("Error updating order: ", err);
    }
  };

  const handleFinalSubmit = (orderId) => {
    if (window.confirm("Are you sure you want to submit and send the email?")) {
      sendEmail(orderId);
    }
  };

  const sendEmail = async (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (!order) return;

    const userEmail = order.userDetails.email;
    const userName = order.userDetails.name;

    // Check if deliveryDate exists before formatting it
    const formattedDeliveryDate = tempDate
      ? tempDate.toLocaleDateString("en-GB")
      : order.deliveryDate && order.deliveryDate.seconds
      ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString("en-GB")
      : "No delivery date set";

    const deliveryStatus = tempStatus || order.deliveryStatus || "Status unknown";

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      delivery_date: formattedDeliveryDate,
      delivery_status: deliveryStatus,
    };

    emailjs
      .send("raja", "delivery", templateParams, "djl5JpoPh-0BB4PgO")
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          if (deliveryStatus === "Delivered") {
            moveToPastOrders(orderId);
          }
        },
        (error) => {
          console.log("Error sending email:", error);
        }
      );
  };

  const moveToPastOrders = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    const orderToMove = orders.find((order) => order.id === orderId);
    setPastOrders((prevPastOrders) => [...prevPastOrders, orderToMove]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-list-container">
      <h2 className="orders-list-heading">Orders List</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Total Amount</th>
            <th>Payment Mode</th>
            <th>Order Date</th>
            <th>Products</th>
            <th>Set Delivery Date</th>
            <th>Set Delivery Status</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userDetails.name}</td>
              <td>{order.userDetails.email}</td>
              <td>₹{order.grandTotal}</td>
              <td>{order.paymentMode === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}</td>
              <td>{order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}</td>
              <td>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      <strong>{product.productName}</strong> ({product.content}) - Quantity: {product.qty}, Price: ₹{product.price}, Total: ₹{product.total}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <DatePicker
                  selected={order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000) : null}
                  onChange={(date) => handleDateChange(date, order.id)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Delivery Date"
                />
              </td>
              <td>
                <select value={order.deliveryStatus || ""} onChange={(e) => handleStatusChange(e.target.value, order.id)}>
                  <option value="">Select Status</option>
                  <option value="Yet to deliver">Yet to deliver</option>
                  <option value="Delivery in process">Delivery in process</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delivery incomplete">Delivery incomplete</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleFinalSubmit(order.id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pastOrders.length > 0 && (
        <div className="past-orders-section">
          <h3>Past Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Total Amount</th>
                <th>Payment Mode</th>
                <th>Order Date</th>
                <th>Products</th>
                <th>Delivery Date</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userDetails.name}</td>
                  <td>{order.userDetails.email}</td>
                  <td>₹{order.grandTotal}</td>
                  <td>{order.paymentMode === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}</td>
                  <td>{order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}</td>
                  <td>
                    <ul>
                      {order.products.map((product, index) => (
                        <li key={index}>
                          <strong>{product.productName}</strong> ({product.content}) - Quantity: {product.qty}, Price: ₹{product.price}, Total: ₹{product.total}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString("en-GB") : "No delivery date"}</td>
                  <td>{order.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
