import React from "react";
import "./MobileFeatures.css";

const MobileFeatures = () => {
  const featuresData = [
    {
      icon: "assets/features/truck.png",
      title: "SUPER FAST DELIVERY",
      description: "Best Transport Support",
      alt: "Fast Delivery Truck"
    },
    {
      icon: "assets/features/best.png",
      title: "BEST BRAND-BEST QUALITY",
      description: "Premium Quality Crackers",
      alt: "Quality Badge"
    },
 
    {
      icon: "assets/features/service.png",
      title: "CUSTOMER SUPPORT",
      description: "Order: 9500759557 | Help: 7010857010",
      alt: "Customer Service"
    }
  ];

  return (
    <section className="mobile-features-section">
      <div className="mobile-features-container">
        {featuresData.map((feature, index) => (
          <div className="mobile-features-card" key={index}>
            <div className="mobile-features-icon-container">
              <img
                src={feature.icon}
                alt={feature.alt}
                className="mobile-features-card-image"
              />
            </div>
            <div className="mobile-features-content">
              <h4 className="mobile-features-card-title">{feature.title}</h4>
              <p className="mobile-features-card-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileFeatures;