import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import HeaderTwo from "../components/HeaderTwo";
import Footer from "../components/Footer";
import Abouthero from "../components/Abouthero";

import GridLayout from "../components/GridLayout";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import AboutBack from "../components/AboutBack";
import Owner from "../components/Owner";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";

const AboutUs = () => {
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
      {isMobile ? <Sidebar /> : <HeaderTwo />}
      <AboutBack />
 
      <Abouthero />
     

      <UpArrow/>
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default AboutUs;
