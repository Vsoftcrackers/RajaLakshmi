
import React from 'react';
import './FlexiGoldContent.css'; // Import the CSS for styling

const DailyContent = () => {
  return (
    <div className="flexi-gold-hero-container">
      <div className="flexi-gold-hero-content">
        
        {/* Introduction Section */}
        <div className="flexi-gold-section">
  <h2 className="flexi-gold-heading">Summary</h2>
  <p className="flexi-gold-text">
    The MKM Daily Collection Scheme is designed to make gold ownership accessible for everyone, including daily wage earners and families with limited income. This flexible and affordable plan allows you to invest a small, fixed amount each month. After just 11 months of consistent savings, you can receive a beautiful gold jewel in return. This scheme provides a secure and practical way to build your gold assets without the burden of large upfront costs, helping you fulfill your dreams and secure your future with ease.
  </p>
</div>




   

      
      {/* Contact Section */}
      <div className="flexi-gold-section flexi-gold-contact">
          <h2 className="flexi-gold-heading">For Any Scheme Related Query</h2>
          <p className="flexi-gold-text">
            <strong>Contact Us :</strong> <br />
            <strong style={{marginLeft:"10px"}}>Mail-Id</strong> <a href="mailto:mkmthangamaligai@gmail.com" style={{marginLeft:"33px"}}>:mkmthangamaligai@gmail.com</a> <br />
            <strong style={{marginLeft:"10px"}}>Landline No</strong> <b>:+0462 4055001</b><br />
            <strong style={{marginLeft:"10px"}}>Phone No</strong><b style={{marginLeft:"15px"}}> :+91 9384810725</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DailyContent;
