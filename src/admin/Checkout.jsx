import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc  } from "firebase/firestore"; 
import { getApps, initializeApp } from "firebase/app"; 
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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
const auth = getAuth(app); // Initialize Firebase Auth

const Checkout = () => {
  const location = useLocation();
  const { selectedProducts } = location.state || {};
  const [products, setProducts] = useState(selectedProducts || []);
  const recaptchaRef = useRef(null); // Use ref for reCAPTCHA container
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phone: "", // Phone field for OTP
    otp: "",
    paymentMode: "cashOnDelivery",
  });

  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [timerInterval, setTimerInterval] = useState(null); // To store the timer interval
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    // Wait for DOM to be ready before initializing reCAPTCHA
    const initializeRecaptcha = () => {
      try {
        // Check if the container exists and reCAPTCHA is not already initialized
        if (recaptchaRef.current && !recaptchaVerifier) {
          const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
            size: 'normal',
            callback: (response) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              // Reset reCAPTCHA on expiration
              setRecaptchaVerifier(null);
            }
          });
          setRecaptchaVerifier(verifier);
        }
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(initializeRecaptcha, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, []); // Empty dependency array to run only once

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

  // Send OTP to phone using Firebase Phone Authentication
  const sendOtp = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    // Format phone number for India (add +91 if not present)
    let phoneNumber = formData.phone.trim();
    if (!phoneNumber.startsWith('+91')) {
      phoneNumber = '+91' + phoneNumber;
    }

    try {
      if (!recaptchaVerifier) {
        // Try to reinitialize reCAPTCHA if it's not available
        if (recaptchaRef.current) {
          const newVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
            size: 'normal',
            callback: (response) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
            }
          });
          setRecaptchaVerifier(newVerifier);
          
          // Use the new verifier
          const confirmation = await signInWithPhoneNumber(auth, phoneNumber, newVerifier);
          setConfirmationResult(confirmation);
          setIsOtpSent(true);
          setCountdown(300); // Reset countdown to 5 minutes
          alert('OTP sent to your phone number!');
        } else {
          throw new Error('reCAPTCHA not available. Please refresh the page.');
        }
      } else {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        setConfirmationResult(confirmation);
        setIsOtpSent(true);
        setCountdown(300); // Reset countdown to 5 minutes
        alert('OTP sent to your phone number!');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP: ' + error.message);
      
      // Reset reCAPTCHA on error
      setRecaptchaVerifier(null);
      if (recaptchaRef.current) {
        try {
          const newVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
            size: 'normal',
            callback: (response) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
            }
          });
          setRecaptchaVerifier(newVerifier);
        } catch (recaptchaError) {
          console.error('Error reinitializing reCAPTCHA:', recaptchaError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP using Firebase Phone Authentication
  const verifyOtp = async () => {
    if (!confirmationResult) {
      alert('Please send OTP first');
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmationResult.confirm(formData.otp);
      console.log('Phone number verified successfully:', result);
      alert('Phone number verified successfully!');
      setIsOtpVerified(true);
      if (timerInterval) {
        clearInterval(timerInterval); // Stop the timer when OTP is verified
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setIsOtpSent(false);
    setConfirmationResult(null);
    setFormData(prev => ({ ...prev, otp: '' }));
    await sendOtp();
  };

  const handleSubmit = async (paymentResponse) => {
    if (!isOtpVerified) {
      alert("Please verify your phone number before submitting the order.");
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
              disabled={isLoading}
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
          
          {/* Phone OTP Section */}
          <div className="checkout-otp-section">
            <div className="checkout-form-group">
              <label>Phone Number: </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                disabled={isLoading || isOtpSent}
                required
              />
            </div>

            {/* reCAPTCHA container - required for Firebase Phone Auth */}
            <div 
              ref={recaptchaRef}
              id="recaptcha-container" 
              style={{ marginBottom: '10px', minHeight: '78px' }}
            ></div>

            {!isOtpSent ? (
              <button 
                type="button" 
                onClick={sendOtp}
                disabled={!formData.phone || formData.phone.length !== 10 || isLoading}
                className="otp-btn"
              >
                {isLoading ? 'Sending...' : 'Send OTP to Phone'}
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
                    placeholder="Enter 6-digit OTP"
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