import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import AboutBack from "../components/AboutBack";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";

import './Cancellation.css';

const CancellationAndRefund = () => {
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
    <div className="CancellationAndRefund-container">
      <Marquee />
      <Header />
      {isMobile && <Sidebar />}
      <AboutBack />
      
      {/* Cancellation and Refund Terms Section */}
      <div className="terms-section">
        <h2>Cancellation and Refund Policy</h2>
        <p>
          For the purpose of these Terms and Conditions, the terms "we", "us", "our" used anywhere on this page shall mean ILANCHELIAN BABU JEYA VIGNESH RAJA I, whose registered/operational office is located at Perunayakkan patti to Aanaikootam Road Virudhunagar TAMIL NADU 626124. "You", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
        </p>
        <ul>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>The content of the pages of this website is subject to change without notice.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Our website contains material which is owned by or licensed to us. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>From time to time our website may also include links to other websites. These links are provided for your convenience.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, due to exceeding the preset limit mutually agreed by us with our acquiring bank from time to time.</li>
        </ul>
      </div>

      <UpArrow />  
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default CancellationAndRefund;
