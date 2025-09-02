import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "emailjs-com";

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
          const dateA = a.timestamp ? a.timestamp.seconds * 1000 : 0;
          const dateB = b.timestamp ? b.timestamp.seconds * 1000 : 0;
          return dateB - dateA;
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

  const handleDateChange = async (date, orderId) => {
    if (window.confirm("Do you want to update the delivery date?")) {
      setTempDate(date);
      await updateOrder(orderId, { deliveryDate: date });
      
      // Update the local state to reflect the change immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, deliveryDate: { seconds: date.getTime() / 1000 } }
            : order
        )
      );
    }
  };

  const handleStatusChange = async (status, orderId) => {
    if (window.confirm("Do you want to update the delivery status?")) {
      setTempStatus(status);
      await updateOrder(orderId, { deliveryStatus: status });
      
      // Update the local state to reflect the change immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, deliveryStatus: status }
            : order
        )
      );
    }
  };

  const updateOrder = async (orderId, updateData) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, updateData);
      console.log("Order updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating order: ", err);
      alert("Error updating order. Please try again.");
      return false;
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

    // Get the current delivery date from the order state
    const formattedDeliveryDate = order.deliveryDate && order.deliveryDate.seconds
      ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString("en-GB")
      : "No delivery date set";

    const deliveryStatus = order.deliveryStatus || "Status unknown";

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      delivery_date: formattedDeliveryDate,
      delivery_status: deliveryStatus,
    };

    try {
      const response = await emailjs.send("raja", "delivery", templateParams, "djl5JpoPh-0BB4PgO");
      console.log("Email sent successfully:", response);
      alert("Email sent successfully!");
      
      if (deliveryStatus === "Delivered") {
        moveToPastOrders(orderId);
      }
    } catch (error) {
      console.log("Error sending email:", error);
      alert("Error sending email. Please try again.");
    }
  };

  const moveToPastOrders = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    const orderToMove = orders.find((order) => order.id === orderId);
    setPastOrders((prevPastOrders) => [...prevPastOrders, orderToMove]);
  };

  // Fixed Excel Export Function
  const exportToExcel = () => {
    const allOrdersData = [...orders, ...pastOrders];
    
    if (allOrdersData.length === 0) {
      alert("No orders to export");
      return;
    }

    // Prepare CSV data with proper encoding
    const csvHeaders = [
      "Order ID",
      "Customer Name", 
      "Email",
      "Phone",
      "Address",
      "Total Amount",
      "Payment Mode",
      "Order Date",
      "Product Name",
      "Product Content",
      "Quantity",
      "Product Price",
      "Product Total",
      "Delivery Date",
      "Delivery Status"
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    allOrdersData.forEach((order) => {
      const baseOrderInfo = [
        `"${order.id}"`,
        `"${order.userDetails.name}"`,
        `"${order.userDetails.email}"`,
        `"${order.userDetails.phone || 'N/A'}"`,
        `"${order.userDetails.address || 'N/A'}"`,
        `"Rs ${order.grandTotal}"`, // Changed from ₹ to Rs to avoid encoding issues
        `"${order.paymentMode === 'cashOnDelivery' ? 'Cash on Delivery' : 'Online Payment'}"`,
        `"${order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleDateString('en-GB') : 'No timestamp'}"`,
      ];

      const deliveryDate = order.deliveryDate && order.deliveryDate.seconds 
        ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString('en-GB')
        : 'No delivery date';
      
      const deliveryStatus = order.deliveryStatus || 'Status not set';

      // Add each product as a separate row
      order.products.forEach((product) => {
        const productInfo = [
          `"${product.productName}"`,
          `"${product.content}"`,
          `"${product.qty}"`,
          `"Rs ${product.price}"`, // Changed from ₹ to Rs
          `"Rs ${product.total}"`, // Changed from ₹ to Rs
          `"${deliveryDate}"`,
          `"${deliveryStatus}"`
        ];
        
        csvContent += [...baseOrderInfo, ...productInfo].join(",") + "\n";
      });
    });

    // Create and download file with proper UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inline styles
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  const headingStyle = {
    margin: 0,
    color: '#333',
    fontSize: '2rem',
    fontWeight: '600'
  };

  const exportButtonStyle = {
    background: 'linear-gradient(135deg, #28a745, #4CAF50)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #dee2e6',
    color: '#495057'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    verticalAlign: 'top'
  };

  const submitButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  };

  const selectStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.9rem'
  };

  const pastOrdersSectionStyle = {
    marginTop: '3rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const responsiveStyle = window.innerWidth <= 768 ? {
    ...headerStyle,
    flexDirection: 'column',
    textAlign: 'center'
  } : headerStyle;

  const responsiveButtonStyle = window.innerWidth <= 768 ? {
    ...exportButtonStyle,
    width: '100%',
    justifyContent: 'center'
  } : exportButtonStyle;

  if (loading) return <div style={containerStyle}>Loading...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={responsiveStyle}>
        <h2 style={headingStyle}>Orders List</h2>
        <button 
          style={responsiveButtonStyle}
          onClick={exportToExcel}
          title="Export all orders to Excel"
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #218838, #4CAF50)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #28a745, #4CAF50)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
          }}
        >
          Export Excel
        </button>
      </div>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Customer Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Total Amount</th>
            <th style={thStyle}>Payment Mode</th>
            <th style={thStyle}>Order Date</th>
            <th style={thStyle}>Products</th>
            <th style={thStyle}>Set Delivery Date</th>
            <th style={thStyle}>Set Delivery Status</th>
            <th style={thStyle}>Submit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={tdStyle}>{order.id}</td>
              <td style={tdStyle}>{order.userDetails.name}</td>
              <td style={tdStyle}>{order.userDetails.email}</td>
              <td style={tdStyle}>₹{order.grandTotal}</td>
              <td style={tdStyle}>
                {order.paymentMode === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}
              </td>
              <td style={tdStyle}>
                {order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}
              </td>
              <td style={tdStyle}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {order.products.map((product, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <strong>{product.productName}</strong> ({product.content}) - Quantity: {product.qty}, Price: ₹{product.price}, Total: ₹{product.total}
                    </li>
                  ))}
                </ul>
              </td>
              <td style={tdStyle}>
                <DatePicker
                  selected={order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000) : null}
                  onChange={(date) => handleDateChange(date, order.id)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select Delivery Date"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </td>
              <td style={tdStyle}>
                <select 
                  value={order.deliveryStatus || ""} 
                  onChange={(e) => handleStatusChange(e.target.value, order.id)}
                  style={selectStyle}
                >
                  <option value="">Select Status</option>
                  <option value="Yet to deliver">Yet to deliver</option>
                  <option value="Delivery in process">Delivery in process</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delivery incomplete">Delivery incomplete</option>
                </select>
              </td>
              <td style={tdStyle}>
                <button 
                  onClick={() => handleFinalSubmit(order.id)}
                  style={submitButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4CAF50'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3e9c41ff'}
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pastOrders.length > 0 && (
        <div style={pastOrdersSectionStyle}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Past Orders</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Payment Mode</th>
                <th style={thStyle}>Order Date</th>
                <th style={thStyle}>Products</th>
                <th style={thStyle}>Delivery Date</th>
                <th style={thStyle}>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>{order.id}</td>
                  <td style={tdStyle}>{order.userDetails.name}</td>
                  <td style={tdStyle}>{order.userDetails.email}</td>
                  <td style={tdStyle}>₹{order.grandTotal}</td>
                  <td style={tdStyle}>{order.paymentMode === "cashOnDelivery" ? "Cash on Delivery" : "Online Payment"}</td>
                  <td style={tdStyle}>{order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}</td>
                  <td style={tdStyle}>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {order.products.map((product, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>
                          <strong>{product.productName}</strong> ({product.content}) - Quantity: {product.qty}, Price: ₹{product.price}, Total: ₹{product.total}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={tdStyle}>{order.deliveryDate ? new Date(order.deliveryDate.seconds * 1000).toLocaleDateString("en-GB") : "No delivery date"}</td>
                  <td style={tdStyle}>{order.deliveryStatus}</td>
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