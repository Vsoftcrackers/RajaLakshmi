import React, { useEffect, useRef, useState } from "react";
import './ProductCarousel.css';

const ProductCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    // Check if we need to enable scrolling (only if content is wider than container)
    const checkScrollability = () => {
      if (scrollContainer) {
        const shouldScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
        setIsScrolling(shouldScroll);
      }
    };

    // Initial check
    checkScrollability();

    // Add resize listener to recheck when window size changes
    window.addEventListener('resize', checkScrollability);

    const scrollInterval = setInterval(() => {
      if (scrollContainer && isScrolling) {
        // Calculate the scroll boundary with a small buffer
        const rightBoundary = scrollContainer.scrollWidth - scrollContainer.clientWidth - 2;
        
        if (scrollDirection === 1) {
          // Scrolling right
          if (scrollContainer.scrollLeft >= rightBoundary) {
            setScrollDirection(-1); // Reverse direction
          } else {
            scrollContainer.scrollLeft += 1;
          }
        } else {
          // Scrolling left
          if (scrollContainer.scrollLeft <= 2) {
            setScrollDirection(1); // Reverse direction
          } else {
            scrollContainer.scrollLeft -= 1;
          }
        }
      }
    }, 35); // Adjust interval for speed

    return () => {
      clearInterval(scrollInterval);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [scrollDirection, isScrolling]);

  // Product data
  const products = [
    { name: "28 CHORASA", category: "Ground", price: "₹22", imageUrl: "/assets/productCarousel/28_chorasa_Img.png" },
    { name: "RAJDANI BOMB", category: "Ground", price: "₹119", imageUrl: "/assets/productCarousel/Bomb_Img.png" },
    { name: "DIGITAL BOMB", category: "Ground", price: "₹209", imageUrl: "/assets/productCarousel/digitalBomb_Img.png" },
    { name: "HYDRO BOMB", category: "Ground", price: "₹79", imageUrl: "/assets/productCarousel/hydro_bomb_Img.png" },
    { name: "28 GAINT", category: "Ground", price: "₹24.20", imageUrl: "/assets/productCarousel/28_gaint_Img.png" },
    { name: "56 GAINT", category: "Ground", price: "₹47.30", imageUrl: "/assets/productCarousel/56_gaint_Img.png" },
    { name: "2k FULL COUNT", category: "Ground", price: "₹633.60", imageUrl: "/assets/productCarousel/2k_full_count Img.png" },
    { name: "10K FULL COUNT", category: "Ground", price: "₹2772", imageUrl: "/assets/productCarousel/10k_full_count Img.png" },
    { name: "ROCKET BOMB", category: "Aerial", price: "₹60.50", imageUrl: "/assets/productCarousel/Rocket_Bomb img.png" },
    { name: "LAKSHMI BOMB", category: "Ground", price: "₹55", imageUrl: "/assets/productCarousel/lakshmi_Bomb_Img.png" },
  ];

  return (
    <div className="product-container" ref={scrollContainerRef}>
      <div className="product-header">
        <h3 className="product-container-head">Vibrant Sound Crackers</h3>
      </div>
      
      <div className="product-line">
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <a href="/products">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
            </a>
            <span className="product-price">{product.price}</span>
            <h3 className="product-name">{product.name}</h3>
            <span className="product-category">{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;