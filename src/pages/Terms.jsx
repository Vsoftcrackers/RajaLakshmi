import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar";
import Sidebar from "../components/Sidebar";
import UpArrow from "./UpArrow";
import "./Terms.css";
import TermBack from "../components/Termback";

const Terms = () => {
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
    <div className="terms-container">
      <Marquee />
      <Header />
      {isMobile && <Sidebar />}
      <TermBack />

      <div className="terms-heading-container">
        <h1 className="main-heading">Terms & Conditions</h1>
        <p>
          For the purpose of these Terms and Conditions, the term "You",
          "your", "user", "visitor" shall mean any natural or legal person who
          is visiting our website and/or agreed to purchase from us.
        </p>
        <p>
          Your use of the website and/or purchase from us are governed by the
          following Terms and Conditions:
        </p>

        <p>
          <img
            src="assets/mar1.png"
            alt="icon"
            style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
          />{" "}
          The content of the pages of this website is subject to change without
          notice.
        </p>

        <p>
          <img
            src="assets/mar1.png"
            alt="icon"
            style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
          />{" "}
          Neither we nor any third parties provide any warranty or guarantee as
          to the accuracy, timeliness, performance, completeness, or suitability
          of the information and materials found or offered on this website for
          any particular purpose. You acknowledge that such information and
          materials may contain inaccuracies or errors, and we expressly exclude
          liability for any such inaccuracies or errors to the fullest extent
          permitted by law.
        </p>

        <p>
          <img
            src="assets/mar1.png"
            alt="icon"
            style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
          />{" "}
          Your use of any information or materials on our website and/or product
          pages is entirely at your own risk, for which we shall not be liable.
          It shall be your own responsibility to ensure that any products,
          services, or information available through our website and/or product
          pages meet your specific requirements.
        </p>



        <p>
          <img
            src="assets/mar1.png"
            alt="icon"
            style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
          />{" "}
          All trademarks reproduced in our website which are not the property
          of, or licensed to, the operator are acknowledged on the website.
        </p>

        <p>
          <img
            src="assets/mar1.png"
            alt="icon"
            style={{ width: "30px", height: "20px", marginBottom: "-5px" }}
          />{" "}
          From time to time our website may also include links to other
          websites. These links are provided for your convenience to provide
          further information.
        </p>


      </div>

      <UpArrow />
      <Footer />
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Terms;
