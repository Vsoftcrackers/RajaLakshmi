import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NewArrivals.css";

const NewArrivals = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const images = [
    { src: "assets/newarrivals1.webp", name: "crackers" },
    { src: "assets/newarrivals2.webp", name: "crackers" },
    { src: "assets/newarrivals3.webp", name: "crackers" },
    { src: "assets/newarrivals4.webp", name: "crackers" },
    { src: "assets/newarrivals5.webp", name: "crackers" },
    { src: "assets/newarrivals6.webp", name: "crackers" },
    { src: "assets/newarrivals7.webp", name: "crackers" },
    { src: "assets/newarrivals8.webp", name: "crackers" },
    { src: "assets/newarrivals9.webp", name: "crackers" },
    { src: "assets/newarrivals10.webp", name: "crackers" },
  ];

  return (
    <div className="new-arrivals-wrapper">
      <div className="new-arrivals">
  
   
        <Slider {...settings}>
          {images.map((item, index) => (
            <div className="card" key={index}>
              <img
                src={item.src}
                alt={`New Arrival ${index + 1}`}
                className="card-image"
              />
              <p className="image-caption">{item.name}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewArrivals;

