import React, { useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar after navigation
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="custom-sidebar-toggle" onClick={toggleSidebar}>
        <RiMenu2Line />
      </button>

      {/* Sidebar */}
      <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
        <div className="custom-sidebar-header">
      
          <button className="custom-sidebar-close" onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <nav className="custom-sidebar-nav">
          <ul>
          <li onClick={() => handleNavigation("/")}>Home</li>
         
          <li onClick={() => handleNavigation("/products")} className="blink" style={{fontWeight:"bold"}}>Pricelist</li>
            
          
            <li onClick={() => handleNavigation("/about")} >About Us </li>
        
            <li onClick={() => handleNavigation("/enquiry")}>Contact Us</li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
