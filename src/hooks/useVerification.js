// src/hooks/useVerification.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DETECTED_POSES } from '../utils/poseUtils';
import { captureCanvasFrame, uploadVerificationPayload } from '../utils/verificationUtils';

const STEPS = [
  { id: 0, pose: DETECTED_POSES.STRAIGHT, label: 'Look Straight' },
  { id: 1, pose: DETECTED_POSES.LEFT, label: 'Turn Head Left' },
  { id: 2, pose: DETECTED_POSES.RIGHT, label: 'Turn Head Right' },
  { id: 3, pose: DETECTED_POSES.UP, label: 'Look Up' },
  { id: 4, pose: DETECTED_POSES.DOWN, label: 'Look Down' },
];

export function useVerification(currentPose, videoRef) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [capturedImages, setCapturedImages] = useState({});
  const [status, setStatus] = useState('READY'); // READY, PROCESSING, SUCCESS, FAILED
  const [holdTime, setHoldTime] = useState(0); // Tracks stable pose duration
  
  // Strict gate: Pauses detection for a split second between steps to prevent auto-skipping
  const [isReadyForInput, setIsReadyForInput] = useState(false);

  // Wrapped in useMemo to maintain a stable reference across renders
  const activeStep = useMemo(() => {
    return STEPS[currentStepIdx] || { id: -1, pose: null, label: 'Processing...' };
  }, [currentStepIdx]);

  const handleSubmit = useCallback(async (images) => {
    setStatus('PROCESSING');
    try {
      const result = await uploadVerificationPayload(images);
      if (result.success) setStatus('SUCCESS');
      else setStatus('FAILED');
    } catch {
      setStatus('FAILED');
    }
  }, []);

  const handleStepCapture = useCallback(() => {
    const frame = captureCanvasFrame(videoRef.current);
    if (!frame || !activeStep.pose) return;

    // 1. Lock the gate immediately so no other poses can pass through
    setIsReadyForInput(false);
    
    // 2. FIX: Reset the progress bar right here inside the action handler, NOT in an effect!
    setHoldTime(0);

    setCapturedImages((prevImages) => {
      const updatedImages = { ...prevImages, [activeStep.pose]: frame };
      
      setCurrentStepIdx((prevIdx) => {
        if (prevIdx === STEPS.length - 1) {
          handleSubmit(updatedImages);
          return prevIdx;
        }
        return prevIdx + 1;
      });

      return updatedImages;
    });
  }, [activeStep, handleSubmit, videoRef]);

  // Transition Grace Period Loop
  useEffect(() => {
    const transitionalTimer = setTimeout(() => {
      setIsReadyForInput(true);
    }, 1500);

    return () => clearTimeout(transitionalTimer);
  }, [currentStepIdx]);

  // Stable Tracking Timer Engine
  useEffect(() => {
    if (status !== 'READY' || !isReadyForInput || !activeStep.pose) return;

    const isPoseMatching = currentPose === activeStep.pose;

    const interval = setInterval(() => {
      setHoldTime((prev) => {
        if (!isPoseMatching) {
          return 0; 
        }
        if (prev >= 100) {
          clearInterval(interval);
          handleStepCapture();
          return 0;
        }
        return prev + 25; // 800ms total holding window
      });
    }, 200);

    return () => clearInterval(interval);
  }, [currentPose, activeStep, status, isReadyForInput, handleStepCapture]);

  return {
    activeStep: isReadyForInput 
      ? activeStep 
      : { ...activeStep, label: `Get Ready... ${activeStep.label}` },
    steps: STEPS,
    currentStepIdx: Math.min(currentStepIdx, STEPS.length - 1),
    holdProgress: holdTime,
    status,
    capturedImages,
    reset: () => {
      setCurrentStepIdx(0);
      setCapturedImages({});
      setStatus('READY');
      setHoldTime(0);
      setIsReadyForInput(false);
    }
  };
}