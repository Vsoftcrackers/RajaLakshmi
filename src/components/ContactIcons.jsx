import React from 'react';
import {  FaPhone } from 'react-icons/fa';
import './ContactIcons.css';

const ContactIcons = () => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div>
      <a href="/products" className="Quick-Order">
        <img src="\assets\quick-order-logo.png" alt="Quick-Order" className="Quick-Order-Pic" />
        <span className="tooltip">Quick Orders</span>
      </a>

      <a href="https://wa.me/+917010857010" className="whatsapp-button" target="_blank" rel="noopener noreferrer">
       <img src="\assets\whatsapp.png" alt="whatsapp" className='whatsapp' />
      </a>

      {isMobile ? (
        <a href="tel:+919500759557" className="enquiryfloat-button">
          <FaPhone size={20} />
          <span className="tooltip">Call Us</span>
        </a>
      ) : null}
    </div>
  );
};

export default ContactIcons;
