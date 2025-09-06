import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { FaCartArrowDown, FaTag, FaImage, FaExclamationTriangle } from "react-icons/fa";

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

// Optimized Image Component
const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  className = "", 
  onError, 
  onLoad, 
  placeholder = null,
  maxRetries = 2 
}) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    retryCount: 0,
    loaded: false
  });

  const handleImageLoad = useCallback(() => {
    setImageState({
      loading: false,
      error: false,
      retryCount: 0,
      loaded: true
    });
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setImageState(prev => {
      if (prev.retryCount < maxRetries) {
        // Auto retry after a short delay
        setTimeout(() => {
          setImageState(current => ({
            ...current,
            loading: true,
            error: false,
            retryCount: current.retryCount + 1
          }));
        }, 1000);
        
        return {
          ...prev,
          loading: true,
          error: false,
          retryCount: prev.retryCount + 1
        };
      } else {
        onError?.();
        return {
          loading: false,
          error: true,
          retryCount: prev.retryCount,
          loaded: false
        };
      }
    });
  }, [maxRetries, onError]);

  const retryImage = useCallback(() => {
    setImageState({
      loading: true,
      error: false,
      retryCount: 0,
      loaded: false
    });
  }, []);

  if (!src) {
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
          Retry ({imageState.retryCount}/{maxRetries})
        </button>
      </div>
    );
  }

  return (
    <div className="product-image-container">
      {imageState.loading && (
        <div className="image-loading-overlay">
          <div className="loading-spinner"></div>
          <small>Loading image...</small>
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
          display: imageState.loading ? 'none' : 'block',
          transition: 'opacity 0.3s ease-in-out',
          opacity: imageState.loaded ? 1 : 0
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
            offerPrice: data.offerPrice || data.price || 0,
            originalPrice: data.originalPrice || data.price || 0,
            price: data.offerPrice || data.price || 0,
            discountPercentage: data.discountPercentage || 0,
            savings: data.savings || 0,
            category: data.category || "Uncategorized",
            availableQty: data.availableQty || 0,
            imageUrl: data.imageUrl?.trim() || "", // Clean whitespace
            qty: 0,
            createdAt: data.createdAt
          };

          productsData.push(product);
        });

        // Sort products by serialNo in ascending order
        productsData.sort((a, b) => (a.serialNo || 0) - (b.serialNo || 0));

        setProducts(productsData);

        // Start preloading images
        preloadProductImages(productsData);

        // Debug logging
        const productsWithImages = productsData.filter(p => p.imageUrl);
        const productsWithoutImages = productsData.filter(p => !p.imageUrl);
        
        console.log(`Loaded ${productsData.length} products:`);
        console.log(`- With images: ${productsWithImages.length}`);
        console.log(`- Without images: ${productsWithoutImages.length}`);

      } catch (err) {
        setError(`Error fetching products: ${err.message}`);
        console.error("Firestore fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [preloadProductImages]);

  // Handle quantity change and update checkout list dynamically
  const handleQuantityChange = useCallback((productId, change) => {
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
  }, []);

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

  // Navigate to checkout with selected products
  const handleCheckout = useCallback(() => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }
    navigate("/checkout", { state: { selectedProducts } });
  }, [selectedProducts, navigate]);

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
    // Clear image cache on refresh
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
      <small>Optimizing images for faster loading...</small>
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
        <div className="header-controls">
          <button onClick={toggleViewMode} className="view-toggle-button">
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>
          {/* <button onClick={toggleDebug} className="debug-toggle-button">
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button> */}
          <button onClick={refreshProducts} className="refresh-button">
            Refresh Products
          </button>
        </div>
      </div>

      <div className="product-summary">
        <p>Total Products: {products.length}</p>
        <p>Categories: {Object.keys(groupedProducts).length}</p>
        <p>Selected Items: {selectedProducts.length}</p>
        {selectedProducts.length > 0 && (
          <div className="checkout-summary">
            <p><strong>Order Total: ₹{grandTotal}</strong></p>
            {parseFloat(totalSavings) > 0 && (
              <p className="savings-display">
                <FaTag className="savings-icon" />
                You Save: ₹{totalSavings}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Debug Section */}
      {showDebug && (
        <div className="debug-section">
          <h3>Debug Information</h3>
          <div className="debug-stats">
            <p>Products with images: {products.filter(p => p.imageUrl).length}</p>
            <p>Products without images: {products.filter(p => !p.imageUrl).length}</p>
            <p>Failed image loads: {imageErrors.size}</p>
            <p>Images in cache: {imageCache.size}</p>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        // Table View
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
                    <tr key={product.id} className="product-row">
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
                      <td className="total-cell">₹{(product.qty * product.offerPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid View
        <div className="products-grid">
          {Object.keys(groupedProducts).map(category => (
            <div key={category} className="category-section">
              <h3 className="category-title">
                {category} ({groupedProducts[category].length} items)
              </h3>
              <div className="products-grid-container">
                {groupedProducts[category].map(product => (
                  <div key={product.id} className="product-card">
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
      <button 
        className="checkout-button" 
        onClick={handleCheckout}
        disabled={selectedProducts.length === 0}
      >
        <FaCartArrowDown className="cart-icon" />
        <span className="checkout-text">
          Proceed to order ({selectedProducts.length} items)
        </span>
      </button>
    </div>
  );
};

export default ProductList;