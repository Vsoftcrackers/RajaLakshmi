// AboutBack.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutBack.css'; // Optional for additional styling

const GoldBack = () => {
  return (
    <header className="aboutback-header-unique">
      <nav className="aboutback-nav-unique">
        <Link to="/" className="nav-link-unique">Home</Link>
        <span className="separator-unique"> &lt; </span>
        <span className="about-us-text" >Gold Jewellery</span>
      </nav>
    </header>
  );
};

export default GoldBack;
