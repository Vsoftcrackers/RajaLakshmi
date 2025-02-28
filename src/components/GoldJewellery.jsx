import React from "react";
import { useNavigate } from "react-router-dom";
import "./GoldJewellery.css";

const GoldJewellery = () => {
  const navigate = useNavigate();

  const handleCardClick = (section) => {
    navigate(`/products#${section}`);
  };

  const cards = [
    { id: 1, img: "/assets/4-Cards/Colourful-Sky(1).png", section: "earrings" },
    { id: 2, img:"/assets/4-Cards/Colourful-Sky(2).png", section: "bangles" },
    { id: 3, img: "/assets/4-Cards/Colourful-Sky(3).png", section: "chains" },
    { id: 4, img: "/assets/4-Cards/Colourful-Sky(4).jpg", section: "necklaces" },
  ];

  return (
    <div className="goldjewellery-container">


      {/* Cards Section */}
      <div className="goldcards">
        {cards.map((card) => (
          <div
            className="goldcard"
            key={card.id}
            onClick={() => handleCardClick(card.section)}
          >
            <img
              className="goldcard__image"
              src={card.img}
              alt={`crackers ${card.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldJewellery;
