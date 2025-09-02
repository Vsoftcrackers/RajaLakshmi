import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";


import Footer from "../components/Footer";


import GridLayout from "../components/GridLayout";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct

import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";
import OrdersBack from "../components/OrdersBack";
import OrdersList from "../admin/OrdersList";
const AdminOrders = () => {
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
     
 
      {/* <OrdersBack/> */}
      <OrdersList/>
     

      <UpArrow/>
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default AdminOrders;
