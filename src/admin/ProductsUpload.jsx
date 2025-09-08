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

        // Process the Excel data with image URL support
        const results = processExcelDataWithImageUrl(data);
        
        addDebugLog("Data processing completed", { 
          productsFound: results.products.length,
          categories: results.categories
        });

        if (!results || results.products.length === 0) {
          setError("No valid products found in the file. Please check the Excel format.");
          addDebugLog("No products found in file");
          setUploading(false);
          return;
        }

        const productsToAdd = results.products;
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

  // Enhanced function to process Excel data with improved image URL support
  // Enhanced function to process Excel data with IMPROVED category detection
const processExcelDataWithImageUrl = (data) => {
  const productsToAdd = [];
  const categoriesFound = [];
  let currentCategory = "General";
  let serialCounter = 1;

  // Find header row - look for row containing "PRODUCT" and "PRICE"
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (row && row.length > 0) {
      const rowStr = row.join('').toLowerCase();
      if (rowStr.includes('product') && (rowStr.includes('offer') || rowStr.includes('price'))) {
        headerRowIndex = i;
        break;
      }
    }
  }

  addDebugLog("Header row found", { headerRowIndex, headerRow: headerRowIndex >= 0 ? data[headerRowIndex] : null });

  // If no header found, assume first row or start from row 0
  const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;

  // IMPROVED: Enhanced category detection function
  const isCategoryRow = (rowData) => {
    if (!rowData || rowData.length === 0) return false;

    // Check if the row has colored background (category rows are typically highlighted)
    // Since we can't detect colors in Excel data, we'll use other heuristics
    
    // Method 1: Category row typically has text in first few columns but no prices
    const firstCell = String(rowData[0] || '').trim();
    const secondCell = String(rowData[1] || '').trim();
    const thirdCell = String(rowData[2] || '').trim();
    
    // Check if there are price columns (usually columns 3, 4, 5)
    const hasPrice = rowData.slice(3, 6).some(cell => {
      const num = parseFloat(cell);
      return !isNaN(num) && num > 0;
    });

    // Method 2: Look for specific category keywords
    const categoryKeywords = [
      'fancy', 'multicolour', 'whistling', 'rockets', 'crackling', 'shots',
      'pipe', 'series', 'ground', 'chakra', 'wala', 'saravai', 'bijili',
      'one sound', 'bombs', 'children', 'playful', 'sparklers', 'gift',
      'boxes', 'net', 'rate', 'special', 'deluxe', 'premium', 'classic',
      'flower', 'pots', 'twinkling', 'star', 'crackers', 'items'
    ];

    // Method 3: Check if this looks like a category name
    const combinedText = [firstCell, secondCell, thirdCell].join(' ').toLowerCase();
    const hasKeywords = categoryKeywords.some(keyword => 
      combinedText.includes(keyword)
    );

    // Method 4: Category detection logic
    const conditions = [
      // Condition 1: Second column has category text, first column is empty or non-numeric, no prices
      (!firstCell || isNaN(firstCell)) && secondCell.length > 3 && !hasPrice,
      
      // Condition 2: First column has category text and no prices in typical price columns
      firstCell.length > 5 && hasKeywords && !hasPrice,
      
      // Condition 3: Combined text from first few columns contains keywords and no prices
      combinedText.length > 5 && hasKeywords && !hasPrice,
      
      // Condition 4: Row has only 1-3 non-empty cells and contains keywords
      rowData.filter(cell => cell && String(cell).trim()).length <= 3 && hasKeywords,
      
      // Condition 5: Specific pattern - empty first column, category in second, rest empty
      !firstCell && secondCell.length > 5 && rowData.slice(2).every(cell => !cell || String(cell).trim() === ''),
    ];

    return conditions.some(condition => condition);
  };

  // IMPROVED: Extract category name from row
  const extractCategoryName = (rowData) => {
    const cells = rowData.slice(0, 4).map(cell => String(cell || '').trim()).filter(cell => cell);
    
    // Find the longest non-empty cell that likely contains the category name
    let categoryName = '';
    let maxLength = 0;
    
    for (const cell of cells) {
      if (cell.length > maxLength && cell.length > 3) {
        // Skip if it looks like a serial number
        if (!(/^\d+$/.test(cell))) {
          categoryName = cell;
          maxLength = cell.length;
        }
      }
    }
    
    // If multiple cells, combine them intelligently
    if (cells.length > 1 && categoryName) {
      const otherCells = cells.filter(cell => cell !== categoryName && cell.length > 2);
      if (otherCells.length > 0) {
        // Check if they should be combined
        const combined = cells.join(' & ').trim();
        if (combined.length <= 50) { // Reasonable category name length
          categoryName = combined;
        }
      }
    }
    
    return categoryName || 'General';
  };

  // Define column arrangements based on your Excel format
  const columnArrangements = [
    // [S NO, PRODUCT, BOX CONTENT, OFFER PRICE, ORIGINAL PRICE, IMAGE URL]
    { serial: 0, name: 1, content: 2, offerPrice: 3, originalPrice: 4, imageUrl: 5 },
    // [PRODUCT, BOX CONTENT, OFFER PRICE, ORIGINAL PRICE, IMAGE URL] (no serial)
    { name: 0, content: 1, offerPrice: 2, originalPrice: 3, imageUrl: 4 },
    // [S NO, PRODUCT, OFFER PRICE, ORIGINAL PRICE, IMAGE URL] (no content)
    { serial: 0, name: 1, offerPrice: 2, originalPrice: 3, imageUrl: 4 },
    // [PRODUCT, OFFER PRICE, ORIGINAL PRICE, IMAGE URL] (minimal)
    { name: 0, offerPrice: 1, originalPrice: 2, imageUrl: 3 },
    // Backward compatibility arrangements without image URL
    { serial: 0, name: 1, content: 2, offerPrice: 3, originalPrice: 4 },
    { name: 0, content: 1, offerPrice: 2, originalPrice: 3 },
    { serial: 0, name: 1, offerPrice: 2, originalPrice: 3 },
    { name: 0, offerPrice: 1, originalPrice: 2 }
  ];

  for (let rowIndex = startRow; rowIndex < data.length; rowIndex++) {
    const rowData = data[rowIndex];
    
    if (!rowData || rowData.every(cell => cell === "" || cell === undefined || cell === null)) {
      continue;
    }

    // IMPROVED: Check if this is a category row using enhanced detection
    if (isCategoryRow(rowData)) {
      const detectedCategory = extractCategoryName(rowData);
      currentCategory = detectedCategory;
      
      if (!categoriesFound.includes(currentCategory)) {
        categoriesFound.push(currentCategory);
      }
      
      addDebugLog("Category detected", { 
        category: currentCategory, 
        row: rowIndex,
        rowData: rowData.slice(0, 4)
      });
      continue;
    }

    // Try to parse as product using different arrangements
    let productAdded = false;
    
    for (const arrangement of columnArrangements) {
      try {
        const serialNo = arrangement.serial !== undefined ? rowData[arrangement.serial] : serialCounter;
        const productName = rowData[arrangement.name];
        const content = arrangement.content !== undefined ? rowData[arrangement.content] : '';
        const imageUrl = arrangement.imageUrl !== undefined ? rowData[arrangement.imageUrl] : '';
        
        let offerPrice, originalPrice, finalPrice, discountPercentage = 0;
        
        if (arrangement.offerPrice !== undefined && arrangement.originalPrice !== undefined) {
          // Dual price arrangement
          offerPrice = parseFloat(rowData[arrangement.offerPrice]);
          originalPrice = parseFloat(rowData[arrangement.originalPrice]);
          finalPrice = offerPrice;
          
          if (originalPrice && originalPrice > offerPrice) {
            discountPercentage = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
          }
        } else {
          continue;
        }

        // Validate product data
        if (productName && 
            String(productName).trim() !== "" && 
            !isNaN(finalPrice) && 
            finalPrice > 0) {
          
          // Clean and validate image URL
          let cleanImageUrl = '';
          if (imageUrl && String(imageUrl).trim() !== '') {
            cleanImageUrl = String(imageUrl).trim();
            
            // More flexible URL validation
            if (cleanImageUrl.startsWith('http://') || 
                cleanImageUrl.startsWith('https://') ||
                cleanImageUrl.startsWith('data:image/') ||
                cleanImageUrl.startsWith('blob:') ||
                cleanImageUrl.startsWith('/')) {
              // Valid URL format - keep as is
            } else if (cleanImageUrl.length > 10 && 
                       (cleanImageUrl.includes('.jpg') || 
                        cleanImageUrl.includes('.jpeg') || 
                        cleanImageUrl.includes('.png') || 
                        cleanImageUrl.includes('.gif') || 
                        cleanImageUrl.includes('.webp'))) {
              // Looks like an image URL but missing protocol
              if (cleanImageUrl.startsWith('www.')) {
                cleanImageUrl = 'https://' + cleanImageUrl;
              } else if (cleanImageUrl.includes('firebase') ||
                         cleanImageUrl.includes('cloudinary') ||
                         cleanImageUrl.includes('imgur') ||
                         cleanImageUrl.includes('amazonaws')) {
                // Trusted domains - add https if missing
                cleanImageUrl = 'https://' + cleanImageUrl;
              }
            }
          }
          
          const product = {
            serialNo: isNaN(serialNo) ? serialCounter : parseInt(serialNo),
            productName: String(productName).trim(),
            content: content ? String(content).trim() : '',
            offerPrice: offerPrice || finalPrice,
            originalPrice: originalPrice || finalPrice,
            price: finalPrice, // For backward compatibility
            discountPercentage: discountPercentage,
            savings: (originalPrice && originalPrice > offerPrice) ? (originalPrice - offerPrice) : 0,
            imageUrl: cleanImageUrl,
            availableQty: 0, // Default quantity
            category: currentCategory, // This will now be more accurate
            createdAt: new Date().toISOString()
          };

          // Check for duplicates
          const exists = productsToAdd.some(p => 
            p.productName.toLowerCase() === product.productName.toLowerCase() &&
            p.offerPrice === product.offerPrice
          );

          if (!exists) {
            productsToAdd.push(product);
            serialCounter++;
            productAdded = true;
            addDebugLog("Product added", { 
              product: product.productName, 
              category: product.category,
              offer: product.offerPrice, 
              original: product.originalPrice,
              discount: product.discountPercentage + '%',
              imageUrl: product.imageUrl ? 'Yes' : 'No'
            });
            break;
          }
        }
      } catch (parseError) {
        // Continue to next arrangement if this one fails
        continue;
      }
    }

    if (!productAdded) {
      addDebugLog("Failed to parse row", { 
        rowIndex, 
        rowData: rowData.slice(0, 6),
        currentCategory: currentCategory
      });
    }
  }

  addDebugLog("Final categories found", { categories: categoriesFound });
  addDebugLog("Products by category", { 
    breakdown: categoriesFound.map(cat => ({
      category: cat,
      count: productsToAdd.filter(p => p.category === cat).length
    }))
  });

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
          <p><strong>Expected format:</strong> S NO | PRODUCT | BOX CONTENT | OFFER PRICE | ORIGINAL PRICE | IMAGE URL</p>
          <p><small>Note: Image URL column is optional. URLs should be complete (with http/https) or from trusted domains</small></p>
          <div className="format-examples">
            <p><strong>Valid image URL examples:</strong></p>
            <ul>
              <li>https://example.com/image.jpg</li>
              <li>http://yoursite.com/images/product.png</li>
              <li>https://firebasestorage.googleapis.com/.../image.jpg</li>
              <li>www.example.com/image.jpg (will be converted to https://)</li>
            </ul>
          </div>
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