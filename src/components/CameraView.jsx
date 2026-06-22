// src/components/CameraView.jsx
import React, { useEffect } from 'react';

export default function CameraView({ videoRef }) {
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Please enable camera access to verify identity.");
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
    </div>
  );
}