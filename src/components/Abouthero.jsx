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
    At Rajalakshmi Crackers, we take pride in offering high-quality fireworks that add joy, color, and excitement to every occasion. Whether it's a festival, wedding, birthday, or any special event, our range of crackers ensures that your celebrations are truly unforgettable.
  </p>
  <p>
    We are committed to delivering products that meet the highest standards of safety, performance, and satisfaction. Our goal is to make every moment sparkle with vibrant fireworks that create lasting memories.
  </p>
  <p>
    Thank you for choosing Rajalakshmi Crackers to be part of your celebrations. We look forward to lighting up your special moments!
  </p>


        </div>

        {/* Our Mission and Promise Section */}
        <div className="about-section">
  <h2 className="about-hero-heading" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
    Our Mission and Promise
  </h2>
  <p>
    At Rajalakshmi Crackers, our mission is to deliver high-quality, safe, and vibrant fireworks that enhance every celebration. We aim to be a trusted name, providing top-tier crackers that bring joy, brightness, and excitement to your special moments.
  </p>
  <p>
    We promise to consistently offer products that meet the highest standards of safety and performance. Our commitment to customer satisfaction drives us to continually refine and expand our range, ensuring your celebration is nothing short of spectacular.
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
    The journey of Rajalakshmi Crackers began with a simple yet powerful standard: to provide high-quality fireworks for every celebration. From the very start, our focus has been on offering products that bring people together, lighting up every special moment with joy and safety.
  </p>
  <p>
    We have always been committed to maintaining the highest standards of quality and customer satisfaction. Through hard work and dedication, we've steadily grown, ensuring that every product we offer meets the expectations of our valued customers.
  </p>
  <p>
    Today, Rajalakshmi Crackers stands as a trusted name, continually striving for excellence. Our journey is far from over, and we are excited to continue lighting up celebrations and creating lasting memories for years to come.
  </p>
</div>

      
        
      </div>
    </div>
  );
};

export default AboutHero;
