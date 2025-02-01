import React, { useEffect, useRef, useState } from "react";
import "./FeaturesCircular.css";

const FeaturesCircular = () => {
  const scrollContainerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        // Check current scroll position
        if (scrollDirection === 1) {
          // Scroll right
          if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
            setScrollDirection(-1); // Reverse direction when reaching the end
          } else {
            scrollContainer.scrollLeft += 1; // Scroll right
          }
        } else {
          // Scroll left
          if (scrollContainer.scrollLeft <= 0) {
            setScrollDirection(1); // Reverse direction when reaching the start
          } else {
            scrollContainer.scrollLeft -= 1; // Scroll left
          }
        }
      }
    }, 20); // Adjust interval for speed

    return () => clearInterval(scrollInterval);
  }, [scrollDirection]);

  const circularFeatures = [
    {
      id: 1, 
      name: "Drone",
      imageUrl: "/assets/features_circle/drone.jpg",
      href: "#"
    },
    {
      id: 2,
      name: "4\" Lakshmi",
      imageUrl: "/assets/features_circle/4-lakshmi-crackers.webp",
      href: "#",
    },
    {
      id: 3,
      name: "Magic-Peacock",
      imageUrl: "/assets/features_circle/Magic-Peacock.jpg",
      href: "#",
    },
    {
      id: 4,
      name: "1000 Wala",
      imageUrl: "/assets/features_circle/1000-wala.jpeg",
      href: "#",
    },
    {
      id: 5,
      name: "Flower Pots Special",
      imageUrl: "/assets/features_circle/flower-pots-special.jpeg",
      href: "#",
    },
    {
      id: 6,
      name: "30-Shots Multicolor",
      imageUrl: "/assets/features_circle/30-shot-maan.jpg",
      href: "#",
    },
    {
      id: 7,
      name: "5000 Wala",
      imageUrl: "/assets/features_circle/12shots.jpg",
      href: "#",
    },
    {
      id: 8, name: "Super Deluxe",
      imageUrl: "/assets/features_circle/super-deluxe.webp",
      href: "#"
    },
    {
      id: 9,
      name: "Rang chakkar",
      imageUrl: "/assets/features_circle/rang-chakkar.jpg",
      href: "#",
    },
    {
      id: 10,
      name: "Bijli",
      imageUrl: "/assets/features_circle/100-bijili.jpg",
      href: "#",
    }
  ];

  return (
    <div className="features-circular-container" ref={scrollContainerRef}>
      {circularFeatures.map((feature) => (
        <a
          key={feature.id}
          href={feature.href}
          target={feature.href.startsWith("http") ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="orb-wrapper"
        >
          <div className="orb">
            <img
              src={feature.imageUrl}
              alt={feature.name}
              className="orb-image"
            />
          </div>
          <p className="orb-label">{feature.name}</p>
        </a>
      ))}
    </div>
  );
};

export default FeaturesCircular;

