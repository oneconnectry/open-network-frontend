import React from "react";

export default function ProfileServices({ services }) {

  if (!services) return null;

  // split by new line
  const servicesList = services.split("\n").filter(item => item.trim() !== "");

  return (
    <div className="profile-services-card">

      <h3 className="services-heading">Services Offered</h3>

      {servicesList.map((service, index) => (
        <div key={index} className="service-item">
          {service.trim()}
        </div>
      ))}

    </div>
  );
}