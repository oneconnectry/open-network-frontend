import React from "react";
import { API_BASE_URL } from "../services/apiConfig";

export default function GalleryImages({ gallery_images }) {
  if (!Array.isArray(gallery_images) || gallery_images.length === 0) return null;

  return (
    <div className="gallery-section">
      {gallery_images.map((img, index) => {
        const src = encodeURI(`${API_BASE_URL.replace(/\/$/, "")}${img.url}`);

        return (
          <div key={index} className="gallery-item">
            <img
              className="gallery-image"
              src={src}
              alt={img.name || `Gallery ${index + 1}`}
              onError={(e) => {
                console.log("❌ Image failed:", src);
                e.target.style.display = "none";
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
