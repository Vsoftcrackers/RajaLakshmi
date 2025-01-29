import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Abouthero from "../components/Abouthero";
import CustomBottomNavigation from "../components/BottomNavbar"; 
import AboutBack from "../components/AboutBack";
import Sidebar from "../components/Sidebar"; 
import UpArrow from "./UpArrow";
import './Privacy.css';

const Privacy = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Hook to update state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="AboutUs-container">
      <Marquee />
      <Header />
      {isMobile && <Sidebar />}
      <AboutBack />

      
      <div className="privacy-policy-container">
      {/*<video autoPlay loop muted className="background-video">
        <source src="/assets/contact.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}

        <h1 className="privacy-policy-heading">Privacy Policy</h1> {/* Centered heading */}
        <h2>Privacy Policy</h2>
        <p>
          Our Privacy Policy administers the way in which we collect, use, maintain, and disclose data collected from users. This privacy policy applies to the Site and all products sold by us.
        </p>
        <h2>Personal Identification Information</h2>
        <p>
          Personal identification information may be required by the site in order to develop a user-friendly environment of the website. We may collect personal identification information from users in different ways including, but not limited to, when users visit our site, place an order, or fill out a form. Users may be asked for their name, email address, mailing address, and phone number. Users can always refuse to supply personal identification information at any time during their visit to our website.
        </p>
        <h2>Non-Personal Identification Information</h2>
        <p>
          Non-personal identification information may include the browser name, type of computer, and technical information about users. We may collect non-personal identification information about users whenever they interact with our site.
        </p>
        <h2>Browser Cookies</h2>
        <p>
          We store cookies to improve our user experience. Users may choose to set their web browser to refuse cookies or alert them when cookies are being sent.
        </p>
        <h2>Protection of Information</h2>
        <p>
          We maintain a secure way to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our site.
        </p>
        <h2>Policy Acceptance</h2>
        <p>
          By logging into our site, you accept our privacy policy. Users can deactivate their account at any time, thus declaring that they are no longer bound by the terms of our privacy policy.
        </p>
      </div>

      <UpArrow />
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Privacy;
