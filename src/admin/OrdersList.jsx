import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import OderBack from "./OderBack";

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
  const [pastOrders, setPastOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        
        // Update the local state to remove the deleted order
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        // Remove from selected orders if it was selected
        setSelectedOrders(prev => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
        
        alert("Order deleted successfully!");
        console.log("Order deleted successfully");
      } catch (err) {
        console.error("Error deleting order: ", err);
        alert("Error deleting order. Please try again.");
      }
    }
  };

  const handleOrderSelection = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders(new Set());
    } else {
      const allOrderIds = [...orders, ...pastOrders].map(order => order.id);
      setSelectedOrders(new Set(allOrderIds));
    }
    setSelectAll(!selectAll);
  };

  // Updated export function to export only selected orders
  const exportToExcel = () => {
    const allOrdersData = [...orders, ...pastOrders];
    const selectedOrdersData = allOrdersData.filter(order => selectedOrders.has(order.id));
    
    if (selectedOrdersData.length === 0) {
      alert("Please select orders to export");
      return;
    }

    // Prepare CSV data with proper encoding
    const csvHeaders = [
      "Order ID",
      "Customer Name", 
      "Mobile Number",
      "Address",
      "Total Amount",
      "Order Date",
      "Product Name",
      "Product Content",
      "Quantity",
      "Product Price",
      "Product Total"
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    selectedOrdersData.forEach((order) => {
      const baseOrderInfo = [
        `"${order.id}"`,
        `"${order.userDetails.name}"`,
        `"${order.userDetails.phone || 'N/A'}"`,
        `"${order.userDetails.address || 'N/A'}"`,
        `" ${order.grandTotal}"`, // Changed from ₹ to Rs to avoid encoding issues
        `"${order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleDateString('en-GB') : 'No timestamp'}"`,
      ];

      // Add each product as a separate row
      order.products.forEach((product) => {
        const productInfo = [
          `"${product.productName}"`,
          `"${product.content}"`,
          `"${product.qty}"`,
          `"${product.price}"`, // Changed from ₹ to Rs
          `"${product.total}"` // Changed from ₹ to Rs
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
    link.setAttribute("download", `selected_orders_${new Date().toISOString().split('T')[0]}.csv`);
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

  const controlsStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const selectAllStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    color: '#495057'
  };

  const exportButtonStyle = {
    background: selectedOrders.size > 0 
      ? 'linear-gradient(135deg, #28a745, #4CAF50)' 
      : 'linear-gradient(135deg, #6c757d, #adb5bd)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: selectedOrders.size > 0 ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease',
    boxShadow: selectedOrders.size > 0 
      ? '0 2px 8px rgba(40, 167, 69, 0.3)' 
      : '0 2px 8px rgba(108, 117, 125, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const selectionCountStyle = {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '500'
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

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  };

  const deleteButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease'
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

  const responsiveControlsStyle = window.innerWidth <= 768 ? {
    ...controlsStyle,
    flexDirection: 'column',
    width: '100%'
  } : controlsStyle;

  const responsiveButtonStyle = window.innerWidth <= 768 ? {
    ...exportButtonStyle,
    width: '100%',
    justifyContent: 'center'
  } : exportButtonStyle;

  if (loading) return <div style={containerStyle}>Loading...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <OderBack/>

      <div style={responsiveStyle}>
        <h2 style={headingStyle}>Orders List</h2>
        <div style={responsiveControlsStyle}>
          <div style={selectAllStyle}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              style={checkboxStyle}
              id="selectAll"
            />
            <label htmlFor="selectAll">Select All</label>
          </div>
          <span style={selectionCountStyle}>
            {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
          </span>
          <button 
            style={responsiveButtonStyle}
            onClick={exportToExcel}
            disabled={selectedOrders.size === 0}
            title={selectedOrders.size > 0 ? "Export selected orders to Excel" : "Please select orders to export"}
            onMouseOver={(e) => {
              if (selectedOrders.size > 0) {
                e.target.style.background = 'linear-gradient(135deg, #218838, #4CAF50)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedOrders.size > 0) {
                e.target.style.background = 'linear-gradient(135deg, #28a745, #4CAF50)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
              }
            }}
          >
            Export Selected ({selectedOrders.size})
          </button>
        </div>
      </div>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Select</th>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Customer Name</th>
            <th style={thStyle}>Mobile Number</th>
            <th style={thStyle}>Total Amount</th>
            <th style={thStyle}>Order Date</th>
            <th style={thStyle}>Products</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={tdStyle}>
                <input
                  type="checkbox"
                  checked={selectedOrders.has(order.id)}
                  onChange={() => handleOrderSelection(order.id)}
                  style={checkboxStyle}
                />
              </td>
              <td style={tdStyle}>{order.id}</td>
              <td style={tdStyle}>{order.userDetails.name}</td>
              <td style={tdStyle}>{order.userDetails.phone || 'N/A'}</td>
              <td style={tdStyle}>₹{order.grandTotal}</td>
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
                <button 
                  onClick={() => handleDeleteOrder(order.id)}
                  style={deleteButtonStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                  Delete
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
                <th style={thStyle}>Select</th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer Name</th>
                <th style={thStyle}>Mobile Number</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Order Date</th>
                <th style={thStyle}>Products</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleOrderSelection(order.id)}
                      style={checkboxStyle}
                    />
                  </td>
                  <td style={tdStyle}>{order.id}</td>
                  <td style={tdStyle}>{order.userDetails.name}</td>
                  <td style={tdStyle}>{order.userDetails.phone || 'N/A'}</td>
                  <td style={tdStyle}>₹{order.grandTotal}</td>
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