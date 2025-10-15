import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { FaCartArrowDown, FaTag, FaImage, FaExclamationTriangle } from "react-icons/fa";
import { getDoc, doc } from "firebase/firestore";
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

// Improved category mapping based on your Excel data
// Complete fixed category mapping function
const getCategoryFromProductName = (productName, serialNo) => {
  console.log(`Categorizing: Serial ${serialNo}, Name: "${productName}"`);
  
  if (!productName) return "Uncategorized";
  
  const name = productName.toLowerCase().trim();
  const serial = parseInt(serialNo);
  
  // Exact serial number mapping based on your Excel sheet
  if (!isNaN(serial)) {
    let category;
    
    if (serial >= 1 && serial <= 8) {
      category = "RAIDER & MULTICOLOUR SHOTS";
    } else if (serial >= 9 && serial <= 13) {
      category = "WHISTLING & CRACKLING SHOTS";
    } else if (serial >= 14 && serial <= 18) {
      category = "SPECIAL MULTIFUNCTION SHOTS";
    } else if (serial >= 19 && serial <= 30) {
      category = "FANCY PIPE SERIES";
    } else if (serial >= 31 && serial <= 35) {
      category = "MINI PIPE SERIES";
    } else if (serial >= 36 && serial <= 43) {
      category = "GROUND CHAKKAR";
    } else if (serial >= 44 && serial <= 53) {
      category = "FLOWER POTS";
    } else if (serial >= 54 && serial <= 61) {
      category = "WALA";
    } else if (serial >= 62 && serial <= 66) {
      category = "SARAM / BIJILI";
    } else if (serial >= 67 && serial <= 74) {
      category = "ONE SOUND";
    } else if (serial >= 75 && serial <= 77) {
      category = "ROCKET SERIES";
    } else if (serial >= 78 && serial <= 80) {
      category = "BOMBS";
    } else if (serial >= 81 && serial <= 87) {
      category = "SATTAI & PENCIL & TORCHES";
    } else if (serial >= 89 && serial <= 114) {
      category = "CHILDREN'S PLAYFUL ITEMS";
    } else if (serial >= 115 && serial <= 130) {
      category = "SHOWERS";
    } else if (serial >= 131 && serial <= 142) {
      category = "SPARKLERS";
    } else if (serial >= 143 && serial <= 147) {
      category = "GIFT BOXES – NET RATE";
    } else {
      category = "Uncategorized";
    }
    
    console.log(`Serial ${serial} → Category: ${category}`);
    return category;
  }

  // Fallback to keyword matching if no serial number
  const keywordMappings = {
    "RAIDER & MULTICOLOUR SHOTS": ["raider", "multicolour", "multi colour", "shot"],
    "WHISTLING & CRACKLING SHOTS": ["whistling", "crackling", "nayagi", "thunder", "pandiyan"],
    "SPECIAL MULTIFUNCTION SHOTS": ["flash", "volcano", "mines", "wave", "rangoli"],
    "FANCY PIPE SERIES": ["fancy", "pipe", "inch", "step"],
    "MINI PIPE SERIES": ["mini", "black", "white", "astro", "chotta", "akash"],
    "GROUND CHAKKAR": ["chakkar", "spinner", "wheel", "wire"],
    "FLOWER POTS": ["flower", "pot", "colour koti", "tri colour"],
    "WALA": ["wala", "1k", "2k", "5k", "10k", "count"],
    "SARAM / BIJILI": ["bijili", "chorsa", "gaint"],
    "ONE SOUND": ["kuruvi", "lakshmi", "mario", "adi allu"],
    "ROCKET SERIES": ["rocket", "linik", "geetha"],
    "BOMBS": ["bomb", "bullet", "classic", "dinosour"],
    "SATTAI & PENCIL & TORCHES": ["sattai", "pencil", "navgang", "yoyo"],
    "CHILDREN'S PLAYFUL ITEMS": ["ring", "lollipop", "siren", "helicopter", "butterfly", "drone", "smoke", "money blast", "hanuman", "guiter", "photo flash", "peacock", "car", "kit kat"],
    "SHOWERS": ["twix", "golden globe", "starlight", "carnival", "fountain", "pops", "sierra", "yankee", "faso", "lion king", "kungfu", "kutralam", "spring", "costa", "tango", "holynight"],
    "SPARKLERS": ["sparkler", "electric", "crackling", "green", "red", "cm", "rotating"],
    "GIFT BOXES – NET RATE": ["items", "31-items", "36-items", "41-items", "51-items", "61-items"]
  };

  for (const [category, keywords] of Object.entries(keywordMappings)) {
    for (const keyword of keywords) {
      if (name.includes(keyword.toLowerCase())) {
        console.log(`Keyword "${keyword}" matched → Category: ${category}`);
        return category;
      }
    }
  }

  console.log(`No match found → Category: Uncategorized`);
  return "Uncategorized";
};

// Cart utility functions for persistence
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
    if (!stored) return {};

    const cartData = JSON.parse(stored);
    
    // Check if cart has expired
    if (Date.now() > cartData.expiry) {
      sessionStorage.removeItem(CART_STORAGE_KEY);
      return {};
    }

    // Convert array to object with productId as key
    const cartMap = {};
    if (cartData.items && Array.isArray(cartData.items)) {
      cartData.items.forEach(item => {
        if (item.id && item.qty > 0) {
          cartMap[item.id] = item.qty;
        }
      });
    }
    
    return cartMap;
  } catch (error) {
    console.warn('Failed to load cart from storage:', error);
    return {};
  }
};



// Image cache to prevent re-downloading
const imageCache = new Map();

// Preload image utility with better error handling
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src));
      return;
    }

    const img = new Image();
    
    // Set up timeout for slow loading images
    const timeoutId = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`));
    }, 10000); // 10 second timeout

    img.onload = () => {
      clearTimeout(timeoutId);
      imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to load image: ${src}`));
    };

    // Optimize image loading
    img.crossOrigin = "anonymous";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
  });
};

// Optimized Image Component (keeping the same as before)
const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  className = "", 
  onError, 
  onLoad,
  placeholder = null,
  timeout = 5000
}) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    loaded: false
  });

  const handleImageLoad = useCallback(() => {
    setImageState({
      loading: false,
      error: false,
      loaded: true
    });
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setImageState({
      loading: false,
      error: true,
      loaded: false
    });
    onError?.();
  }, [onError]);

  const retryImage = useCallback(() => {
    setImageState({
      loading: true,
      error: false,
      loaded: false
    });
  }, []);

  if (!src || !src.trim()) {
    return placeholder || (
      <div className="product-image-placeholder">
        <FaImage className="placeholder-icon" />
        <span>No Image</span>
      </div>
    );
  }

  if (imageState.error) {
    return (
      <div className="product-image-placeholder error">
        <FaExclamationTriangle className="placeholder-icon error-icon" />
        <span>Image Failed</span>
        <button 
          className="retry-image-btn"
          onClick={retryImage}
          title="Retry loading image"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-image-container">
      {imageState.loading && (
        <div className="image-loading-overlay">
          <div className="loading-spinner"></div>
          <small>Loading...</small>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageState.loaded ? 'loaded' : 'loading'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
        style={{
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          transition: 'opacity 0.2s ease-in-out',
          opacity: imageState.loaded ? 1 : 0.7
        }}
      />
    </div>
  );
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showDebug, setShowDebug] = useState(false);
  const [ordersEnabled, setOrdersEnabled] = useState(true); // NEW STATE
  const navigate = useNavigate();

  // Preload images for better performance
  const preloadProductImages = useCallback(async (productsList) => {
    const imageUrls = productsList
      .filter(product => product.imageUrl && product.imageUrl.trim())
      .map(product => product.imageUrl);

    // Preload first few images immediately for better UX
    const priorityImages = imageUrls.slice(0, 6);
    const backgroundImages = imageUrls.slice(6);

    // Load priority images first
    try {
      await Promise.allSettled(
        priorityImages.map(url => preloadImage(url))
      );
    } catch (error) {
      console.warn('Some priority images failed to preload:', error);
    }

    // Load remaining images in background with throttling
    if (backgroundImages.length > 0) {
      const loadInBatches = async (urls, batchSize = 3) => {
        for (let i = 0; i < urls.length; i += batchSize) {
          const batch = urls.slice(i, i + batchSize);
          await Promise.allSettled(
            batch.map(url => preloadImage(url))
          );
          // Small delay between batches to prevent overwhelming
          if (i + batchSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      };

      // Load in background without blocking UI
      loadInBatches(backgroundImages).catch(error => {
        console.warn('Some background images failed to preload:', error);
      });
    }
  }, []);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const statusDoc = await getDoc(doc(db, "settings", "orderStatus"));
        if (statusDoc.exists()) {
          setOrdersEnabled(statusDoc.data().enabled);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
        // Default to enabled on error
        setOrdersEnabled(true);
      }
    };

    fetchOrderStatus();
  }, []);
  // Fetch products from Firestore and restore cart
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
        const savedCart = loadCartFromStorage(); // Load saved cart quantities

        querySnapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          const productId = doc.id;

          const product = {
            id: productId,
            serialNo: data.serialNo || index + 1,
            productName: data.productName || "Unknown Product",
            content: data.content || "No content provided",
            offerPrice: data.offerPrice || data.price || 0,
            originalPrice: data.originalPrice || data.price || 0,
            price: data.offerPrice || data.price || 0,
            discountPercentage: data.discountPercentage || 0,
            savings: data.savings || 0,
            // Enhanced category detection
            category: data.category || getCategoryFromProductName(data.productName, data.serialNo),
            availableQty: data.availableQty || 0,
            imageUrl: data.imageUrl?.trim() || "",
            qty: savedCart[productId] || 0,
            createdAt: data.createdAt
          };

          productsData.push(product);
        });

        // Sort products by serialNo in ascending order
        productsData.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0));

        setProducts(productsData);

        // Add this after setProducts(productsData) for debugging
console.log("Products categorization debug:");
productsData.forEach(product => {
  console.log(`Serial: ${product.serialNo}, Name: "${product.productName}", Category: "${product.category}"`);
});

const categoryStats = {};
productsData.forEach(p => {
  categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
});
console.log("Category distribution:", categoryStats);

        // Update selected products based on restored cart
        const restoredSelectedProducts = productsData.filter(product => product.qty > 0);
        setSelectedProducts(restoredSelectedProducts);

        // Start preloading images
        preloadProductImages(productsData);

        // Enhanced debug logging
        const categoryCounts = {};
        productsData.forEach(p => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });

        console.log(`Loaded ${productsData.length} products:`);
        console.log('Category distribution:', categoryCounts);
        console.log(`- Restored cart items: ${restoredSelectedProducts.length}`);

      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [preloadProductImages]);

  const handleQuantityChange = useCallback((productId, change) => {
  if (!ordersEnabled) {
    alert("Orders are currently disabled. Please try again later.");
    return;
  }

  setProducts(prevProducts => {
    const updatedProducts = prevProducts.map(product => {
      if (product.id === productId) {
        const newQty = Math.max(0, product.qty + change);
        return { ...product, qty: newQty };
      }
      return product;
    });

    const newSelectedProducts = updatedProducts.filter(product => product.qty > 0);
    setSelectedProducts(newSelectedProducts);
    saveCartToStorage(newSelectedProducts);

    return updatedProducts;
  });
}, [ordersEnabled]);

  // Memoize calculations for better performance
  const grandTotal = useMemo(() => {
    return selectedProducts
      .reduce((total, product) => total + (product.qty * product.offerPrice), 0)
      .toFixed(2);
  }, [selectedProducts]);

  const totalSavings = useMemo(() => {
    return selectedProducts
      .reduce((total, product) => {
        const itemSavings = (product.originalPrice - product.offerPrice) * product.qty;
        return total + itemSavings;
      }, 0)
      .toFixed(2);
  }, [selectedProducts]);

  const handleCheckout = useCallback(() => {
  if (!ordersEnabled) {
    alert("Orders are currently disabled. Please try again later.");
    return;
  }
  if (selectedProducts.length === 0) {
    alert("Please select at least one product to checkout.");
    return;
  }
  navigate("/checkout", { state: { selectedProducts } });
}, [selectedProducts, navigate, ordersEnabled]);




  // Memoize grouped products
  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  // Refresh products
  const refreshProducts = useCallback(() => {
    imageCache.clear();
    window.location.reload();
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'table' ? 'grid' : 'table');
  }, []);

  // Toggle debug view
  const toggleDebug = useCallback(() => {
    setShowDebug(prev => !prev);
  }, []);

  // Handle individual image errors
  const handleImageError = useCallback((productId) => {
    setImageErrors(prev => new Set([...prev, productId]));
  }, []);

  if (loading) return (
    <div className="product-list-loading">
      <div className="loading-spinner large"></div>
      <p>Loading products...</p>
      <small>Restoring your cart and optimizing images...</small>
    </div>
  );

  if (error) return (
    <div className="product-list-error">
      <FaExclamationTriangle className="error-icon" />
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
        {!ordersEnabled && (
  <div style={{
    backgroundColor: '#f8d7da',
    border: '2px solid #dc3545',
    borderRadius: '8px',
    padding: '15px',
    margin: '20px 0',
    textAlign: 'center'
  }}>
    <h3 style={{ color: '#721c24', margin: '0 0 5px 0' }}>
      ⚠️ Orders Currently Disabled
    </h3>
    <p style={{ color: '#721c24', margin: 0, fontSize: '14px' }}>
      We are not accepting orders at this time. Please check back later.
    </p>
  </div>
)}
        <div className="header-controls">
          <button onClick={toggleViewMode} className="view-toggle-button">
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>

          <button onClick={refreshProducts} className="refresh-button">
            Refresh Products
          </button>

        </div>
      </div>

      <div className="product-summary">
        <p>Total Products: {products.length}</p>
        <p>Categories: {Object.keys(groupedProducts).length}</p>
        <p>Cart Items: {selectedProducts.length}</p>
        {selectedProducts.length > 0 && (
          <div className="checkout-summary">
            <p><strong>Cart Total: ₹{grandTotal}</strong></p>
            {parseFloat(totalSavings) > 0 && (
              <p className="savings-display">
                <FaTag className="savings-icon" />
                You Save: ₹{totalSavings}
              </p>
            )}
          </div>
        )}
      </div>

   

      {/* Rest of the component remains the same */}
      {viewMode === 'table' ? (
        // Table View (keeping the same structure)
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr className="table-header">
                <th className="col-image">Image</th>
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
                    <td colSpan="7" className="category-header">
                      {category} ({groupedProducts[category].length} items)
                    </td>
                  </tr>
                  {groupedProducts[category].map(product => (
                    <tr key={product.id} className={`product-row ${product.qty > 0 ? 'in-cart' : ''}`}>
                      <td className="image-cell">
                        <div className="table-image-container">
                          <OptimizedImage
                            src={product.imageUrl}
                            alt={product.productName}
                            className="product-image"
                            onError={() => handleImageError(product.id)}
                          />
                        </div>
                      </td>
                      <td className="serial-cell">{product.serialNo}</td>
                      <td className="name-cell">
                        <div>
                          {product.productName}
                          {product.availableQty > 0 && (
                            <small style={{color: '#666', display: 'block'}}>
                              Stock: {product.availableQty}
                            </small>
                          )}
                          {product.qty > 0 && (
                            <small style={{color: '#28a745', display: 'block', fontWeight: 'bold'}}>
                              In Cart: {product.qty}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="content-cell">{product.content}</td>
                      <td className="price-cell">
                        <div className="price-display">
                          <span className="offer-price">₹{product.offerPrice.toFixed(2)}</span>
                          {product.originalPrice > product.offerPrice && (
                            <>
                              <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                              <span className="discount-badge">{product.discountPercentage}% OFF</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="quantity-cell">
  {!ordersEnabled ? (
    <div className="out-of-stock-label" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 12px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '5px',
      color: '#856404',
      fontWeight: 'bold',
      fontSize: '13px'
    }}>
      Disabled
    </div>
  ) : (
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
  )}
</td>
                      <td className="total-cell">₹{(product.qty * product.offerPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid View (keeping the same structure)
        <div className="products-grid">
          {Object.keys(groupedProducts).map(category => (
            <div key={category} className="category-section">
              <h3 className="category-title">
                {category} ({groupedProducts[category].length} items)
              </h3>
              <div className="products-grid-container">
                {groupedProducts[category].map(product => (
                  <div key={product.id} className={`product-card ${product.qty > 0 ? 'in-cart' : ''}`}>
                    <div className="product-card-image">
                      <OptimizedImage
                        src={product.imageUrl}
                        alt={product.productName}
                        className="product-image"
                        onError={() => handleImageError(product.id)}
                      />
                      {product.originalPrice > product.offerPrice && (
                        <div className="card-discount-badge">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                      {product.qty > 0 && (
                        <div className="cart-indicator">
                          <FaCartArrowDown className="cart-indicator-icon" />
                          <span>{product.qty}</span>
                        </div>
                      )}
                    </div>
                    <div className="product-card-content">
                      <h4 className="product-card-title">{product.productName}</h4>
                      <p className="product-card-content-text">{product.content}</p>
                      <div className="product-card-price">
                        <span className="card-offer-price">₹{product.offerPrice.toFixed(2)}</span>
                        {product.originalPrice > product.offerPrice && (
                          <span className="card-original-price">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {product.availableQty > 0 && (
                        <p className="product-card-stock">Stock: {product.availableQty}</p>
                      )}
                      <div className="product-card-controls">
  {!ordersEnabled ? (
    <div className="out-of-stock-badge" style={{
      padding: '12px',
      backgroundColor: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      textAlign: 'center',
      color: '#856404',
      fontWeight: 'bold',
      fontSize: '14px',
      marginTop: '10px'
    }}>
      ⚠️ Orders Disabled
    </div>
  ) : (
    <>
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
      {product.qty > 0 && (
        <div className="card-total">
          Total: ₹{(product.qty * product.offerPrice).toFixed(2)}
        </div>
      )}
    </>
  )}
</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Button */}
      <div className="checkout-section">
        <button 
          className="checkout-button" 
          onClick={handleCheckout}
          disabled={selectedProducts.length === 0}
        >
          <FaCartArrowDown className="cart-icon" />
          <span className="checkout-text">
            {selectedProducts.length === 0 
              ? 'Add items to cart' 
              : `Proceed to order (${selectedProducts.length} items)`
            }
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductList;