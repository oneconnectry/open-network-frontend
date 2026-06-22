// src/utils/verificationUtils.js

export function captureCanvasFrame(videoElement) {
  if (!videoElement) return null;
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function uploadVerificationPayload(payload) {
  // Simulate API Network Delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Uploading photos payload:", payload);
      resolve({ success: true, message: "Identity verified successfully!" });
    }, 2000);
  });
}