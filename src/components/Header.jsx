import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5"; // Location icon
import { GiRotaryPhone } from "react-icons/gi";
import CustomDropdown from "./CustomDropdown"; // Import the CustomDropdown component
import { Link } from "react-router-dom"; // Import Link
import "./Header.css"; // Header styles

const Header = () => {

  return (
    <header className="header">
   <div className="logo-container">
  <Link to="/">
    <img
      src="assets/spinner.png"
      alt="Logo"
      className="logo"
      style={{ width: "130px", height: "55px" }}
    />
  </Link>
</div>

      <div className="search-container">
        {/*<CustomDropdown
          options={[
            { label: "Gold Rings", value: "gold-jewellery#rings" },
            { label: "Gold Bangles", value: "gold-jewellery#bangles" },
            { label: "Diamond Rings", value: "diamond-jewellery#rings" },
            { label: "Silver Articles", value: "silver-collection#articles" },
            { label: "Schemes (DigiGold)", value: "digigold" },
          ]}
          placeholder="Search here..."
        />*/}
      </div>
    </header>
  );
};

export default Header;
