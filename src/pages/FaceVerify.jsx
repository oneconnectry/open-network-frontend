// src/pages/FaceVerify.jsx

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

import CameraView from "../components/CameraView";
import FaceGuide from "../components/FaceGuide";
import Countdown from "../components/Countdown";
import ProgressSteps from "../components/ProgressSteps";
import StatusBar from "../components/StatusBar";

import { useFaceDetection } from "../hooks/useFaceDetection";
import { useVerification } from "../hooks/useVerification";

import "../styles/pages/FaceVerify.css";

export default function FaceVerify() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [doc1, setDoc1] = useState(null);
  const [doc2, setDoc2] = useState(null);

  const { currentPose, isModelLoading } =
    useFaceDetection(videoRef);

  const {
    activeStep,
    steps,
    currentStepIdx,
    holdProgress,
    status,
    capturedImages,
    reset,
    submitVerification,
  } = useVerification(currentPose, videoRef);

  const stopCamera = useCallback(() => {
    const video = videoRef.current;

    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => {
        track.stop();
      });

      video.srcObject = null;
    }
  }, []);

  // Stop camera on page leave
  useEffect(() => {
    const handlePageHide = () => {
      stopCamera();
    };

    window.addEventListener(
      "pagehide",
      handlePageHide
    );
    window.addEventListener(
      "beforeunload",
      handlePageHide
    );

    return () => {
      stopCamera();

      window.removeEventListener(
        "pagehide",
        handlePageHide
      );

      window.removeEventListener(
        "beforeunload",
        handlePageHide
      );
    };
  }, [stopCamera]);

  // Stop camera after all poses are captured
  useEffect(() => {
    if (status === "COMPLETED") {
      stopCamera();
    }
  }, [status, stopCamera]);

  const handleBack = () => {
    stopCamera();
    navigate(-1);
  };

  if (isModelLoading) {
    return (
      <div className="loading-screen">
        Loading Face Tracking Engines...
      </div>
    );
  }

  return (
    <div
      className="face-verify-page"
      style={{ position: "relative" }}
    >
      <h2>Biometric Identity Liveness Check</h2>

      <button
        className="back-btn"
        onClick={handleBack}
      >
        ← Back
      </button>

      <div className="interface-wrapper">
        <CameraView videoRef={videoRef} />

        {status === "READY" && (
          <FaceGuide
            holdProgress={holdProgress}
            instruction={activeStep.label}
          />
        )}
      </div>

      {Object.keys(capturedImages).length > 0 && (
        <div className="capture-gallery">
          <h4 className="capture-gallery-title">
            Captured Verification Photos
          </h4>

          <div className="capture-gallery-list">
            {Object.entries(capturedImages).map(
              ([pose, base64Data]) => (
                <div
                  key={pose}
                  className="capture-card"
                >
                  <img
                    src={base64Data}
                    alt={pose}
                    className="capture-image"
                  />

                  <span className="capture-label">
                    {pose
                      .replace(/_/g, " ")
                      .replace(
                        /\b\w/g,
                        (c) => c.toUpperCase()
                      )}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <Countdown progress={holdProgress} />

      <ProgressSteps
        steps={steps}
        currentStepIdx={currentStepIdx}
      />

      <StatusBar
        currentPose={currentPose}
        status={status}
        onReset={reset}
      />

      {status === "COMPLETED" && (
        <div className="verification-complete">
          <h3>Face Verification Completed</h3>

          <div className="document-upload">
            <div className="doc-card">
              <select defaultValue="">
                <option value="" disabled>
                  Select Document 1
                </option>
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>Voter ID</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setDoc1(e.target.files[0])
                }
              />
            </div>

            <div className="doc-card">
              <select defaultValue="">
                <option value="" disabled>
                  Select Document 2
                </option>
                <option>Aadhaar Card</option>
                <option>PAN Card</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>Voter ID</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setDoc2(e.target.files[0])
                }
              />
            </div>
          </div>

          <button
            className="verify-btn"
            disabled={!doc1 || !doc2}
            onClick={async () => {
              const success =
                await submitVerification(
                  doc1,
                  doc2
                );

              if (success) {
                navigate(
                  "/verification-success"
                );
              }
            }}
          >
            Verify & Continue
          </button>
        </div>
      )}
    </div>
  );
}