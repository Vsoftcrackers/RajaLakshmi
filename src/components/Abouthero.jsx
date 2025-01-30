import React from "react";
import "./Abouthero.css";

const AboutHero = () => {
  return (
    <div className="about-hero-container">
      {/* Image Section */}
      <div className="about-hero-image">
        <img src="/assets/about.png" alt="About Us" className="about-hero-img" />
      </div>

      <div className="about-hero-content">
        {/* Welcome Section */}
        <div className="about-section">
          <h2 className="about-hero-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            Welcome to Rajalakshmi Crackers
          </h2>
          <p>
            A Fresh New Start with a Commitment to Quality and Joy
          </p>
          <p>
            At Rajalakshmi Crackers, we are a new name in the cracker industry, but with a clear vision — to bring vibrant celebrations and safe, high-quality crackers to your doorstep. We believe that every celebration, whether it’s a victory, wedding, birthday, anniversary, or festival, becomes truly special with the right fireworks. Although we are newcomers to the field, our passion for quality, safety, and customer satisfaction is what sets us apart.
          </p>
          <p>
            We’re excited to offer a carefully selected range of top-quality crackers at competitive prices, ensuring that every occasion is filled with sparkles and joy.
          </p>
        </div>

        {/* Our Mission and Promise Section */}
        <div className="about-section">
          <h2 className="about-hero-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif"  }}>
            Our Mission and Promise
          </h2>
          <p>
            Rajalakshmi Crackers may be new, but our commitment to offering only the best products is unwavering. We are working hard to establish ourselves as your trusted source for crackers, providing a wide variety of products to make your celebrations memorable.
          </p>
          <p>
            We are passionate about delivering high-quality fireworks that meet our customers' expectations, and we are continuously improving our offerings to ensure that you enjoy a seamless shopping experience.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="about-section">
          <h2 className="about-hero-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif"  }}>
            Why Choose Rajalakshmi Crackers?
          </h2>
          <ul>
            <li><strong>Convenience:</strong> Say goodbye to long queues! Shop from the comfort of your home with just a few clicks.</li>
            <li><strong>Simplicity:</strong> Our selection process is straightforward, and all our products come with detailed descriptions, so you know exactly what you're buying.</li>
            <li><strong>Wide Range:</strong> We offer an array of crackers, from simple sparklers to grand fireworks, perfect for any occasion.</li>
            <li><strong>Affordable Pricing:</strong> As a new entrant, we focus on providing the best quality crackers at the most competitive prices.</li>
          </ul>
        </div>

        {/* Our Products and Services Section */}
        <div className="about-section">
          <h2 className="about-hero-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            Our Products and Services
          </h2>
          <ul>
            <li><strong>Exclusive Deals:</strong> We are constantly working to bring you the best deals and offers. Keep an eye out for our limited-time promotions designed to help you save while celebrating.</li>
            <li><strong>Premium Crackers:</strong> Although we are new to the industry, we make sure to stock only the finest quality crackers, sourced from trusted suppliers, to make your events shine brighter.</li>
            <li><strong>Reliable Delivery:</strong> As a new company, we are committed to building trust with our customers. We ensure reliable and punctual shipping, so your order arrives on time and in perfect condition.</li>
          </ul>
        </div>

        {/* The Rajalakshmi Crackers Journey Section */}
        <div className="about-section">
          <h2 className="about-hero-heading" style={{ fontFamily: "PlayFairDisplay" }}>
            The Rajalakshmi Crackers Journey
          </h2>
          <p>
            Founded in 2023, Rajalakshmi Crackers started with a vision to make high-quality fireworks accessible to every household and celebration. While our journey has just begun, we are already working hard to create a brand that you can rely on for all your festival needs. We aim to expand our reach and provide crackers that bring people together and light up every special moment.
          </p>
          <p>
            Though we are a new name in the industry, we believe in a future where Rajalakshmi Crackers becomes a trusted name, synonymous with quality, affordability, and customer satisfaction.
          </p>
          <p>
            We are building our brand with you in mind, and we invite you to be a part of our growing community.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default AboutHero;
