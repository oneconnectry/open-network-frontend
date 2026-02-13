import React, { useState, useEffect, useRef, useCallback } from "react";
import CaptureIcon from "../assets/social/facebook.svg";
import SwitchIcon from "../assets/social/facebook.svg";
import useSendVisitorMessage from "./submitContact";



export default function ShareContact({ userId, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  const contentRef = useRef(null);
const [showScrollHint, setShowScrollHint] = useState(false);

const { sendMessage, loading } = useSendVisitorMessage();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);


  useEffect(() => {
  if (!isOpen) return;

  const timer = setTimeout(() => {
    const el = contentRef.current;
    if (!el) return;

    setShowScrollHint(el.scrollHeight > el.clientHeight + 5);
  }, 120);

  return () => clearTimeout(timer);
}, [isOpen, cameraActive, photoPreview]);

const handleScroll = () => {
  const el = contentRef.current;
  if (!el) return;

  if (el.scrollTop > 10) {
    setShowScrollHint(false);
  }
};

  // Stop camera completely
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start camera safely
  const startCamera = useCallback(async () => {
    try {
      stopCamera(); // stop any previous stream first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        const playPromise = videoRef.current.play();
        playPromise?.catch(() => {});
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied or not supported.");
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setPhotoBlob(blob);
        setPhotoPreview(URL.createObjectURL(blob));
        stopCamera(); // stop camera after taking photo
        setCameraActive(false);
      }
    }, "image/jpeg", 0.95);
  };

  // Switch camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Restart camera when facingMode changes
  useEffect(() => {
    if (!cameraActive) return;
    const run = async () => {
      stopCamera();
      await startCamera();
    };
    run();
  }, [facingMode, cameraActive, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await sendMessage({
    profileUserId: userId,
    visitorName: name,
    visitorPhone: phone,
    visitorEmail: email,
    message: note,
    photo: photoBlob,
  });

  if (!result) return;

  stopCamera();
  setCameraActive(false);
  setPhotoPreview(null);
  setPhotoBlob(null);
  setIsOpen(false);
  onToggle?.(false);

  setName("");
  setPhone("");
  setPhone("");
  setEmail("");
  setNote("");
  setSubmitted(true);
};


  // Auto-hide success message
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 5000);
    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <div className="share-contact-wrapper">
      <button
  className="share-contact-float"
  
  onClick={() => {
    setIsOpen(true);
    onToggle?.(true);
  }}
>
  
  Share your Contact
</button>




      {isOpen && (
        <div className="share-contact-modal">
          <div
            className="share-contact-content"
            ref={contentRef}
            onScroll={handleScroll}
          >
            

            <h3 className="share-contact-heading">Share Your Contact</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={600}
              />
              

              {/* Activate camera */}
              {!cameraActive && !photoPreview && (
                <button
                  type="button"
                  className="camera-btn"
                  onClick={startCamera}
                >
                  📸 Capture Live Photo
                </button>
              )}

              {/* Live camera feed */}
              {cameraActive && !photoPreview && (
                <div style={{ marginBottom: "12px"}}>
                  <video
                    ref={videoRef}
                    style={{ width: "100%", borderRadius: "10px" }}
                    autoPlay
                    muted
                    playsInline
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      className="camera-btn"
                      onClick={capturePhoto}
                      style={{ flex: 1 }}
                    >
                      📸 Take Photo
                    </button>
                    <button
                      type="button"
                      className="camera-btn"
                      onClick={switchCamera}
                      style={{ flex: 1 }}
                    >
                      🔄 Switch Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Photo preview */}
              {photoPreview && (
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <img
                    src={photoPreview}
                    alt="Captured"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="camera-btn"
                    onClick={async () => {
                      // Reset previous photo
                      setPhotoPreview(null);
                      setPhotoBlob(null);

                      // Start camera fresh
                      await startCamera();
                    }}
                  >
                    🔄 Retake
                  </button>
                </div>
              )}

              <canvas ref={canvasRef} hidden />
            
              <div className="modal-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    stopCamera();
                    setCameraActive(false);
                    setPhotoPreview(null);
                    setPhotoBlob(null);
                    setIsOpen(false);
                    onToggle?.(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            {showScrollHint && (
              <div className="scroll-indicator">
                <div className="scroll-arrows">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {submitted && (
        <div className="success-message">
          Contact shared successfully!
        </div>
      )}
    </div>
  );
}
