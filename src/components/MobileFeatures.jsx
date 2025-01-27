import React, { useEffect, useRef, useState } from "react";
import "./MobileFeatures.css";

const MobileFeatures = () => {
  const scrollContainerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for forward, -1 for reverse

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const scrollStep = () => {
      if (scrollContainer) {
        // Move in the current direction
        scrollContainer.scrollLeft += scrollDirection;

        // Check if we've reached the end of the scroll
        if (scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth) {
          setScrollDirection(-1); // Switch to reverse
        }

        // Check if we've reached the start of the scroll
        if (scrollContainer.scrollLeft <= 0) {
          setScrollDirection(1); // Switch to forward
        }
      }
    };

    // Set an interval for continuous scrolling
    const interval = setInterval(scrollStep, 10); // Adjust speed as needed (lower value = faster scrolling)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [scrollDirection]);

  return (
    <div className="mobile-features-section">
 

      {/* Features Cards */}
      <div className="mobile-features-container" ref={scrollContainerRef}>
        <div className="mobile-features-card">
          <img
            src="assets/features/truck.png"
            alt="HUID"
            className="mobile-features-card-image"
          />
          <h4 className="mobile-features-card-title">SUPER FAST DELIVERY</h4>
          <p className="mobile-features-card-description">Best Transport Support</p>
        </div>
        <div className="mobile-features-card">
          <img
            src="assets/features/best.png"
            alt="Diamonds"
            className="mobile-features-card-image"
          />
          <h4 className="mobile-features-card-title">BEST BRAND-BEST QUALITY</h4>
          <p className="mobile-features-card-description">Premium Quality Crackers</p>
        </div>
        <div className="mobile-features-card">
          <img
            src="assets/features/hundred.png"
            alt="Exchange"
            className="mobile-features-card-image"
          />
          <h4 className="mobile-features-card-title">100% GUARANTEE</h4>
          <p className="mobile-features-card-description">SAFE & SECURE</p>
        </div>
        <div className="mobile-features-card">
          <img
            src="assets/features/service.png"
            alt="Price Promise"
            className="mobile-features-card-image"
          />
          <p className="mobile-features-card-title">For order: 9500759557</p>
          <p className="mobile-features-card-title">For Help & Complaints: 7010857010</p>
        </div>
      </div>
    </div>
  );
};

export default MobileFeatures;

