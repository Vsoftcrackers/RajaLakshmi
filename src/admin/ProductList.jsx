import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";

import "./Products.css";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD3Kc5IV2ZU3FgqAV0PLBGGj7YTLXTsV_o",
  authDomain: "crackers-shop-1ccee.firebaseapp.com",
  projectId: "crackers-shop-1ccee",
  storageBucket: "crackers-shop-1ccee.firebasestorage.app",
  messagingSenderId: "530523718936",
  appId: "1:530523718936:web:fa404d5ae610d804e30a6d",
  measurementId: "G-8JB07Y4M5J",
};

// Initialize Firebase only if it's not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const querySnapshot = await getDocs(collection(db, "products"));

        if (querySnapshot.empty) {
          setError("No products found. Please upload products using the admin panel first.");
          return;
        }

        const productsData = [];

        querySnapshot.docs.forEach((doc, index) => {
          const data = doc.data();

          const product = {
            id: doc.id,
            serialNo: data.serialNo || index + 1,
            productName: data.productName || "Unknown Product",
            content: data.content || "No content provided",
            price: parseFloat(data.price) || 0,
            category: data.category || "Uncategorized",
            availableQty: data.availableQty || 0,
            qty: 0, // Initialize cart quantity
            createdAt: data.createdAt
          };

          productsData.push(product);
        });

        // Sort products by serialNo in ascending order
        productsData.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0));

        setProducts(productsData);

      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle quantity change and update checkout list dynamically
  const handleQuantityChange = (productId, change) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        if (product.id === productId) {
          const newQty = Math.max(0, product.qty + change);
          return { ...product, qty: newQty };
        }
        return product;
      });

      // Update selected products based on updated products
      const newSelectedProducts = updatedProducts.filter(product => product.qty > 0);
      setSelectedProducts(newSelectedProducts);

      return updatedProducts;
    });
  };

  // Calculate grand total dynamically
  const calculateGrandTotal = () => {
    const total = selectedProducts
      .reduce((total, product) => total + (product.qty * product.price), 0);
    return total.toFixed(2);
  };

  // Navigate to checkout with selected products
  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }

    navigate("/checkout", { state: { selectedProducts } });
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Refresh products
  const refreshProducts = () => {
    window.location.reload();
  };

  if (loading) return (
    <div className="product-list-loading">
      <p>Loading products...</p>
      <small>If this takes too long, check if products have been uploaded via admin panel.</small>
    </div>
  );

  if (error) return (
    <div className="product-list-error">
      <p>{error}</p>
      <button onClick={refreshProducts} className="retry-button">
        Retry Loading Products
      </button>
    </div>
  );

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1 className="product-list-title">Product List</h1>
        <button onClick={refreshProducts} className="refresh-button">
          Refresh Products
        </button>
      </div>

      <div className="product-summary">
        <p>Total Products: {products.length}</p>
        <p>Categories: {Object.keys(groupedProducts).length}</p>
        <p>Selected Items: {selectedProducts.length}</p>
      </div>

      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr className="table-header">
              <th className="col-serial">SI.No</th>
              <th className="col-name">Product Name</th>
              <th className="col-content">Content</th>
              <th className="col-price">Price</th>
              <th className="col-quantity">Quantity</th>
              <th className="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedProducts).map(category => (
              <React.Fragment key={category}>
                <tr className="category-row">
                  <td colSpan="6" className="category-header">
                    {category} ({groupedProducts[category].length} items)
                  </td>
                </tr>
                {groupedProducts[category].map(product => (
                  <tr key={product.id} className="product-row">
                    <td className="serial-cell">{product.serialNo}</td>
                    <td className="name-cell">
                      <div>
                        {product.productName}
                        {product.availableQty > 0 && (
                          <small style={{color: '#666', display: 'block'}}>
                            Stock: {product.availableQty}
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="content-cell">{product.content}</td>
                    <td className="price-cell">₹{product.price.toFixed(2)}</td>
                    <td className="quantity-cell">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn minus-btn"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={product.qty <= 0}
                        >
                          -
                        </button>
                        <span className="quantity-display">{product.qty}</span>
                        <button
                          className="quantity-btn plus-btn"
                          onClick={() => handleQuantityChange(product.id, 1)}
                          disabled={product.availableQty > 0 && product.qty >= product.availableQty}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="total-cell">₹{(product.qty * product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Bottom Checkout Bar */}
      <div className="checkout-bar">
        <div className="grand-total-section">
          <span className="grand-total-label">Grand Total:</span>
          <span className="grand-total-amount">₹{calculateGrandTotal()}</span>
        </div>
        <button 
          className="checkout-button" 
          onClick={handleCheckout}
          disabled={selectedProducts.length === 0}
        >
          <FaCartArrowDown className="cart-icon" />
          <span className="checkout-text">
            Proceed to pay ({selectedProducts.length} items)
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductList;