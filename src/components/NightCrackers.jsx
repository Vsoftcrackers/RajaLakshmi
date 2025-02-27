import React, { useEffect, useRef, useState } from "react";
import './ProductCarousel.css'; // We'll include this CSS file separately

const NightCrackers = () => {
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
      }, 40); // Adjust interval for speed
  
      return () => {
        clearInterval(scrollInterval);
        window.removeEventListener('resize', checkScrollability);
      };
    }, [scrollDirection, isScrolling]);  // Product data
  const products = [
    { name: "30 SHOTS MULTICOLOR", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/30 Shots_Multicolor.png" },
    { name: "120 SHOTS MULTICOLOR", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/120 Shots_Multicolor.png" },
    { name: "12 SHOT (RIDER)", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/12 Shot.png" },
    { name: "12 RANG CHAKKAR", category: "Ground", price: "70-80% Off", imageUrl: "/assets/NightCarousel/12 Ranga_chakar.png" },
    { name: "60 SHOTS MULTICOLOR", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/60 Shots_Mulitcolor.png" },
    { name: "200 SHOTS MULTICOLOR", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/200 Shots_Multicolor.png" },
    { name: "3.5'' NAIYAGARA FALLS", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/3.5'' Naiyagara_Falls.png" },
    { name: "PENTA SKY SHOT (5PCS)", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/Penta_Sky_Shots.png" },
    { name: "2.5''FANCY (1PCS)", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/2.5'' Fancy.png" },
    { name: "3.5'' FANCY", category: "Aerial", price: "70-80% Off", imageUrl: "/assets/NightCarousel/3.5_FANCY.webp" },
    // { name: "Magic Peacock", category: "Fountain", price: "₹199", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    // { name: "Flower Pots Special", category: "Ground", price: "₹449", imageUrl: "/assets/features_circle/super-deluxe.webp" },
  ];

  return (
    
    <div className="product-container" ref={scrollContainerRef}>
      <div className="product-header">
      <h3 className="product-container-head">Night Crackers</h3>
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

export default NightCrackers;