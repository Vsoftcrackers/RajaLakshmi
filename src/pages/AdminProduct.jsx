import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar";
import UpArrow from "./UpArrow";
import ProductsUpload from "../admin/ProductsUpload";

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

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const AdminProduct = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hook to update state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch order status from Firebase
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const statusDoc = await getDoc(doc(db, "settings", "orderStatus"));
        if (statusDoc.exists()) {
          setOrdersEnabled(statusDoc.data().enabled);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  // Toggle orders and save to Firebase
  const toggleOrders = async () => {
    setSaving(true);
    const newStatus = !ordersEnabled;
    
    try {
      await setDoc(doc(db, "settings", "orderStatus"), {
        enabled: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setOrdersEnabled(newStatus);
      alert(`Orders ${newStatus ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="AboutUs-container">
      <Marquee />
      <div className="top-header">
        <div className="logo-container">
          <img src="assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="logo-Name-container">
          <img src="assets/Final_logo_Name.png" alt="Logo" className="logo-Name" />
        </div>
      </div>

      {/* Order Toggle Section */}
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>
          Order Management
        </h3>
        <button 
          onClick={toggleOrders}
          disabled={saving}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: saving ? '#999' : (ordersEnabled ? '#ef4444' : '#22c55e'),
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {saving ? 'Updating...' : (ordersEnabled ? 'Disable Orders' : 'Enable Orders')}
        </button>
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: ordersEnabled ? '#d4edda' : '#f8d7da',
          borderRadius: '5px',
          border: `1px solid ${ordersEnabled ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px',
            color: ordersEnabled ? '#155724' : '#721c24',
            fontWeight: 'bold'
          }}>
            Status: {ordersEnabled ? '✓ Orders Active' : '✗ Orders Disabled'}
          </p>
          <p style={{ 
            margin: '5px 0 0 0', 
            fontSize: '12px',
            color: '#666'
          }}>
            {ordersEnabled 
              ? 'Customers can add products to cart' 
              : 'All products will show as "Out of Stock"'
            }
          </p>
        </div>
      </div>
 
      <ProductsUpload />

      <UpArrow />
      <Footer />
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default AdminProduct;