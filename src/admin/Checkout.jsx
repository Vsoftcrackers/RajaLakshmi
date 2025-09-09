import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
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

// Cart utility functions (same as ProductList)
const CART_STORAGE_KEY = 'rajalakshmi_crackers_cart';

const saveCartToStorage = (cartItems) => {
  try {
    const cartData = {
      items: cartItems,
      timestamp: Date.now(),
      expiry: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days expiry
    };
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.warn('Failed to save cart to storage:', error);
  }
};

const loadCartFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const cartData = JSON.parse(stored);
    
    // Check if cart has expired
    if (Date.now() > cartData.expiry) {
      sessionStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }

    return cartData.items || [];
  } catch (error) {
    console.warn('Failed to load cart from storage:', error);
    return [];
  }
};

const clearCartStorage = () => {
  try {
    sessionStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart storage:', error);
  }
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get products from navigation state or fallback to storage
  const getInitialProducts = () => {
    if (location.state?.selectedProducts) {
      return location.state.selectedProducts;
    }
    
    // Fallback to storage if no state (e.g., direct URL access or refresh)
    const storageProducts = loadCartFromStorage();
    if (storageProducts.length === 0) {
      // If no cart items, redirect to products page
      setTimeout(() => {
        navigate("/products");
      }, 100);
    }
    return storageProducts;
  };

  const [products, setProducts] = useState(getInitialProducts());
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

  // Auto-save cart when products change
  useEffect(() => {
    if (products.length > 0) {
      saveCartToStorage(products);
    }
  }, [products]);

  // Check if cart is empty and redirect
  useEffect(() => {
    if (products.length === 0 && !showSuccessPopup) {
      const timer = setTimeout(() => {
        navigate("/products");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [products.length, navigate, showSuccessPopup]);

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => total + (product.qty * product.price), 0).toFixed(2);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeProduct(id);
      return;
    }
    
    setProducts((prev) => {
      const updated = prev.map(p => p.id === id ? { ...p, qty: newQty } : p);
      saveCartToStorage(updated); // Save to storage immediately
      return updated;
    });
  };

  const removeProduct = (id) => {
    setProducts((prev) => {
      const updated = prev.filter(p => p.id !== id);
      if (updated.length === 0) {
        clearCartStorage(); // Clear storage if cart becomes empty
      } else {
        saveCartToStorage(updated); // Save updated cart
      }
      return updated;
    });
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
      // Only send emails if customer provided an email address
      if (!formData.email || !formData.email.trim()) {
        console.log('No email provided, skipping email notifications');
        return;
      }

      // Format product list for plain text display (matching your template structure)
      const productList = orderData.products.map(product => 
        `${product.productName.padEnd(25)} ${product.content.padEnd(20)} ${product.qty.toString().padEnd(10)} ₹${product.price.toFixed(2).padEnd(15)} ₹${product.total.toFixed(2)}`
      ).join('\n');

      // Customer email template parameters (if you have a separate customer template)
      const customerTemplateParams = {
        to_name: formData.name,
        to_email: formData.email,
        from_name: 'Rajalakshmi Crackers',
        order_id: orderData.orderId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        product_list: orderData.products.map(p => `${p.productName} (${p.content}) - Qty: ${p.qty} - ₹${p.total}`).join('\n'),
        grand_total: orderData.grandTotal,
        order_date: new Date().toLocaleDateString(),
        message: 'Thank you for your order! We will process it shortly.'
      };

      // Send customer confirmation email (if you have customer_order_confirmation template)
      try {
        await emailjs.send(
          'raja',
          'customer_order_confirmation',
          customerTemplateParams,
          '0QQy04iV544VKg3jp'
        );
      } catch (error) {
        console.log('Customer email template not found or failed, continuing with admin email...');
      }

      // Admin email template parameters (using your template ID: 'order')
      const adminTemplateParams = {
        to_name: 'Admin',
        to_email: 'rajalakshmicrackers@gmail.com', // This will be overridden by your template settings
        from_name: 'Rajalakshmi Crackers Order System',
        order_id: orderData.orderId,
        customer_name: formData.name,
        customer_email: formData.email || 'Not provided',
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        product_list: productList, // Formatted product list for display
        grand_total: orderData.grandTotal,
        order_date: new Date().toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        message: `New order #${orderData.orderId} received and requires immediate processing.`
      };

      // Send admin notification email using your template ID 'order'
      await emailjs.send(
        'raja',              // Your service ID
        'order',             // Your template ID
        adminTemplateParams,
        '0QQy04iV544VKg3jp'  // Your public key
      );

      console.log('Order confirmation emails sent successfully');

    } catch (error) {
      console.error('Error sending order confirmation emails:', error);
      // Don't throw error - order should still be processed even if emails fail
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    clearCartStorage(); // Clear cart after successful order
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
      { field: 'phone', minLength: 10, maxLength: 10 }
    ];

    // Validate required fields
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

    // Validate email only if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
      }
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
      navigate("/products");
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
          email: formData.email.trim().toLowerCase() || null, // Store as null if empty
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

  // Show loading message if cart is being loaded
  if (products.length === 0 && !showSuccessPopup) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <p>Redirecting to products page...</p>
          <button onClick={() => navigate("/products")} className="checkout-submit-btn">
            Go to Products
          </button>
        </div>
      </div>
    );
  }

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
              <p>Thank you for your order. <br/> We will get back to you soon with the delivery and payment details.</p>
              <p className="success-note">You will receive a phone call shortly.</p>
              <button className="success-popup-btn" onClick={closeSuccessPopup}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="checkout-card">
        <h3>Your Cart ({products.length} items)</h3>
        {products.length === 0 ? (
          <div className="empty-cart">
            <p>No products in cart</p>
            <button onClick={() => navigate("/products")} className="checkout-submit-btn">
              Go to Products
            </button>
          </div>
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

            <div className="cart-summary">
              <p className="checkout-grand-total">Grand Total: ₹{calculateGrandTotal()}</p>
              
            </div>
          </>
        )}
      </div>

      {products.length > 0 && (
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
              <p><strong>A delivery fee will be charged depending on the package's weight and your city.</strong> </p>
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
      )}
    </div>
  );
};

export default Checkout;