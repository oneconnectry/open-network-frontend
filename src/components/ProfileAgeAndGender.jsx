import React from "react";
import { API_BASE_URL } from "../services/apiConfig";

export default function ProfileAgeAndGender({
  name,
  namelocation,
  bio,
  tagline, 
  profileUrl,

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