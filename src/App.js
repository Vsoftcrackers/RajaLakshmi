import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";

import Enquiry from "./pages/Enquiry";
import CollectionPage from "./pages/Terms";
import DiamondPage from "./pages/DiamondPage";

import DigiGold from "./pages/DigiGold";
import Spinner from "./pages/Spinner"; // Import the Spinner component
import AOS from "aos";
import "aos/dist/aos.css";
import SchemesPage from "./pages/SchemesPage";
import FuturePlus from "./pages/FuturePlus";
import FutureGold from "./pages/FutureGold";
import FlexiGold from "./pages/FlexiGold";
import ScrollToTop from "./pages/ScrollToTop";
import  ProductList from "./admin/ProductList";
import AdminProducts from "./admin/AdminProducts";
import MKMadminlogin from "./admin/MKMadminlogin";
import Checkout from "./admin/Checkout";
import OrdersList from "./admin/OrdersList";
function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading time, adjust as needed
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust time as needed (e.g., 3 seconds for demo)
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);
  return (
    <Router>
        <ScrollToTop /> 
      {loading ? (
        <Spinner /> 
      // Show spinner while loading
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
        
          <Route path="/enquiry" element={<Enquiry />} />
   
          <Route path="/diamond-jewellery" element={<DiamondPage />} />

          <Route path="/schemes" element={<SchemesPage/>} />
          <Route path="/digigold" element={<DigiGold />} />
          <Route path="/futureplus" element={<FuturePlus/>} />
          <Route path="/futuregold" element={<FutureGold/>} />
          <Route path="/flexigold" element={<FlexiGold/>} />
        
          <Route path="/checkout" element={<Checkout/>}/>
          
          <Route path="/adminlogin" element={<MKMadminlogin/>}/>
          <Route path="/adminproducts" element={<AdminProducts/>}/>
          <Route path="/products" element={<ProductList/>}/>
          <Route path="/orders" element={<OrdersList/>}/>
        </Routes>
      )}
    </Router>
  );
}

export default App;
