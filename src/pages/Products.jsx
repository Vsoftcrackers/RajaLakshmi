import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";

import ProductList from "../admin/ProductList";
import Footer from "../components/Footer";

import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import ProductsBack from "../components/ProductsBack";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";

const UserProducts = () => {
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
      {isMobile && <Sidebar /> }
      <ProductsBack />
 
    <ProductList/>

      <UpArrow/>
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default UserProducts;