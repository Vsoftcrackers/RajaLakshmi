import React from "react";
import { useNavigate } from "react-router-dom";
import "./SilverCards.css";

const SilverCards = () => {
  const navigate = useNavigate();

  const handleCardClick = (section) => {
    navigate(`/silver-collection#${section}`);
  };

  const cards = [
    { id: 1, img: "/assets/silver1.png", section: "bracelets" },
    { id: 2, img: "/assets/silver2.png", section: "bangles" },
  ];

  return (
    <div className="silverjewellery-container">
    <div className="one">
        <h1 className="main-heading" style={{textTransform:"capitalize"}}>Silver Collections</h1>
        <p className="sub-heading" style={{fontFamily:"PlayfairDisplay"}}>Shine with the brilliance of our exquisite silver designs.</p>
      </div>

      {/* Cards Section */}
      <div className="silvercards">
        {cards.map((card) => (
          <div
            className="silvercard"
            key={card.id}
            onClick={() => handleCardClick(card.section)}
          >
            <img
              className="silvercard__image"
              src={card.img}
              alt={`Silver Collection ${card.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SilverCards;
