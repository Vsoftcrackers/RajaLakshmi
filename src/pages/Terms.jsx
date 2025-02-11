import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";

import CustomBottomNavigation from "../components/BottomNavbar";

import Sidebar from "../components/Sidebar";
import UpArrow from "./UpArrow";
import './Terms.css';
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
          For the purpose of these Terms and Conditions, the term "we", "us", 
          "our" used anywhere on this page shall mean ILANCHELIAN BABU JEYA VIGNESH RAJA I, 
          whose registered/operational office is Perunayakkan patti to Aanaikootam Road 
          Virudhunagar TAMIL NADU 626124. "You", "your", "user", "visitor" shall mean any 
          natural or legal person who is visiting our website and/or agreed to purchase from us.
        </p>
        <p>
          Your use of the website and/or purchase from us are governed by the following Terms and Conditions:
        </p>
<<<<<<< HEAD
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          The content of the pages of this website is subject to change without notice.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
=======
        <p><img src="assets/mar1.png" alt="Crackers1" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          The content of the pages of this website is subject to change without notice.
        </p>
        <p><img src="assets/mar1.png" alt="Crackers2" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
>>>>>>> 2cfb2cf (Added contact icons and fixed alignment issues)
          Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, 
          performance, completeness, or suitability of the information and materials found or offered on this 
          website for any particular purpose. You acknowledge that such information and materials may contain 
          inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the 
          fullest extent permitted by law.
        </p>
<<<<<<< HEAD
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
=======
        <p><img src="assets/mar1.png" alt="crackers3" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
>>>>>>> 2cfb2cf (Added contact icons and fixed alignment issues)
          Your use of any information or materials on our website and/or product pages is entirely at your own risk, 
          for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, 
          or information available through our website and/or product pages meet your specific requirements.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, 
          the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with 
          the copyright notice, which forms part of these terms and conditions.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          All trademarks reproduced in our website which are not the property of, or licensed to, the operator are 
          acknowledged on the website.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          From time to time our website may also include links to other websites. These links are provided for your 
          convenience to provide further information.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          You may not create a link to our website from another website or document without ILANCHELIAN BABU JEYA 
          VIGNESH RAJA I’s prior written consent.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject 
          to the laws of India.
        </p>
        <p><img src="assets/mar1.png" style={{ width: "30px", height: "20px", marginBottom: "-5px" }} /> 
          We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out 
          of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset 
          limit mutually agreed by us with our acquiring bank from time to time.
        </p>
      </div>

      <UpArrow />
      <Footer />
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Terms;
