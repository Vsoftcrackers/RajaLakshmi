import React from "react";
import { useNavigate } from "react-router-dom";
import "./GoldJewellery.css";

const GoldJewellery = () => {
  const navigate = useNavigate();

  const handleCardClick = (section) => {
    navigate(`/products#${section}`);
  };

  const cards = [
    { id: 1, img: "/assets/gold1.webp", section: "earrings" },
    { id: 2, img: "/assets/gold2.webp", section: "bangles" },
    { id: 3, img: "/assets/gold3.webp", section: "chains" },
    { id: 4, img: "/assets/gold4.webp", section: "necklaces" },
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
