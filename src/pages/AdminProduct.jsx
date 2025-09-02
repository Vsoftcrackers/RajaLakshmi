import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import UpArrow from "./UpArrow";
import ProductsUpload from "../admin/ProductsUpload";



const AdminProduct = () => {
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
      <div className="top-header">
      
            <div className="logo-container">
                <img
                  src="assets/logo.png"
                  alt="Logo"
                  className="logo"
                />
            </div>
           <div className="logo-Name-container">
              <img
                src="assets/Final_logo_Name.png"
                alt="Logo"
                className="logo-Name"
              />
           </div>
            </div>
      
 
  <ProductsUpload/>
     

      <UpArrow/>
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default AdminProduct;