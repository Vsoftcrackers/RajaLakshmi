import React from "react";
import "./Marquee.css"; // Ensure this file is in the same directory or adjust the path

const Marquee = () => {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-container-custom">
        <div className="marquee-text-custom" style={{ fontFamily: "PlayfairDisplay", wordSpacing: "5px" }}>

          <img src="assets/mar2.png" style={{ width: "25px", height: "25px", marginBottom: "-5px" }} />Rajalakshmi Crackers - Finest Fireworks from Sivakasi
          Celebrate Diwali with top-quality fireworks at unbeatable prices!     <img src="assets/mar2.png" style={{ width: "25px", height: "25px", marginBottom: "-5px" }} /> Directly sourced from trusted manufacturers with guaranteed quality. <img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} />We follow safety regulations and do not sell in prohibited cities.     <img src="assets/mar1.png" style={{ width: "30px", height: "20px" }} />
          <img src="assets/mar2.png" style={{ width: "25px", height: "25px", marginBottom: "-5px" }} />Book Now for Diwali! <img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} />
        </div>
      </div>
    </div>
  );
};

export default Marquee;