import React, { useEffect, useRef, useState } from "react";

export default function OffersSlider({ offers = [] }) {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(1);

  // 👉 check expiry
  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) <= new Date();
  };

  // 👉 expiry text helper
  const getExpiryText = (endDate) => {
    if (!endDate) return null;

    const now = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - now;

    if (diffTime <= 0) return "Expired";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeString = expiry.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (diffDays === 0) return `Expires today at ${timeString}`;
    if (diffDays === 1) return `Expires tomorrow at ${timeString}`;

    return `Expires in ${diffDays} days at ${timeString}`;
  };

  // 👉 SHOW ALL (design mode)
  const activeOffers = offers;

  // 👉 Infinite loop clones
  const loopedOffers =
    activeOffers.length > 1
      ? [
          activeOffers[activeOffers.length - 1],
          ...activeOffers,
          activeOffers[0],
        ]
      : activeOffers;

  // 👉 initial position fix
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const width = slider.clientWidth;
    slider.scrollLeft = width; // jump to first real slide
  }, []);

  // 👉 auto slide
  useEffect(() => {
    if (activeOffers.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOffers.length]);

  // 👉 move slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const width = slider.clientWidth;

    slider.style.scrollBehavior = "smooth";
    slider.scrollLeft = width * index;

    // 👉 last clone → reset
    if (index === loopedOffers.length - 1) {
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft = width;
        setIndex(1);
      }, 300);
    }

    // 👉 first clone → reset
    if (index === 0) {
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft = width * (loopedOffers.length - 2);
        setIndex(loopedOffers.length - 2);
      }, 300);
    }
  }, [index, loopedOffers.length]);

  if (!activeOffers.length) return null;

  return (
    <div className="offers-section">
      <div className="offers-slider" ref={sliderRef}>
        {loopedOffers.map((offer, i) => {
          // 👉 Badge logic
          let tagText = "LIMITED";
          let badgeClass = "";

          if (offer.end_date) {
            if (offer.discount_type === "FLAT") {
              tagText = `₹${offer.discount_value} OFF`;
              badgeClass = "green";
            } else if (offer.discount_type === "UPTO") {
              tagText = `UPTO ${offer.discount_value}`;
              badgeClass = "purple";
            } else {
              tagText = offer.tag || "SPECIAL";
            }
          }

          const expiryText = getExpiryText(offer.end_date);

          return (
            <div
              key={i}
              className={`offer-card ${
                isExpired(offer.end_date) ? "expired" : ""
              }`}
            >
              <div className={`offer-badge ${badgeClass}`}>
                {tagText}
              </div>

              <div className="offer-content">
                <h4>{offer.title}</h4>
                <p>{offer.description}</p>

                {/* 👉 expiry pill UI */}
                {offer.end_date && (
                  <div className="offer-expiry-box">
                    <span className="dot"></span>
                    <span>{expiryText}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 👉 DOTS */}
      <div className="offer-dots">
        {activeOffers.map((_, i) => (
          <span
            key={i}
            className={
              i ===
              (index - 1 + activeOffers.length) %
                activeOffers.length
                ? "active"
                : ""
            }
          />
        ))}
      </div>
    </div>
  );
}