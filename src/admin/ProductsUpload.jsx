import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import "./AdminProducts.css";

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

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const ProductsUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [debugLogs, setDebugLogs] = useState([]);
  const navigate = useNavigate();

  // Debug logging function
  const addDebugLog = (message, data = null) => {
    const logEntry = `${new Date().toLocaleTimeString()}: ${message}`;
    console.log(logEntry, data || '');
    setDebugLogs(prev => [...prev, data ? `${logEntry} - ${JSON.stringify(data)}` : logEntry]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setUploadStatus("");
    setDebugLogs([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setUploading(true);
    setError("");
    setDebugLogs([]);
    setUploadStatus("Reading file...");
    addDebugLog("Starting upload process", { fileName: file.name, fileSize: file.size });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        addDebugLog("File read successfully", { sheetNames: workbook.SheetNames });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row included
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        addDebugLog("Excel data parsed", { totalRows: data.length, firstFewRows: data.slice(0, 10) });

        setUploadStatus("Processing data...");

        // Try multiple starting rows to find data
        let bestStartingRow = 0;
        let maxProductsFound = 0;
        let bestResults = null;

        // Test different starting rows (0-10) to find the best data
        for (let testStartRow = 0; testStartRow <= Math.min(10, data.length - 1); testStartRow++) {
          const testResults = processExcelData(data, testStartRow);
          if (testResults.products.length > maxProductsFound) {
            maxProductsFound = testResults.products.length;
            bestResults = testResults;
            bestStartingRow = testStartRow;
          }
        }

        addDebugLog("Best starting row found", { 
          startingRow: bestStartingRow, 
          productsFound: maxProductsFound,
          categories: bestResults?.categories || []
        });

        if (!bestResults || bestResults.products.length === 0) {
          // If no products found with auto-detection, try processing all rows
          addDebugLog("Auto-detection failed, trying to process all rows");
          const allRowsResults = processAllRows(data);
          if (allRowsResults.products.length > 0) {
            bestResults = allRowsResults;
            addDebugLog("Found products by processing all rows", { count: allRowsResults.products.length });
          } else {
            setError("No valid products found in the file. Please check the Excel format and ensure it contains product data with columns: Product Name, Content, Price, Category.");
            addDebugLog("No products found in entire file");
            setUploading(false);
            return;
          }
        }

        const productsToAdd = bestResults.products;
        addDebugLog("Final products to upload", { count: productsToAdd.length, sample: productsToAdd.slice(0, 3) });

        setUploadStatus(`Found ${productsToAdd.length} products. Deleting existing data...`);

        try {
          // Step 1: Delete all existing products
          const querySnapshot = await getDocs(collection(db, "products"));
          addDebugLog("Existing products found", { count: querySnapshot.docs.length });
          
          if (querySnapshot.docs.length > 0) {
            const deletePromises = querySnapshot.docs.map((docSnapshot) =>
              deleteDoc(doc(db, "products", docSnapshot.id))
            );
            await Promise.all(deletePromises);
            addDebugLog("Existing products deleted successfully");
          }

          setUploadStatus("Uploading new products...");

          // Step 2: Add new products one by one with error handling
          let successCount = 0;
          let errorCount = 0;
          
          for (let i = 0; i < productsToAdd.length; i++) {
            try {
              const product = productsToAdd[i];
              await addDoc(collection(db, "products"), product);
              successCount++;
              
              if (i % 10 === 0 || i === productsToAdd.length - 1) {
                setUploadStatus(`Uploading... ${i + 1}/${productsToAdd.length} products`);
              }
            } catch (productError) {
              errorCount++;
              addDebugLog("Failed to add product", { 
                index: i, 
                product: productsToAdd[i], 
                error: productError.message 
              });
            }
          }

          addDebugLog("Upload completed", { 
            successful: successCount, 
            failed: errorCount, 
            total: productsToAdd.length 
          });
          
          if (successCount > 0) {
            setUploadStatus(`Upload completed! ${successCount} products uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`);
            alert(`Successfully uploaded ${successCount} products!${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
            
            // Reset form
            setFile(null);
            document.querySelector('input[type="file"]').value = '';
          } else {
            throw new Error("All products failed to upload. Check Firestore permissions and network connection.");
          }

        } catch (firestoreError) {
          addDebugLog("Firestore operation failed", { error: firestoreError.message });
          throw new Error(`Database error: ${firestoreError.message}`);
        }

      } catch (err) {
        addDebugLog("Upload error", { error: err.message, stack: err.stack });
        setError(`Error processing file: ${err.message}`);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      addDebugLog("File reading error");
      setError("Error reading the file.");
      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Process Excel data starting from a specific row
  const processExcelData = (data, startRow) => {
    const productsToAdd = [];
    const categoriesFound = [];
    let currentCategory = "Uncategorized";
    let serialCounter = 1;
    let currentRow = startRow;

    while (currentRow < data.length) {
      const rowData = data[currentRow];
      
      if (!rowData || rowData.every(cell => cell === "" || cell === undefined || cell === null)) {
        currentRow++;
        continue;
      }

      // Try different column arrangements
      const arrangements = [
        // Arrangement 1: [serialNo, productName, content, price, qty, total]
        { serial: 0, name: 1, content: 2, price: 3, qty: 4 },
        // Arrangement 2: [productName, content, price, qty] (no serial)
        { name: 0, content: 1, price: 2, qty: 3 },
        // Arrangement 3: [productName, price, content] (minimal)
        { name: 0, price: 1, content: 2 },
        // Arrangement 4: [productName, content, price] (different order)
        { name: 0, content: 1, price: 2 }
      ];

      let productAdded = false;

      for (const arr of arrangements) {
        const productName = rowData[arr.name];
        const price = rowData[arr.price];
        const content = arr.content !== undefined ? rowData[arr.content] : '';

        // Check if this looks like a category row
        if (productName && 
            (!price || price === 0 || price === "" || isNaN(parseFloat(price))) &&
            String(productName).trim().length > 0) {
          currentCategory = String(productName).trim();
          if (!categoriesFound.includes(currentCategory)) {
            categoriesFound.push(currentCategory);
          }
          productAdded = true;
          break;
        }

        // Check if this is a valid product row
        if (productName && 
            productName.toString().trim() !== "" && 
            price !== undefined && 
            price !== "" && 
            !isNaN(parseFloat(price)) &&
            parseFloat(price) > 0) {
          
          const parsedPrice = parseFloat(price);
          const parsedQty = arr.qty !== undefined ? parseInt(rowData[arr.qty]) || 0 : 0;

          const product = {
            serialNo: serialCounter,
            productName: String(productName).trim(),
            content: content ? String(content).trim() : '',
            price: parsedPrice,
            availableQty: parsedQty,
            category: currentCategory,
            createdAt: new Date().toISOString()
          };

          productsToAdd.push(product);
          serialCounter++;
          productAdded = true;
          break;
        }
      }

      currentRow++;
    }

    return { products: productsToAdd, categories: categoriesFound };
  };

  // Process all rows without specific starting point
  const processAllRows = (data) => {
    const productsToAdd = [];
    const categoriesFound = [];
    let currentCategory = "General";
    let serialCounter = 1;

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const rowData = data[rowIndex];
      
      if (!rowData || rowData.length === 0) continue;

      // Look for any row that might contain product data
      for (let i = 0; i < rowData.length - 1; i++) {
        const possibleName = rowData[i];
        const possiblePrice = rowData[i + 1];
        const possibleContent = i + 2 < rowData.length ? rowData[i + 2] : '';

        if (possibleName && 
            String(possibleName).trim() !== "" &&
            possiblePrice !== undefined &&
            !isNaN(parseFloat(possiblePrice)) &&
            parseFloat(possiblePrice) > 0) {
          
          const product = {
            serialNo: serialCounter,
            productName: String(possibleName).trim(),
            content: possibleContent ? String(possibleContent).trim() : '',
            price: parseFloat(possiblePrice),
            availableQty: 0,
            category: currentCategory,
            createdAt: new Date().toISOString()
          };

          // Avoid duplicates
          const exists = productsToAdd.some(p => 
            p.productName.toLowerCase() === product.productName.toLowerCase() &&
            p.price === product.price
          );

          if (!exists) {
            productsToAdd.push(product);
            serialCounter++;
          }
          break;
        }
      }
    }

    return { products: productsToAdd, categories: categoriesFound };
  };

  const navigateToOrders = () => {
    navigate("/orders");
  };

  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

  return (
    <div className="admin-products-container">
      <h2 className="admin-products-heading">Upload Product Data</h2>
      
      <div className="upload-section">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="admin-products-file-input"
          disabled={uploading}
        />
        
        <button
          onClick={handleUpload}
          className="admin-products-upload-btn"
          disabled={!file || uploading}
        >
          {uploading ? "Processing..." : "Upload and Process"}
        </button>

        <button
          onClick={navigateToOrders}
          className="admin-order-status-btn"
          disabled={uploading}
        >
          View Order Status
        </button>
      </div>

      {uploadStatus && (
        <div className="upload-status">
          <p>{uploadStatus}</p>
        </div>
      )}

      {error && <p className="admin-products-error-message">{error}</p>}

      {file && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
        </div>
      )}

      {debugLogs.length > 0 && (
        <div className="debug-section">
          <div className="debug-header">
            <h3>Debug Information:</h3>
            <button onClick={clearDebugLogs} className="clear-logs-btn">Clear Logs</button>
          </div>
          <div className="debug-logs">
            {debugLogs.map((log, index) => (
              <div key={index} className="debug-log-entry">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsUpload;