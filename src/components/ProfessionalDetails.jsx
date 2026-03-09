import React from "react";

export default function ProfileProfessionalCard({
  company_name,
  year_of_experience,
  selected_skills,
  selected_certifications,
}) {
  return (
    <div className="profile-professional-card">
      
      {/* Skills */}
      {selected_skills?.length > 0 && (
        <div className="profile-card-section">
          <span className="label">Professional Areas</span>
          <p className="value">
            {selected_skills.join(", ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {year_of_experience !== undefined && (
        <div className="profile-card-section">
          <span className="label">Experience</span>
          <p className="value">{year_of_experience} Years</p>
        </div>
      )}

      {/* Certifications */}
      {selected_certifications?.length > 0 && (
        <div className="profile-card-section">
          <span className="label">Certifications & Degrees</span>
          <p className="value">
            {selected_certifications.join(", ")}
          </p>
        </div>
      )}

      {/* Company */}
      {company_name && (
        <div className="profile-card-section">
          <span className="label">Company / Business / Institute</span>
          <p className="value">{company_name}</p>
        </div>
      )}

    </div>
  );
}