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
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          qty: 0, // Initialize qty for each product
        }));
        setProducts(productsData);
      } catch (err) {
        setError("Error fetching products.");
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
      return prevProducts.map(product => {
        if (product.id === productId) {
          const updatedQty = Math.max(0, product.qty + change);
          return { ...product, qty: updatedQty };
        }
        return product;
      });
    });

    // Automatically update the checkout list
    setSelectedProducts(prevSelectedProducts => {
      const updatedList = products
        .map(product =>
          product.id === productId ? { ...product, qty: Math.max(0, product.qty + change) } : product
        )
        .filter(product => product.qty > 0); // Only keep products with qty > 0

      return updatedList;
    });
  };

  // Calculate grand total dynamically
  const calculateGrandTotal = () => {
    return selectedProducts
      .reduce((total, product) => total + product.qty * product.price, 0)
      .toFixed(2);
  };

  // Navigate to checkout with selected products
  const handleCheckout = () => {
    navigate("/checkout", { state: { selectedProducts } });
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const { category } = product;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) return <div className="product-list-loading">Loading...</div>;
  if (error) return <div className="product-list-error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr className="table-head">
              <th>Product Name</th>
              <th>Content</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedProducts).map(category => (
              <React.Fragment key={category}>
                <tr>
                  <td colSpan="5" className="category-heading">
                    <strong>{category}</strong>
                  </td>
                </tr>
                {groupedProducts[category].map(product => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>{product.content}</td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>
                      <button
                        className="product-quantity-button"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={product.qty <= 0}
                      >
                        -
                      </button>
                      {product.qty}
                      <button
                        className="product-quantity-button"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        +
                      </button>
                    </td>
                    <td>₹{(product.qty * product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grand-total-container">
        <p className="grand-total-text">Grand Total: ₹{calculateGrandTotal()}</p>
        <button className="checkout-button" onClick={handleCheckout}>
          <FaCartArrowDown className="cart" />
        </button>
      </div>
    </div>
  );
};

export default ProductList;
