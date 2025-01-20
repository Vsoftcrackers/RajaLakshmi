import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Diamond.css';

const Diamond = () => {
  const navigate = useNavigate();

  const handleImageClick = (section) => {
    navigate('/diamond-jewellery', { state: { section } });
  };

  return (
    <div className="diamond-page">
       <div className="one">
        <h1 className="main-heading" style={{textTransform:"capitalize"}}>Diamond Jewellery</h1>
        <p  className="sub-heading" style={{fontFamily:"PlayfairDisplay"}}>Sparkle through the festive nights with timeless diamonds</p>
      </div>
      <div className="diamond-container">
        <div
          className="diamond-full"
          onClick={() => handleImageClick('necklaces')}
        >
          <img src="assets/diamond.webp" alt="Diamond" className="diamond-image" />
        </div>
        <div className="diamond-grid">
          <div
            className="diamond-row"
            onClick={() => handleImageClick('earrings')}
          >
            <img src="assets/diamond2.webp" alt="Diamond 2" className="diamond-image" />
          </div>
          <div
            className="diamond-row"
            onClick={() => handleImageClick('rings')}
          >
            <img src="assets/diamond3.webp" alt="Diamond 3" className="diamond-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diamond;
