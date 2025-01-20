import React, { useState, useEffect } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import DailyHero from "../components/DailyHero";
import HeaderTwo from "../components/HeaderTwo";
import DailyContent from "../components/DailyContent";
import CustomBottomNavigation from "../components/BottomNavbar";
import Footer from "../components/Footer";
import DigiGoldBack from "../components/DigiGoldBack";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import DailyBack from "../components/DailyBack";
import UpArrow from "./UpArrow";
const  DailyCollection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="home-container">
      <Marquee />
      <Header />
  
      <Footer />

      {isMobile && <CustomBottomNavigation />}

   
    </div>
  );
};

export default DailyCollection;
