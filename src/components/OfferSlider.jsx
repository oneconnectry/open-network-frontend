import React, { useEffect, useRef, useState } from "react";

export default function OffersSlider({ offers = [] }) {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(1);

  // 👉 check expiry
  const isExpired = (endDate) => {
    if (!endDate) return false; // no expiry = always show
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

    if (diffDays === 0) {
      return `Expires today at ${timeString}`;
    }

    if (diffDays === 1) {
      return `Expires tomorrow at ${timeString}`;
    }

    return `Expires in ${diffDays} days at ${timeString}`;
  };

  // 👉 FILTER ACTIVE OFFERS ONLY
  const activeOffers = offers.filter(
    (offer) => !isExpired(offer.end_date)
  );

  // 👉 Clone slides (infinite loop)
  const loopedOffers =
    activeOffers.length > 1
      ? [
          activeOffers[activeOffers.length - 1],
          ...activeOffers,
          activeOffers[0],
        ]
      : activeOffers;

  // 👉 Auto slide
  useEffect(() => {
    if (activeOffers.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOffers.length]);

  // 👉 Move slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const width = slider.offsetWidth;

    slider.style.scrollBehavior = "smooth";
    slider.scrollLeft = width * index;

    // 👉 last clone → reset
    if (index === loopedOffers.length - 1) {
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft = width;
        setIndex(1);
      }, 400);
    }

    // 👉 first clone → reset
    if (index === 0) {
      setTimeout(() => {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft = width * (loopedOffers.length - 2);
        setIndex(loopedOffers.length - 2);
      }, 400);
    }
  }, [index, loopedOffers.length]);

  // 👉 EMPTY STATE
  if (!activeOffers.length) return null;

  return (
    <div className="offers-section">
      <div className="offers-slider" ref={sliderRef}>
        {loopedOffers.map((offer, i) => {
          const tagText =
            offer.discount_type === "FLAT"
              ? `₹${offer.discount_value} OFF`
              : offer.tag || "SPECIAL";

          const expiryText = getExpiryText(offer.end_date);

          return (
            <div key={i} className="offer-card">
              <div className="offer-badge">{tagText}</div>

              <div className="offer-content">
                <h4>{offer.title}</h4>
                <p>{offer.description}</p>

                {/* 👉 show expiry only if exists */}
                {expiryText && (
                  <span className="offer-expiry">
                    {expiryText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 DOTS */}
      <div className="offer-dots">
        {activeOffers.map((_, i) => (
          <span
            key={i}
            className={
              i === (index - 1 + activeOffers.length) %
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