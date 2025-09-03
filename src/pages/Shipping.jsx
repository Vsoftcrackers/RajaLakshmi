import React, { useEffect, useState } from "react";
import Marquee from "../components/Marquee";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomBottomNavigation from "../components/BottomNavbar"; // Ensure this path is correct
import CancellationBack from "../components/Cancellationback";
import Sidebar from "../components/Sidebar"; // Ensure Sidebar is imported
import UpArrow from "./UpArrow";

import './Cancellation.css';
import ShippingBack from "../components/ShippingBack";

const Shipping = () => {
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
      <ShippingBack />
      <div className="CancellationAndRefund-container"></div>
      {/* Cancellation and Refund Terms Section */}
      <div className="terms-section">
        <h2>Shipping Policy</h2>
        <p>
For the purpose of these Terms and Conditions, the terms "we", "us", "our" used anywhere on this page shall mean ILANCHELIAN BABU JEYA VIGNESH RAJA, whose registered/operational office is located at Pernayakkanpatti to Aanaikootam Road Virudhunagar TAMIL NADU 626124. "You", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.        </p>
        <ul>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Orders are processed and shipped within 1-2 business days from the date of order confirmation and payment receipt, subject to product availability.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.For domestic buyers within India, orders are shipped through registered domestic courier companies such as Blue Dart, DTDC, Delhivery and/or India Speed Post only.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>For International buyers, orders are shipped and delivered through registered international courier companies such as DHL, FedEx and/or International Speed Post only.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Delivery time for domestic orders is typically 3-7 business days depending on the destination and courier service efficiency.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Delivery time for international orders is typically 7-21 business days depending on the destination country and customs clearance procedures.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>All orders will be delivered to the shipping address provided by the buyer at the time of order placement. We are not responsible for orders delivered to incorrect addresses provided by the customer.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/> ILANCHELIAN BABU JEYA VIGNESH RAJA is not liable for any delay in delivery caused by courier companies, postal authorities, customs clearance, natural disasters, or circumstances beyond our control.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>We guarantee to hand over the consignment to the courier company or postal authorities within the committed time frame from the date of order confirmation.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Shipping charges are calculated based on the weight of the package and delivery location. Shipping costs will be displayed at checkout before payment.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>For orders above Rs. 500 within India, free shipping may be applicable as per ongoing promotional offers.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>Delivery confirmation will be sent to your registered email ID and mobile number once the order is dispatched.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>In case of failed delivery attempts due to incorrect address, customer unavailability, or refusal to accept, additional shipping charges may apply for re-delivery.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>We do not ship to PO Box addresses. Please provide complete street address with landmark for successful delivery.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/> Special handling may be required for fragile items and crackers, which may extend delivery time by 1-2 additional days.</li>
          <li><img src="assets/mar1.png" style={{width:"30px", height:"20px", marginBottom:"-5px"}}/>  For any shipping related queries or issues, customers may contact our customer service at 7010857010 or email rajalakshmicrackers@gmail.com</li>
        </ul>
      </div>

      <UpArrow />  
      <Footer />
      {/* Display the bottom navigation only if it's a mobile screen */}
      {isMobile && <CustomBottomNavigation />}
    </div>
  );
};

export default Shipping;
