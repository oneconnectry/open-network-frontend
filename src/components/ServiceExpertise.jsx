import React from "react";

export default function ServiceExpertise({ selected_skills = [], year_of_experience }) {
  if (!selected_skills.length && !year_of_experience) return null;

  return (
    <div className="service-expertise-wrapper">
      {selected_skills.length > 0 && (
        <div className="service-skills-block">
          <div className="service-skills">
            {selected_skills.map((skill, i) => (
              <span key={i} className="service-skill">
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
                {i < selected_skills.length - 1 && ","}
              </span>
            ))}
          </div>
          <b className="service-skills-title">Expertise Areas</b>
        </div>
      )}

      {year_of_experience && (
        <div className="service-experience">
          <b>{year_of_experience} Years</b>
          <span>Year Of Experience</span>
        </div>
      )}
    </div>
  );
}
