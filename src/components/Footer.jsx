import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <div className="footer-sections">
        {/* Logo and description in the same div */}
        <div className="footer-logo-description">
          <img src="assets/logo.png" alt=" Logo" className="logo-image" />
          <h3>Explore our exclusive crackers online. Anytime! Anywhere!</h3>
          <p style={{ textAlign: "justify" }}>
            Celebrate Diwali and every other Indian festival with the convenience of shopping crackers online. By shopping online with Rajalakshmi Crackers, you unlock a world of benefits including the ease of shopping from home, a wide variety of options, and the best prices available.
          </p>
        </div>

        <div className="footer-section">
          <h3>Explore us</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About us</a></li>
            <li><a href="/enquiry">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Our Policies</h3>
          <ul className="footer-links">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/cancellationpolicy">Cancellation & Refund</a></li>
            <li><a href="/privacy">Privacy policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Let us help you</h3>
          <ul className="footer-links">
            <li><a href="/enquiry">Contact us</a></li>
            <li><a href="mailto:rajalakshmicrackersad@gmail.com"><b>Email: rajalakshmicrackersad@gmail.com</b></a></li>
            <li><b>Address:</b> Sivakasi Main Road, 626005</li>
            <li><a href="tel:+91 9384810725"><b>Phone No:</b> +91 - 7010857010</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Rajalakshmi Crackers. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
