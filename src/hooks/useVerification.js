// src/hooks/useVerification.js

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { DETECTED_POSES } from "../utils/poseUtils";
import {
  captureCanvasFrame,
  uploadVerificationPayload,
} from "../utils/verificationUtils";

const STEPS = [
  { id: 0, pose: DETECTED_POSES.STRAIGHT, label: "Look Straight" },
  { id: 1, pose: DETECTED_POSES.LEFT, label: "Turn Head Left" },
  { id: 2, pose: DETECTED_POSES.RIGHT, label: "Turn Head Right" },
  { id: 3, pose: DETECTED_POSES.UP, label: "Look Up" },
  { id: 4, pose: DETECTED_POSES.DOWN, label: "Look Down" },
];

export function useVerification(currentPose, videoRef) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [capturedImages, setCapturedImages] = useState({});
  const [status, setStatus] = useState("READY");
  const [holdTime, setHoldTime] = useState(0);
  const [isReadyForInput, setIsReadyForInput] = useState(false);

  // Prevent duplicate captures
  const captureLock = useRef(false);

  const activeStep = useMemo(() => {
    return (
      STEPS[currentStepIdx] || {
        id: -1,
        pose: null,
        label: "Processing...",
      }
    );
  }, [currentStepIdx]);

  const handleSubmit = useCallback(async (images) => {
    setStatus("PROCESSING");

    try {
      const result = await uploadVerificationPayload(images);

      if (result.success) {
        setStatus("SUCCESS");
      } else {
        setStatus("FAILED");
      }
    } catch {
      setStatus("FAILED");
    }
  }, []);

  const handleStepCapture = useCallback(() => {
    if (captureLock.current) return;

    captureLock.current = true;

    const frame = captureCanvasFrame(videoRef.current);

    if (!frame || !activeStep.pose) {
      captureLock.current = false;
      return;
    }

    setIsReadyForInput(false);
    setHoldTime(0);

    const updatedImages = {
      ...capturedImages,
      [activeStep.pose]: frame,
    };

    setCapturedImages(updatedImages);

    if (currentStepIdx === STEPS.length - 1) {
      handleSubmit(updatedImages);
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }

    setTimeout(() => {
      captureLock.current = false;
    }, 500);
  }, [
    activeStep,
    capturedImages,
    currentStepIdx,
    handleSubmit,
    videoRef,
  ]);

  // Wait before asking for next pose
  useEffect(() => {


    const timer = setTimeout(() => {
      setIsReadyForInput(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStepIdx]);

  // Hold timer
  useEffect(() => {
    if (
      status !== "READY" ||
      !isReadyForInput ||
      !activeStep.pose ||
      captureLock.current
    ) {
      return;
    }

    const interval = setInterval(() => {
      setHoldTime((prev) => {
        const matching = currentPose === activeStep.pose;

        if (!matching) {
          return 0;
        }

        const next = prev + 25;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            handleStepCapture();
          }, 0);

          return 0;
        }

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [
    currentPose,
    activeStep,
    status,
    isReadyForInput,
    handleStepCapture,
  ]);

  const reset = () => {
    captureLock.current = false;
    setCurrentStepIdx(0);
    setCapturedImages({});
    setStatus("READY");
    setHoldTime(0);
    setIsReadyForInput(false);
  };

  return {
    activeStep: isReadyForInput
      ? activeStep
      : {
          ...activeStep,
          label: `Get Ready... ${activeStep.label}`,
        },

    steps: STEPS,
    currentStepIdx: Math.min(currentStepIdx, STEPS.length - 1),
    holdProgress: holdTime,
    status,
    capturedImages,
    reset,
  };
}