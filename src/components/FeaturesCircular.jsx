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
    { id: 1, name: "crackers", imageUrl: "/assets/round2.webp", href: "#" },
    {
      id: 2,
      name: "crackers",
      imageUrl: "/assets/jewels/gold/necklace/necklace1.webp",
      href: "gold-jewellery#necklaces",
    },
    {
      id: 3,
      name: "crackers",
      imageUrl: "/assets/jewels/gold/bracelet/bracelet1.jpg",
      href: "gold-jewellery#bracelets",
    },
    {
      id: 4,
      name: "crackers",
      imageUrl: "/assets/jewels/gold/chain/chain1.webp",
      href: "gold-jewellery#chains",
    },
    {
      id: 5,
      name: "crackers",
      imageUrl: "/assets/jewels/gold/nosepin/nosepin1.webp",
      href: "gold-jewellery#nosepins",
    },
    {
      id: 6,
      name: "crackers",
      imageUrl: "/assets/jewels/diamond/rings/diamondring1.webp",
      href: "diamond-jewellery#rings",
    },
    {
      id: 7,
      name: "crackers",
      imageUrl: "/assets/jewels/silver/idols/idol1.webp",
      href: "silver-collection#idols",
    },
    { id: 8, name: "crackers", imageUrl: "/assets/puritymeter.jpg", href: "#" },
    {
      id: 9,
      name: "crackers",
      imageUrl: "/assets/mobile.png",
      href: "https://play.google.com/store/apps/details?id=com.ri.zinger.mkmthangamaligai",
    },
    { id: 10, name: "crackers", imageUrl: "/assets/car.png", href: "#" },
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

