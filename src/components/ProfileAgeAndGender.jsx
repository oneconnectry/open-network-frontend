import React from "react";
import { API_BASE_URL } from "../services/apiConfig";
import CallChatButtons from "./CallChatButtons";
import UPIPaymentButton from "./UPIPaymentButton";

export default function ProfileAgeAndGender({
  name,
  namelocation,
  bio,
  tagline, 
  profileUrl,
   phone,
  upiId,
  showPayButton = false, 

}) {
  return (
    <>
      <div className="profile-info">
        <img
          className="profile-image-avatar"
          src={profileUrl ? `${API_BASE_URL}${profileUrl}` : "/default-avatar.png"}
          alt={name}
        />

        <div className="profile-text">
          <h2>{name}</h2>

          {tagline && (
            <p className="professional-tagline">
              {tagline}
            </p>
          )}

          {namelocation && (
            <span className="profile-location">
              📍{namelocation}
            </span>

          )}

          <div className="profile-action-buttons professionals-buttons">
  
  <div className="btn-item professional-call">
    <CallChatButtons phone={phone} />
  </div>

  {showPayButton && (
    <div className="btn-item professional-pay">
      <UPIPaymentButton upiId={upiId} buttonText="Pay" />
    </div>
  )}

</div>
          
        </div>
      </div>

      {bio && (
        <div className="bio-card">
        {bio}
        </div>
      )}
    </>
  );
}