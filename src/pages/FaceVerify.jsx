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
  const { activeStep, steps, currentStepIdx, holdProgress, status, reset } = useVerification(currentPose, videoRef);

  if (isModelLoading) {
    return <div className="loading-screen">Loading Face Tracking Engines...</div>;
  }

  return (
    <div className="face-verify-page">
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
    </div>
  );
}