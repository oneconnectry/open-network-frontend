// src/pages/FaceVerify.jsx
import React, { useRef } from 'react';
import CameraView from '../components/CameraView';
import FaceGuide from '../components/FaceGuide';
import Countdown from '../components/Countdown';
import ProgressSteps from '../components/ProgressSteps';
import StatusBar from '../components/StatusBar';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useVerification } from '../hooks/useVerification';
import '../styles/pages/FaceVerify.css';

export default function FaceVerify() {
  const videoRef = useRef(null);
  const { currentPose, isModelLoading } = useFaceDetection(videoRef);
  
  // Destructured capturedImages so the test panel can map over the captured photos
  const { 
    activeStep, 
    steps, 
    currentStepIdx, 
    holdProgress, 
    status, 
    capturedImages, 
    reset 
  } = useVerification(currentPose, videoRef);

  if (isModelLoading) {
    return <div className="loading-screen">Loading Face Tracking Engines...</div>;
  }

  return (
    <div className="face-verify-page" style={{ position: 'relative' }}>
      <h2>Biometric Identity Liveness Check</h2>
      
      <div className="interface-wrapper">
        <CameraView videoRef={videoRef} />
        
        {status === 'READY' && (
          <FaceGuide 
            holdProgress={holdProgress} 
            instruction={activeStep.label} 
          />
        )}
      </div>

      <Countdown progress={holdProgress} />
      
      <ProgressSteps steps={steps} currentStepIdx={currentStepIdx} />
      
      <StatusBar currentPose={currentPose} status={status} onReset={reset} />

      {/* ========================================================= */}
      {/* DIAGNOSTIC TEST PANEL OVERLAY (DELETE BEFORE PRODUCTION) */}
      {/* ========================================================= */}
      {Object.keys(capturedImages).length > 0 && (
        <div className="test-panel-overlay">
          <h5 className="test-panel-title">🔬 Test Snaps</h5>
          {Object.entries(capturedImages).map(([pose, base64Data]) => (
            <div key={pose} className="test-panel-card">
              <div className="test-panel-badge">{pose}</div>
              <img src={base64Data} alt={pose} className="test-panel-img" />
            </div>
          ))}
        </div>
      )}
      {/* ========================================================= */}
    </div>
  );
}