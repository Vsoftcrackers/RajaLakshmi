import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./Header.css"; // Header styles

const Header = () => {

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            src="assets/spinner.png"
            alt="Logo"
            className="logo"
            style={{ width: "130px", height: "60px" }}
          />
        </Link>
      </div>
      <div className="headlinks">
        <Link to="/" className="links">Home</Link>

        <Link to="/products" className="blink links">Pricelist</Link>

        <Link to="/about" className="links">About Us</Link>

        <Link to="/enquiry" className="links">Contact Us</Link>
      </div>
    </header>
  );
};

export default Header;
