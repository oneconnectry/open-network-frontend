// components/SelectedLanguages.jsx
import React from "react";

export default function SelectedLanguages({ languages }) {
  if (!languages || languages.length === 0) return null;

  return (
    <div className="profile-languages-card">
      <h3 className="profile-languages-title">Languages</h3>

      <div className="profile-languages-list">
        {languages.map((lang, i) => (
          <span key={i} className="profile-language-badge">
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}
