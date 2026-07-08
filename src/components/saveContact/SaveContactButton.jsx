import React from "react";
import "./saveContact.css";
import { saveContact } from "./SaveContactUtils";

export default function SaveContactButton({ user, hidden }) {
  if (hidden) return null; // hide when ShareContact modal opens

  const handleSave = () => {
    // 1. Mobile Haptic Feedback (Vibrates slightly on Android)
    // We check if 'navigator' exists to prevent errors in SSR (like Next.js)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }

    // 2. Execute your save logic
    saveContact(user);
  };

  return (
    <button 
      className="save-contact-btn" 
      onClick={handleSave}
      /* Wakes up the CSS :active state on iOS devices */
      onTouchStart={() => {}} 
    >
      Save Contact
    </button>
  );
}