import React from "react";
import { API_BASE_URL } from "../services/apiConfig";
import defaultCover from "../assets/social/defaultCover.svg";

export default function CoverImage({ url, birthYear, gender }) {
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - birthYear : null;

  const coverSrc = url
    ? `${url}`
    : defaultCover;

  return (
    <div className="cover-section">
      <img
        className="cover-image"
        src={coverSrc}
        alt="Cover"
        onError={(e) => (e.target.src = defaultCover)}
      />

      <div className="cover-badges">
        {gender && <span className="cover-left">{gender}</span>}
        {age && <span className="cover-right">{age} Y</span>}
      </div>
    </div>
  );
}

