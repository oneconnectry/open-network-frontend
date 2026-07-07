import React from "react";
import { API_BASE_URL } from "../services/apiConfig";

export default function ProfileImage({ url }) {
  if (!url) return null;

  return (
    <div className="profile-image">
      <img
        src={url}
        alt="Profile"
      />
    </div>
  );
}
