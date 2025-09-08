import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import CancellationBack from "../components/Cancellationback";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";

import "./Cancellation.css";

const CancellationAndRefund = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Hook to update state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="AboutUs-container">
      <Marquee />
      <Header />
      {isMobile && <Sidebar />}
      <CancellationBack />
      <div className="CancellationAndRefund-container"></div>
      {/* Cancellation and Refund Terms Section */}
      <div className="terms-section">
        <h2>Cancellation and Refund Policy</h2>
        <p>
          For the purpose of these Terms and Conditions, the terms 
          "You", "your", "user", "visitor" shall mean any natural or legal
          person who is visiting our website and/or agreed to purchase from us.
        </p>
        <ul>
          <li>
            The content of the pages of this website is subject to change
            without notice.
          </li>
          <li>
            <img
              src="assets/mar1.png"
              style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
            />
            Neither we nor any third parties provide any warranty or guarantee
            as to the accuracy, timeliness, performance, completeness, or
            suitability of the information and materials found or offered on
            this website for any particular purpose.
          </li>
          <li>
            <img
              src="assets/mar1.png"
              style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
            />
            Your use of any information or materials on our website and/or
            product pages is entirely at your own risk, for which we shall not
            be liable.
          </li>
          <li>
            <img
              src="assets/mar1.png"
              style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
            />
            From time to time our website may also include links to other
            websites. These links are provided for your convenience.
          </li>
          <li>
            <img
              src="assets/mar1.png"
              style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
            />
            Any dispute arising out of use of our website and/or purchase with
            us and/or any engagement with us is subject to the laws of India.
          </li>
        </ul>
      </div>

      <UpArrow />
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default CancellationAndRefund;
