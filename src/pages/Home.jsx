import React, { useState, useEffect } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";  // Keeping only the Header component
import HeroCarousel from "../components/HeroCarousel";
import GridLayout from "../components/GridLayout";
import GoldJewellery from "../components/GoldJewellery";
import FeaturesCircular from "../components/FeaturesCircular";
import ProductList from "../admin/ProductList";

import Footer from "../components/Footer";
import FireworksComp from "../components/FireWorks";

import UpArrow from "./UpArrow";

import CustomBottomNavigation from "../components/BottomNavbar";


import ContactIcons from "../components/ContactIcons";
import Sidebar from "../components/Sidebar";
import MobileFeatures from "../components/MobileFeatures";

const Home = () => {
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
      {/* Displaying only Header */}
      <Header />
      {isMobile ? (
        <>
          <Sidebar />
          <div
            style={{
              borderBottom: "1px solid #c67e00",
            }}
          >
            {/*<CustomDropdown />*/}
          </div>
          <FeaturesCircular />
         
        </>
      ) : (
        // No need to display HeaderTwo anymore
        <></>
      )}

      <HeroCarousel />
      <GridLayout />
      <GoldJewellery/>
    
    
      {!isMobile && <FeaturesCircular />}
   
      <ProductList/>
      <MobileFeatures />
      <ContactIcons />
      <UpArrow />
      {/* <Footer /> */}
      
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Home;

