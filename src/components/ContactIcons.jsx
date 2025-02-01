import React from 'react';
import { FaWhatsapp, FaEnvelope,FaShoppingBasket,FaCartPlus  } from 'react-icons/fa'; // Import the icons
import './ContactIcons.css'; // Import the CSS file for styling

const ContactIcons = () => {
  return (
    <div>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/+919500759557"
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={20} /> {/* Reduced icon size */}
        <span className="tooltip">WhatsApp</span>
      </a>

      <a href='/products'
      className='Quick-Order'>
        <FaCartPlus size={20}/>
        <span className='tooltip'>Quick Orders</span>
      </a>

      {/* Enquiry Floating Button */}
      <a
        href="/enquiry"
        className="enquiryfloat-button"
      >
        <FaEnvelope size={20} /> {/* Reduced icon size */}
        <span className="tooltip">Enquiry</span>
      </a>
    </div>
  );
};

export default ContactIcons;
