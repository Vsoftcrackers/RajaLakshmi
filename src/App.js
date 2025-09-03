import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";

import Enquiry from "./pages/Enquiry";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cancellation from "./pages/Cancellation";
import Spinner from "./pages/Spinner"; // Import the Spinner component
import AOS from "aos";
import "aos/dist/aos.css";

import ScrollToTop from "./pages/ScrollToTop";
import  UserProducts from "./pages/Products";
import AdminProduct from "./pages/AdminProduct";
import Adminlogin from "./admin/Adminlogin";
import CheckoutPage from "./pages/CheckoutPage";

import AdminOrders from "./pages/AdminOrders";
import Shipping from "./pages/Shipping";
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
   
          <Route path="/terms" element={<Terms/>}/>
          
          <Route path="/cancellationpolicy" element={<Cancellation/>}/> 
         /* <Route path="/privacy" element={<Privacy/>}/>*/
         <Route path="/shipping" element={<Shipping/>} />
        
          <Route path="/checkout" element={<CheckoutPage/>}/>
          
          <Route path="/adminlogin" element={<Adminlogin/>}/>
          <Route path="/adminproducts" element={<AdminProduct/>}/>
          <Route path="/products" element={<UserProducts/>}/>
          <Route path="/orders" element={<AdminOrders/>}/>
        </Routes>
      )}
    </Router>
  );
}

export default App;
