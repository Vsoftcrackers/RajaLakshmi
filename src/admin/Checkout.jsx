import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc  } from "firebase/firestore"; 
import { getApps, initializeApp } from "firebase/app"; 
import emailjs from "emailjs-com";
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

const db = getFirestore(app);
const Checkout = () => {
  const location = useLocation();
  const { selectedProducts } = location.state || {};
  const [products, setProducts] = useState(selectedProducts || []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
      alert('Error updating quantity. Please try again.');
    }
  };

  const removeProduct = async (id) => {
    try {
      setProducts((prev) => prev.filter(p => p.id !== id));
      const productRef = doc(db, "cart", id);
      await deleteDoc(productRef);
    } catch (error) {
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

  const sendOrderConfirmationEmails = async (orderData) => {
    try {
      const productList = orderData.products.map(product => 
        `${product.productName} (${product.content}) - Qty: ${product.qty} - ₹${product.total}`
      ).join('\n');

      const customerTemplateParams = {
        to_name: formData.name,
        to_email: formData.email,
        from_name: 'Rajalakshmi Crackers',
        order_id: `ORD-${Date.now()}`,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        product_list: productList,
        grand_total: orderData.grandTotal,
        order_date: new Date().toLocaleDateString(),
        message: 'Thank you for your order! We will process it shortly.'
      };

      await emailjs.send(
        'raja',
        'customer_order_confirmation',
        customerTemplateParams,
        '0QQy04iV544VKg3jp'
      );

      const adminTemplateParams = {
        to_name: 'Admin',
        from_name: 'Rajalakshmi Crackers System',
        order_id: `ORD-${Date.now()}`,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        product_list: productList,
        grand_total: orderData.grandTotal,
        order_date: new Date().toLocaleDateString(),
        message: 'New order received from customer'
      };

      await emailjs.send(
        'raja',
        'admin_order_notification',
        adminTemplateParams,
        '0QQy04iV544VKg3jp'
      );

    } catch (error) {
      // Don't throw error - order should still be processed even if emails fail
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/products");
  };

  useEffect(() => {
    if (typeof emailjs !== 'undefined') {
      emailjs.init('0QQy04iV544VKg3jp');
    }
  }, []);

  const handleSubmit = async () => {
    // Enhanced form validation
    const requiredFields = [
      { field: 'name', minLength: 2 },
      { field: 'address', minLength: 10 },
      { field: 'city', minLength: 2 },
      { field: 'state', minLength: 2 },
      { field: 'pincode', minLength: 6, maxLength: 6 },
      { field: 'email', minLength: 5 },
      { field: 'phone', minLength: 10, maxLength: 10 }
    ];

    for (const { field, minLength, maxLength } of requiredFields) {
      const value = formData[field]?.trim() || '';
      if (!value || value.length < minLength) {
        alert(`Please enter a valid ${field} (minimum ${minLength} characters).`);
        return;
      }
      if (maxLength && value.length > maxLength) {
        alert(`${field} should not exceed ${maxLength} characters.`);
        return;
      }
    }

    // Additional validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert('Please enter a valid 6-digit pincode.');
      return;
    }

    if (products.length === 0) {
      alert("Your cart is empty. Please add products before placing an order.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to place this order?");
    if (!isConfirmed) return;

    setIsLoading(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const orderData = {
        orderId,
        userDetails: {
          name: formData.name.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
        },
        products: products.map(product => ({
          productName: product.productName,
          content: product.content,
          price: parseFloat(product.price),
          qty: parseInt(product.qty),
          total: parseFloat((product.qty * product.price).toFixed(2)),
        })),
        grandTotal: parseFloat(calculateGrandTotal()),
        paymentMode: "Cash on Delivery",
        orderStatus: "Pending",
        timestamp: new Date(),
      };

      // Add timeout for Firestore operation
      const firestorePromise = addDoc(collection(db, "orders"), orderData);
      const firestoreTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 30000)
      );

      await Promise.race([firestorePromise, firestoreTimeout]);
      
      // Send emails (non-blocking)
      sendOrderConfirmationEmails(orderData).catch(() => {
        // Email failure shouldn't affect order success
      });

      // Show success popup instead of alert
      setShowSuccessPopup(true);
      
      // Clear form
      setProducts([]);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        email: "",
        phone: "",
      });

    } catch (err) {
      let errorMessage = "Error submitting order. Please try again.";
      
      if (err.message.includes('timeout')) {
        errorMessage = "Request timed out. Please check your internet connection and try again.";
      } else if (err.code === 'permission-denied') {
        errorMessage = "Permission denied. Please refresh the page and try again.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-popup-content">
              <div className="success-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                  <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your order. We will get back to you soon with the delivery details.</p>
              <p className="success-note">You will receive a phone call shortly.</p>
              <button className="success-popup-btn" onClick={closeSuccessPopup}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

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

            <p className="checkout-grand-total">Grand Total: ₹{calculateGrandTotal()}</p>
          </>
        )}
      </div>

      <div className="checkout-card">
        <h3 style={{textAlign:"center"}}>Enter Your Details</h3>
        <form className="checkout-form">
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
            <label>Phone Number: </label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
              disabled={isLoading}
              pattern="[0-9]{10}"
              maxLength="10"
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

          <div className="payment-info">
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
            <p className="payment-note">Payment will be collected upon delivery of your order.</p>
          </div>

          <button 
            type="button" 
            onClick={handleSubmit} 
            className="checkout-submit-btn"
            disabled={isLoading || products.length === 0}
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;