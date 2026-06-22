// src/components/Countdown.jsx
import React from 'react';

export default function Countdown({ progress }) {
  if (progress === 0) return null;
  return (
    <div className="countdown-bar">
      <div className="countdown-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}