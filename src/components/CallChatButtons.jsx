import React from "react";

export default function CallChatButtons({ phone }) {
  if (!phone) return null;

  const cleanNumber = phone.replace(/\D/g, "");

  return (
    <div className="call-chat-wrapper">
      <a href={`tel:${cleanNumber}`} className="call-btn">
         Call
      </a>
    </div>
  );
}
