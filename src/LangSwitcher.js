import React from "react";
import "./LangSwitcher.css"; 

const LangSwitcher = ({ onLanguageChange }) => {
  return (
    <div className="center">
      <div className="switch">
        <input
          type="checkbox"
          id="lang-toggle"
          className="check-toggle check-toggle-round-flat"
          onChange={onLanguageChange}
        />
        <label htmlFor="lang-toggle"></label>
        <span className="on">EN</span>
        <span className="off">FR</span>
      </div>
    </div>
  );
};

export default LangSwitcher;
