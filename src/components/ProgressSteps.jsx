// src/components/ProgressSteps.jsx
import React from 'react';

export default function ProgressSteps({ steps, currentStepIdx }) {
  return (
    <div className="steps-timeline">
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`step-dot ${index === currentStepIdx ? 'active' : ''} ${index < currentStepIdx ? 'completed' : ''}`}
        >
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}