// src/hooks/useFaceDetection.js
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { estimatePose } from '../utils/poseUtils';

// Global reference variable held outside the hook cycle prevents double-instantiation crashes
let globalDetectorPromise = null;

async function getSharedDetector() {
  if (!globalDetectorPromise) {
    globalDetectorPromise = (async () => {
      await tf.ready();
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      return faceLandmarksDetection.createDetector(model, {
        runtime: 'mediapipe',
        refineLandmarks: false,
        maxFaces: 1,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      });
    })();
  }
  return globalDetectorPromise;
}

export function useFaceDetection(videoRef) {
  const [detector, setDetector] = useState(null);
  const [currentPose, setCurrentPose] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestRef = useRef(null);

  // Initialize Detector Safely
  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        const instance = await getSharedDetector();
        if (isMounted) {
          setDetector(instance);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load face detection model:", err);
      }
    }
    
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // Frame processing loop
  useEffect(() => {
    let active = true;

    async function detectFrame() {
      if (!detector || !videoRef.current || videoRef.current.readyState < 2) {
        if (active) requestRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      try {
        const faces = await detector.estimateFaces(videoRef.current);
        if (faces && faces.length > 0) {
          const pose = estimatePose(faces[0].keypoints);
          setCurrentPose(pose);
        } else {
          setCurrentPose(null);
        }
      } catch (err) {
        console.error("Detection runtime error:", err);
      }

      if (active) {
        requestRef.current = requestAnimationFrame(detectFrame);
      }
    }

    if (detector) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }

    return () => {
      active = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detector, videoRef]);

  return { currentPose, isModelLoading: isLoading };
}