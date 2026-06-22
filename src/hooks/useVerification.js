// src/hooks/useVerification.js
import { useState, useEffect, useCallback } from 'react';
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

  // Added safety fallback structure: if out of bounds, use an empty fallback object
  const activeStep = STEPS[currentStepIdx] || { id: -1, pose: null, label: 'Processing...' };

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
// src/hooks/useVerification.js

// 1. Keep handleStepCapture lightweight and focused ONLY on capturing
const handleStepCapture = useCallback(() => {
  const frame = captureCanvasFrame(videoRef.current);
  if (!frame) return;

  // Store the image using the current active step's pose name
  setCapturedImages((prev) => ({ ...prev, [activeStep.pose]: frame }));

  // Check if we are on the final step right now
  if (currentStepIdx === STEPS.length - 1) {
    // Collect the final payload structure safely
    setCapturedImages((latestImages) => {
      handleSubmit(latestImages);
      return latestImages;
    });
  } else {
    // Otherwise, increment cleanly to the next verification pose step
    setCurrentStepIdx((idx) => idx + 1);
  }
}, [activeStep.pose, currentStepIdx, videoRef, handleSubmit]);

// 2. Updated stable tracking timer engine
useEffect(() => {
  // If verification is already processing, or done, do nothing
  if (status !== 'READY') return;

  // If no face is in frame or activeStep configuration isn't ready, reset progress bar
  if (!currentPose || !activeStep || !activeStep.pose) {
    setHoldTime(0);
    return;
  }

  // Check if the current camera pose matches our exact requested direction
  if (currentPose === activeStep.pose) {
    const interval = setInterval(() => {
      setHoldTime((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleStepCapture();
          return 0;
        }
        return prev + 50; // Faster step verification (400ms holding time total)
      });
    }, 200);

    return () => clearInterval(interval);
  } else {
    // Reset back to zero if they look away or break alignment mid-timer
    setHoldTime(0);
  }
// Removed handleStepCapture from dependency to prevent infinite reset cycles
}, [currentPose, activeStep, status]);

  return {
    activeStep,
    steps: STEPS,
    currentStepIdx: Math.min(currentStepIdx, STEPS.length - 1), // Keeps progress bars from breaking
    holdProgress: holdTime,
    status,
    capturedImages,
    reset: () => {
      setCurrentStepIdx(0);
      setCapturedImages({});
      setStatus('READY');
      setHoldTime(0);
    }
  };
}