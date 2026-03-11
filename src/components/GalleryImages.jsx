import React, { useState } from "react";
import { API_BASE_URL } from "../services/apiConfig";

export default function GalleryImages({ gallery_images }) {

  const [images, setImages] = useState(gallery_images || []);

  if (!Array.isArray(images) || images.length === 0) return null;

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="gallery-section">
      {images.map((img, index) => {
        const src = encodeURI(`${API_BASE_URL.replace(/\/$/, "")}${img.url}`);

        return (
          <div key={index} className="gallery-item">
            <img
              className="gallery-image"
              src={src}
              alt={img.name || `Gallery ${index + 1}`}
              onError={() => {
                console.log("❌ Image failed:", src);
                removeImage(index);   // remove broken image
              }}
            />
          </div>
        );
      })}
    </div>
  );
}