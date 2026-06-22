// src/components/StatusBar.jsx
import React from 'react';

export default function StatusBar({ currentPose, status, onReset }) {
  return (
    <div className="status-bar">
      <p>Detected Direction: <strong>{currentPose || "No face detected"}</strong></p>
      {status === 'PROCESSING' && <p className="loading-txt">Processing Verification... Please Wait.</p>}
      {status === 'SUCCESS' && (
        <div className="alert success">
          🎉 Verification Complete! <button onClick={onReset}>Retry</button>
        </div>
      )}
      {status === 'FAILED' && (
        <div className="alert error">
          ❌ Verification Failed. <button onClick={onReset}>Try Again</button>
        </div>
      )}
    </div>
  );
}