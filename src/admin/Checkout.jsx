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
    phone: "",
    otp: "",
    paymentMode: "cashOnDelivery",
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [timerInterval, setTimerInterval] = useState(null); // To store the timer interval
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store the generated OTP
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };

  }, [isOtpSent, countdown, isOtpVerified]);

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2);
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      setProducts((prev) => prev.map(p => p.id === id ? { ...p, qty: newQty } : p));
      const productRef = doc(db, "cart", id);
      await updateDoc(productRef, { qty: newQty });
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const removeProduct = async (id) => {
    try {
      setProducts((prev) => prev.filter(p => p.id !== id));
      const productRef = doc(db, "cart", id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Error removing product. Please try again.');
    }
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

  // Generate a 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP via Email using EmailJS
  // Send OTP via Email using EmailJS
// Updated Send OTP function with comprehensive debugging
// Fixed Send OTP function that matches your EmailJS template exactly
const sendOtp = async () => {
  if (!formData.email || !formData.email.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }

  setIsLoading(true);

  try {
    // Generate a new OTP
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    
    console.log('Generated OTP:', newOtp);

    // Template parameters - EXACT match with your EmailJS template
    const templateParams = {
      // Main parameters (must match your template exactly)
      to_name: formData.name || 'Customer',
      otp_code: newOtp,
      verification_code: newOtp,  // Alternative format as shown in your template
      from_name: 'Rajalakshmi Crackers',
      message: `Your verification code is: ${newOtp}`, // For the debug line
      
      // Email routing (these are standard EmailJS parameters)
      to_email: formData.email,
      reply_to: formData.email
    };
    
    console.log('Sending email with these exact parameters:', templateParams);

    // Send email using EmailJS
    const response = await emailjs.send(
      'raja',  // Your service ID
      'raja_otp',  // Your template ID
      templateParams,
      '0QQy04iV544VKg3jp'  // Your public key
    );

    console.log('EmailJS Response:', response);
    
    if (response.status === 200 || response.status === 'OK') {
      setIsOtpSent(true);
      setCountdown(300);
      alert(`OTP sent successfully to ${formData.email}!\n\nPlease check your inbox and spam folder.\n\n[Debug - OTP: ${newOtp}]`);
    } else {
      throw new Error(`Email service returned status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error sending OTP email:', error);
    alert('Error sending OTP: ' + (error.message || error.text || 'Unknown error'));
    
    // Reset on error
    setGeneratedOtp("");
    setIsOtpSent(false);
  } finally {
    setIsLoading(false);
  }
};

// Make sure EmailJS is initialized properly
useEffect(() => {
  // Initialize EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init('0QQy04iV544VKg3jp');
    console.log('EmailJS initialized successfully');
  } else {
    console.error('EmailJS library not loaded');
  }
}, []);

  // Verify OTP entered by user
  const verifyOtp = async () => {
    if (!generatedOtp) {
      alert('Please send OTP first');
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      if (formData.otp === generatedOtp) {
        console.log('Email verified successfully');
        alert('Email verified successfully!');
        setIsOtpVerified(true);
        if (timerInterval) {
          clearInterval(timerInterval); // Stop the timer when OTP is verified
        }
      } else {
        alert('Invalid OTP! Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setIsOtpSent(false);
    setGeneratedOtp("");
    setFormData(prev => ({ ...prev, otp: '' }));
    await sendOtp();
  };

  const handleSubmit = async (paymentResponse) => {
    if (!isOtpVerified) {
      alert("Please verify your email address before submitting the order.");
      return;
    }

    // Validate form data
    const requiredFields = ['name', 'address', 'city', 'state', 'pincode', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    setIsLoading(true);
  
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
              phone: formData.phone,
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
          console.error('Error submitting order:', err);
          alert("Error submitting order: " + err.message);
        }
      }
    } else {
      // Handle Razorpay online payment flow
      alert("Proceeding with Online Payment.");
      handleRazorpayPayment();
    }
    
    setIsLoading(false);
  };
  
  // Razorpay Payment Handling (only after successful payment)
  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert('Payment service not available. Please try again later.');
      return;
    }

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
            phone: formData.phone,
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
          console.error('Error submitting order after payment:', err);
          alert("Payment successful but error submitting order: " + err.message);
        }
      },
      modal: {
        ondismiss: function() {
          alert('Payment cancelled');
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: "#3399cc",
      },
      timeout: 300, // 5 minutes timeout
    };
  
    try {
      // Create Razorpay instance and open the payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      alert('Error initiating payment. Please try again.');
    }
  };
  

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      {/* Products Card */}
      <div className="checkout-card">
        <h3>Your Products</h3>
        {products.length === 0 ? (
          <p>No products in cart</p>
        ) : (
          <>
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
                      <div className="Product-Quantity-wrapper">
                      <button 
                        className="Product-Quantity-Button" 
                        onClick={() => updateQuantity(product.id, product.qty - 1)}
                        disabled={isLoading}
                      >
                        -
                      </button>
                      {product.qty}
                      <button 
                        className="Product-Quantity-Button"  
                        onClick={() => updateQuantity(product.id, product.qty + 1)}
                        disabled={isLoading}
                      >
                        +
                      </button>
                      </div>
                    </td>
                    <td>₹{(product.qty * product.price).toFixed(2)}</td>
                    <td>
                      <button 
                        className="remove-btn" 
                        onClick={() => removeProduct(product.id)}
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Grand Total */}
            <p className="checkout-grand-total">Grand Total: ₹{calculateGrandTotal()}</p>
          </>
        )}
      </div>

      {/* Form Card */}
      <div className="checkout-card">
        <h3 style={{textAlign:"center"}}>Enter Your Details</h3>
        <form className="checkout-form">
          {/* Form fields for user details */}
          <div className="checkout-form-group">
            <label>Name: </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              disabled={isLoading}
              required 
            />
          </div>
          
          <div className="checkout-form-group">
            <label>Email ID: </label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              disabled={isLoading || isOtpSent}
              required 
            />
          </div>

          <div className="checkout-form-group">
            <label>Phone Number: </label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              disabled={isLoading}
              pattern="[0-9]{10}"
              maxLength="10"
              placeholder="Enter 10-digit mobile number"
              required 
            />
          </div>

          <div className="checkout-form-group">
            <label>Address: </label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              disabled={isLoading}
              required 
            />
          </div>
          
          <div className="checkout-form-group">
            <label>City: </label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleInputChange} 
              disabled={isLoading}
              required 
            />
          </div>
          
          <div className="checkout-form-group">
            <label>State: </label>
            <input 
              type="text" 
              name="state" 
              value={formData.state} 
              onChange={handleInputChange} 
              disabled={isLoading}
              required 
            />
          </div>
          
          <div className="checkout-form-group">
            <label>Pincode: </label>
            <input 
              type="text" 
              name="pincode" 
              value={formData.pincode} 
              onChange={handleInputChange} 
              disabled={isLoading}
              pattern="[0-9]{6}"
              maxLength="6"
              required 
            />
          </div>
          
          <hr/>
          
          {/* Email OTP Section */}
          <div className="checkout-otp-section">
            {!isOtpSent ? (
              <button 
                type="button" 
                onClick={sendOtp}
                disabled={!formData.email || !formData.email.includes('@') || isLoading}
                className="otp-btn"
              >
                {isLoading ? 'Sending...' : 'Send OTP to Email'}
              </button>
            ) : (
              <div className="otp-verification-section">
                <div className="checkout-form-group">
                  <label>Enter OTP: </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit OTP from email"
                    maxLength="6"
                    disabled={isLoading || isOtpVerified}
                    required
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={verifyOtp} 
                  disabled={isOtpVerified || !formData.otp || formData.otp.length !== 6 || isLoading}
                  className="verify-otp-btn"
                >
                  {isLoading ? 'Verifying...' : (isOtpVerified ? 'Verified ✓' : 'Verify OTP')}
                </button>
                
                <div className="otp-timer">
                  <p>Time Left: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}</p>
                  {countdown === 0 && !isOtpVerified && (
                    <button 
                      type="button" 
                      onClick={resendOtp} 
                      disabled={isOtpVerified || isLoading}
                      className="resend-otp-btn"
                    >
                      {isLoading ? 'Sending...' : 'Resend OTP'}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit order */}
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="checkout-submit-btn"
            disabled={!isOtpVerified || isLoading || products.length === 0}
          >
            {isLoading ? 'Processing...' : 'Submit Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;