import React, { useEffect, useRef, useState } from "react";
import './ProductCarousel.css'; // We'll include this CSS file separately

const ChildrenCrackers = () => {
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
    }, 50); // Adjust interval for speed

    return () => {
      clearInterval(scrollInterval);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [scrollDirection, isScrolling]);
  // Product data
  const products = [
    { name: "SMOKE STICK", category: "Aerial", price: "₹69.30", imageUrl: "/assets/childrenCarousel/Smoke_Stick Img.png" },
    { name: "SIREN", category: "Ground", price: "₹174.90", imageUrl: "/assets/childrenCarousel/Siren Img.png" },
    { name: "CRACKLING COMET", category: "Fountain", price: "₹277.20", imageUrl: "/assets/childrenCarousel/Crackling_Comet Img.png" },
    { name: "FOG SMOKE", category: "Ground", price: "₹178.20", imageUrl: "/assets/childrenCarousel/Fog_smoke Img.png" },
    { name: "MAGIC WAND", category: "Crackers", price: "₹106.70", imageUrl: "/assets/childrenCarousel/Magic_Wand Img.png" },
    { name: "BANG BANG (NEW VERITY)", category: "Assorted", price: "₹93.50", imageUrl: "/assets/childrenCarousel/Bang Img.png" },
    { name: "PHOTO FLASH", category: "Ground", price: "₹69.30", imageUrl: "/assets/childrenCarousel/PHOTO_FLASH Img.png" },
    { name: "MAGIC POPPER (NEW VERITY)", category: "Crackers", price: "₹193.60", imageUrl: "/assets/childrenCarousel/Magic_Popper Img.png" },
    { name: "HIP HIP HOORAY", category: "Aerial", price: "₹199.10", imageUrl: "/assets/childrenCarousel/HIP_HIP_HOORAY Img.png" },
    { name: "MONEY BLAST", category: "Ground", price: "₹217.80", imageUrl: "/assets/childrenCarousel/MONEY BLAST Img.png" },
    // { name: "Magic Peacock", category: "Fountain", price: "₹199", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    // { name: "Flower Pots Special", category: "Ground", price: "₹449", imageUrl: "/assets/features_circle/super-deluxe.webp" },
  ];

  return (
    
    <div className="product-container" ref={scrollContainerRef}>
      <div className="product-header">
      <h3 className="product-container-head">Children Colorful Crackers</h3>
      </div>
      
      <div className="product-line">
        {products.map((product, index) => (
          
          <div key={index} className="product-item">
            <a href="/products">
            <div className="product-image">
              
              <img src={product.imageUrl} alt="img" />
            </div></a>
            <span className="product-price">{product.price}</span>
            <h3 className="product-name">{product.name}</h3>
            <span className="product-category">{product.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildrenCrackers;