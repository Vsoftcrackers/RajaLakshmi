import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import AboutBack from "../components/AboutBack";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";
import './Terms.css';


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
    <div className="AboutUs-container">
      <Marquee />
      <Header />
      {isMobile && <Sidebar />}
      <AboutBack />

      {/* Add the heading here */}
      <div className="terms-heading">
      <h1 className="main-heading" style={{textTransform:"capitalize"}}>Terms and Conditions</h1>
   

      {/* The Terms and Conditions content goes here */}
      <div className="terms-content">
        <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean ILANCHELIAN BABU JEYA VIGNESH RAJA I, whose registered/operational office is Perunayakkan patti to Aanaikootam Road Virudhunagar TAMIL NADU 626124 . "you", “your”, "user", “visitor” shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
        
        <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>{/* Continue with the rest of the text as per your requirement */}
      
      <ul>
      <li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> The content of the pages of this website is subject to change without notice.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> 	All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> 	Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> 	You may not create a link to our website from another website or document without ILANCHELIAN BABU JEYA VIGNESH RAJA I’s prior written consent.</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> 	Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</li>
<li><img src="assets/mar2.png" style={{width:"25px", height:"25px", marginBottom:"-5px"}}/> 	We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
</ul></div>  </div>

      <UpArrow />
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Terms;
