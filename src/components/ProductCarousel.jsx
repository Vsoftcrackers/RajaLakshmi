import React, { useEffect, useRef, useState } from "react";
import './ProductCarousel.css'; // We'll include this CSS file separately

const ProductCarousel = () => {
  const scrollContainerRef = useRef(null);
    const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      const scrollInterval = setInterval(() => {
        if (scrollContainer) {
          // Check current scroll position
          if (scrollDirection === 1) {
            // Scroll right
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
              setScrollDirection(-1); // Reverse direction when reaching the end
            } else {
              scrollContainer.scrollLeft += 1; // Scroll right
            }
          } else {
            // Scroll left
            if (scrollContainer.scrollLeft <= 0) {
              setScrollDirection(1); // Reverse direction when reaching the start
            } else {
              scrollContainer.scrollLeft -= 1; // Scroll left
            }
          }
        }
      }, 20); // Adjust interval for speed
  
      return () => clearInterval(scrollInterval);
    }, [scrollDirection]);
  // Product data
  const products = [
    { name: "28 chorsa", category: "Ground", price: "₹22", imageUrl: "/assets/productCarousel/28 chorasa.jpg" },
    { name: "RajDani Bomb", category: "Ground", price: "₹119", imageUrl: "/assets/productCarousel/Bomb.webp" },
    { name: "Magic Peacock", category: "Fountain", price: "₹199", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "Flower Pots Special", category: "Ground", price: "₹449", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "5000 Wala", category: "Crackers", price: "₹599", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "Super Deluxe", category: "Assorted", price: "₹349", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "Rang Chakkar", category: "Ground", price: "₹249", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "Bijli", category: "Crackers", price: "₹149", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "Drone", category: "Aerial", price: "₹399", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    { name: "4\" Lakshmi", category: "Ground", price: "₹299", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    // { name: "Magic Peacock", category: "Fountain", price: "₹199", imageUrl: "/assets/features_circle/super-deluxe.webp" },
    // { name: "Flower Pots Special", category: "Ground", price: "₹449", imageUrl: "/assets/features_circle/super-deluxe.webp" },
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

export default ProductCarousel;