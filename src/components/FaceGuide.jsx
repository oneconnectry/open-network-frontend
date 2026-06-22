// src/components/FaceGuide.jsx
import React from 'react';

export default function FaceGuide({ holdProgress, instruction }) {
  return (
    <div className="guide-overlay">
      <div className={`face-oval ${holdProgress > 0 ? 'holding' : ''}`}>
        <div 
          className="progress-ring" 
          style={{ height: `${holdProgress}%` }} 
        />
      </div>
      <div className="instruction-toast">
        <h3>{instruction}</h3>
      </div>
    </div>
  );
}