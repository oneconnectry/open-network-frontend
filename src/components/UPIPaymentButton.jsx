import React, { useState, useEffect, useRef } from "react";
import copyIcon from "../assets/social/iinstagram.png";

export default function UPIPaymentButton({ upiId, buttonText = "Pay with UPI" }) {
  
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef(null);
  

  // all hooks at top level
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setShowAlert(false);
      }
    };

    if (showAlert) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAlert]);

  // if no UPI ID → render nothing
  if (!upiId) return null;

  const payWithUPI = () => {
    const amount = 1;
    const name = "UPI Payment";
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;

    const timer = setTimeout(() => setShowAlert(true), 1000);

    window.location.href = upiUrl;
    window.addEventListener("pagehide", () => clearTimeout(timer));
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setShowAlert(false);
  };

  return (
    <div className="info-card upi-card">
      <button className="upi-pay-btn" onClick={payWithUPI}>
  {buttonText}
</button>

      {showAlert && (
        <div className="upi-alert-popup" ref={alertRef}>
          <div className="upi-alert-text">Use this UPI ID to pay manually</div>
          <div className="upi-alert-row">
            <span className="upi-alert-id">{upiId}</span>
            <img
              src={copyIcon}
              alt="Copy"
              className="upi-copy-icon"
              onClick={copyUPI}
            />
          </div>
        </div>
      )}
    </div>
  );
}
