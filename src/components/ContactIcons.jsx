import React from 'react';
import { FaWhatsapp, FaEnvelope,FaShoppingBasket ,FaPhone} from 'react-icons/fa'; // Import the icons
import './ContactIcons.css'; // Import the CSS file for styling

const ContactIcons = () => {
  const isMobile = window.innerWidth <= 768;

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
        <FaShoppingBasket size={20}/>
        <span className='tooltip'>Quick Orders</span>
      </a>

      {/* Enquiry Floating Button */}
      {isMobile?
        <a
        href="tel:+919500759557"
        className="enquiryfloat-button">
            <FaPhone size={20} />
            <span className="tooltip">Call Us</span>
        </a>
      :
      <a
      href="/enquiry"
      className="enquiryfloat-button"
    >
      <FaEnvelope size={20} /> {/* Reduced icon size */}
      <span className="tooltip">Enquiry</span>
    </a>
      }
      
    </div>
  );
};

export default ContactIcons;
