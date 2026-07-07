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
  selected_skills,
  birth_year,
  showPayButton = false,
}) {

  // calculate experience
  const currentYear = new Date().getFullYear();
  const experience = birth_year ? currentYear - birth_year : null;

  return (
    <>
      <div className="profile-info">
        <img
          className="profile-image-avatar"
          src={profileUrl ? `${profileUrl}` : "/default-avatar.png"}
          alt={name}
        />

        <div className="profile-text">
          <h2>{name}</h2>

          {tagline && (
            <p className="professional-tagline">
              {tagline}
            </p>
          )}

          {/* Business Skills */}
          {selected_skills?.length > 0 && (
            <div className="business-skill-badges">
              {selected_skills.map((skill, index) => (
                <span key={index} className="business-skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Location */}
          {namelocation && (
            <span className="profile-location">
              📍 {namelocation}
            </span>
          )}

          {/* Experience Card */}
          {birth_year && (
            <div className="experience-card">
              <div className="since-year">Since {birth_year}</div>
              <small className="experience-text">
                {experience}+ Years Experience
              </small>
            </div>
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