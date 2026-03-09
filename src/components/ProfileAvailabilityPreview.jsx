import React, { useState } from "react";

export default function ProfileAvailabilityPreview({ availability }) {

  const [showSchedule, setShowSchedule] = useState(false);

  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const currentHour = new Date().getHours();

  const todaySchedule = availability?.find(
    (item) => item.day === today
  );

  // Convert hour to AM/PM
  const formatTime = (hour) => {
    const h = Number(hour);
    const period = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:00 ${period}`;
  };

  let timing = "";
  let isAvailable = false;

  if (todaySchedule) {
    const from = Number(todaySchedule.from);
    const to = Number(todaySchedule.to);

    timing = `${formatTime(from)} - ${formatTime(to)}`;

    if (currentHour >= from && currentHour < to) {
      isAvailable = true;
    }
  }

  return (
    <div className="profile-availability-preview">

      <div className="availability-row">
        <span>Availability</span>

        {/* Fixed here */}
        <span className={isAvailable ? "available" : "not-available"}>
          {isAvailable ? "Available" : "Not Available"}
        </span>
      </div>

      {todaySchedule && (
        <p className="today-timing">
          Today · {timing}
        </p>
      )}

      <button
          className="view-schedule"
          onClick={() => setShowSchedule(!showSchedule)}
        >
        View Weekly Schedule
      </button>

      {showSchedule && (
        <div>
          {availability?.map((item, index) => {

            const from = Number(item.from);
            const to = Number(item.to);

            return (
              <div key={index} className="schedule-row">

                <span>
                  {item.day === today ? `Today (${item.day})` : item.day}
                </span>

                <span>
                  {formatTime(from)} - {formatTime(to)}
                </span>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}