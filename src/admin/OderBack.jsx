// AboutBack.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/AboutBack.css'; // Optional for additional styling

const OderBack = () => {
  return (
    <header className="aboutback-header-unique">
      <nav className="aboutback-nav-unique">
        <Link to="/adminproducts" className="nav-link-unique">Admin</Link>
        <span className="separator-unique"> &lt; </span>
        <span className="about-us-text" >Orders</span>
      </nav>
    </header>
  );
};

export default OderBack;
