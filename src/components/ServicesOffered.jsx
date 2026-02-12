import React from "react";

export default function ServicesOffered({ services }) {
  if (!services) return null;

  // ✅ Normalize services into array
  let list = [];

  if (Array.isArray(services)) {
    list = services;
  } else if (typeof services === "object") {
    list = Object.values(services);
  } else if (typeof services === "string") {
    list = services.split(",").map(s => s.trim());
  }

  if (list.length === 0) return null;

  return (
    <div className="services-card">
      <h3 className="services-title">Services Offered</h3>

      <ul className="services-list">
        {list.map((service, index) => (
          <li key={index} className="services-item">
            {typeof service === "object" ? service.name || JSON.stringify(service) : service}
          </li>
        ))}
      </ul>
    </div>
  );
}
