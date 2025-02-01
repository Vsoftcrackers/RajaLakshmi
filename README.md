import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc  } from "firebase/firestore"; 
import { getApps, initializeApp } from "firebase/app"; 
import emailjs from "emailjs-com"; // Import EmailJS
import "./Checkout.css";

// Firebase config
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

const db = getFirestore(app); // Initialize Firestore

const Checkout = () => {
  const location = useLocation();
  const { selectedProducts } = location.state || {};
  const [products, setProducts] = useState(selectedProducts || []);

  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phone: "", // Added phone field
    otp: "",
    otpSent: "",
    paymentMode: "cashOnDelivery",
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [timerInterval, setTimerInterval] = useState(null); // To store the timer interval

  // Start the timer when OTP is sent
  useEffect(() => {
    if (isOtpSent && countdown > 0 && !isOtpVerified) {
      const interval = setInterval(() => {
        setCountdown((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);  // Stop the timer when countdown reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setTimerInterval(interval); // Store the interval ID to clear it later

      return () => clearInterval(interval); // Cleanup interval when component unmounts or timer ends
    }
    // Clean up the interval when OTP is verified
    return () => clearInterval(timerInterval);

  }, [isOtpSent, countdown, isOtpVerified]);

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2);
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, qty: newQty } : p));
    const productRef = doc(db, "cart", id);
    await updateDoc(productRef, { qty: newQty });
  };

  const removeProduct = async (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
    const productRef = doc(db, "cart", id);
    await deleteDoc(productRef);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentModeChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      paymentMode: e.target.value,
    }));
  };

  // Send OTP via EmailJS
  const sendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const templateParams = {
      otp: otp,
      to_email: formData.email, // Send OTP to the entered email
    };

    // Send OTP using EmailJS
    emailjs
      .send('raja', 'raja', templateParams, '0QQy04iV544VKg3jp')
      .then(
        (response) => {
          console.log('OTP sent successfully:', response);
          setIsOtpSent(true);
          alert('OTP sent to your email!');
          setFormData((prevState) => ({
            ...prevState,
            otpSent: otp.toString().trim(), // Save OTP temporarily
          }));
          setCountdown(300); // Reset countdown to 5 minutes (300 seconds)
        },
        (error) => {
          console.log('Error sending OTP:', error);
          alert('Error sending OTP. Please try again.');
        }
      );
  };

  // Verify OTP
  const verifyOtp = () => {
    const enteredOtp = formData.otp.trim();
    const sentOtp = formData.otpSent.trim();

    console.log('Entered OTP:', enteredOtp);
    console.log('Sent OTP:', sentOtp);

    if (enteredOtp === sentOtp) {
      alert('OTP verified successfully!');
      setIsOtpVerified(true); // OTP is verified
      clearInterval(timerInterval); // Stop the timer when OTP is verified
    } else {
      alert('Invalid OTP! Please try again.');
    }
  };
 

  const handleSubmit = async (paymentResponse) => {
    if (!isOtpVerified) {
      alert("Please verify your email before submitting the order.");
      return;
    }
  
    if (formData.paymentMode === "cashOnDelivery") {
      const isConfirmed = window.confirm("Are you sure you want to choose Cash on Delivery?");
      if (isConfirmed) {
        try {
          // Process order data for Cash on Delivery directly
          const orderData = {
            userDetails: {
              name: formData.name,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              email: formData.email,
            },
            products: selectedProducts.map(product => ({
              productName: product.productName,
              content: product.content,
              price: product.price,
              qty: product.qty,
              total: (product.qty * product.price).toFixed(2), // Ensure the total is a string formatted as currency
            })),
            grandTotal: calculateGrandTotal(),
            paymentMode: formData.paymentMode,
            timestamp: new Date(),
          };
  
          // Save to Firestore
          await addDoc(collection(db, "orders"), orderData);
          alert("Order submitted successfully!");
  
          // Send email notification to admin
          const templateParams = {
            user_name: formData.name,  // Only send user name for notification
          };
  
          // Send email to admin with order notification
          emailjs.send(
            'raja',  // Your service ID (can be found in EmailJS dashboard)
            'order',  // Template name (update with your template name in EmailJS)
            templateParams,
            '0QQy04iV544VKg3jp'  // Your user ID (can be found in EmailJS dashboard)
          ).then(
            (response) => {
              console.log("Admin email sent successfully:", response);
            },
            (error) => {
              console.log("Error sending email:", error);
            }
          );
        } catch (err) {
          alert("Error submitting order: " + err.message);
        }
      }
    } else {
      // Handle Razorpay online payment flow
      alert("Proceeding with Online Payment.");
      handleRazorpayPayment();
    }
  };
  
  // Razorpay Payment Handling (only after successful payment)
  const handleRazorpayPayment = async () => {
    const options = {
      key: "rzp_test_2vy84Z7twS2OvK", // Your Razorpay Key ID
      amount: calculateGrandTotal() * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      name: "Rajalakshmi Crackers", // Company name or product name
      description: "Payment for order at Rajalakshmi Crackers",
      image: "https://your-logo-url.com/logo.png", // Optional: Add your logo here
      handler: async function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
  
        // Only after successful payment, save the order and send the email
        const orderData = {
          userDetails: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            email: formData.email,
          },
          products: selectedProducts.map(product => ({
            productName: product.productName,
            content: product.content,
            price: product.price,
            qty: product.qty,
            total: (product.qty * product.price).toFixed(2), // Ensure the total is a string formatted as currency
          })),
          grandTotal: calculateGrandTotal(),
          paymentMode: formData.paymentMode,
          timestamp: new Date(),
          paymentId: response.razorpay_payment_id, // Save Razorpay payment ID
        };
  
        try {
          // Save order data to Firestore after successful payment
          await addDoc(collection(db, "orders"), orderData);
          alert("Order submitted successfully!");
  
          // Send the order details email to admin
          const templateParams = {
            user_name: formData.name, // Send only user name for notification
          };
  
          // Send email to admin with order notification
          emailjs.send(
            'raja',  // Your service ID (can be found in EmailJS dashboard)
            'order',  // Template name (update with your template name in EmailJS)
            templateParams,
            '0QQy04iV544VKg3jp'  // Your user ID (can be found in EmailJS dashboard)
          ).then(
            (response) => {
              console.log("Admin email sent successfully:", response);
            },
            (error) => {
              console.log("Error sending email:", error);
            }
          );
        } catch (err) {
          alert("Error submitting order: " + err.message);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    // Create Razorpay instance and open the payment modal
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
  

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      {/* Products Card */}
      <div className="checkout-card">
        <h3>Your Products</h3>
        <table className="checkout-product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Content</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.productName}</td>
                <td>{product.content}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => updateQuantity(product.id, product.qty - 1)}>-</button>
                  {product.qty}
                  <button onClick={() => updateQuantity(product.id, product.qty + 1)}>+</button>
                </td>
                <td>₹{(product.qty * product.price).toFixed(2)}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeProduct(product.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total */}
        <p className="checkout-grand-total">Grand Total: ₹{calculateGrandTotal()}</p> {/* Change dollar symbol to rupee symbol */}
      </div>

      {/* Form Card */}
      <div className="checkout-card">
        <h3>Enter Your Details</h3>
        <form className="checkout-form">
          {/* Form fields for user details */}
          <div className="checkout-form-group">
            <label>Name: </label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="checkout-form-group">
            <label>Address: </label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
          <div className="checkout-form-group">
          <label>Phn.no: </label>
           <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange}
            required  />
          </div>
          <div className="checkout-form-group">
            <label>City: </label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
          </div>
          <div className="checkout-form-group">
            <label>State: </label>
            <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
          </div>
          <div className="checkout-form-group">
            <label>Pincode: </label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
          </div>

          {/* OTP and Email verification */}
          <div className="checkout-otp-section">
            <label>Email ID: </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {!isOtpSent ? (
              <button type="button" onClick={sendOtp}>Send OTP</button>
            ) : (
              <div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter OTP"
                  required
                />
                <button type="button" onClick={verifyOtp} disabled={isOtpVerified}>
                  Verify OTP
                </button>
                <div>
                  <p>{`Time Left: ${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}`}</p>
                  {countdown === 0 && !isOtpVerified && (
                    <button type="button" onClick={sendOtp} disabled={isOtpVerified}>
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment method selection */}
          <div className="checkout-payment-methods">
            <div className="cashondel">
            <label>
              Cash on Delivery
            </label>
              <input
                type="radio"
                name="paymentMode"
                value="cashOnDelivery"
                checked={formData.paymentMode === "cashOnDelivery"}
                onChange={handlePaymentModeChange}
              />
            </div>
            <div className="cashondel">
            <label>
              Online Payment
            </label>
            <input
                type="radio"
                name="paymentMode"
                value="onlinePayment"
                checked={formData.paymentMode === "onlinePayment"}
                onChange={handlePaymentModeChange}
              />
              </div>
          </div>

          {/* Submit order */}
          <button type="button" onClick={handleSubmit} className="checkout-submit-btn">Submit Order</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
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
