// src/utils/poseUtils.js

export const DETECTED_POSES = {
  STRAIGHT: 'STRAIGHT',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
};

/**
 * Basic heuristic to detect head pose from 3D/2D facial landmarks.
 * Works by measuring distances between the nose tip and outer boundary points.
 */
export function estimatePose(keypoints) {
  if (!keypoints || keypoints.length < 468) return null;

  // Key MediaPipe Face Mesh indices
  const noseTip = keypoints[1];
  const leftEyeOuter = keypoints[33];
  const rightEyeOuter = keypoints[263];
  const forehead = keypoints[10];
  const chin = keypoints[152];

  // Calculate horizontal symmetry (Yaw - Left/Right)
  const distToLeft = Math.abs(noseTip.x - leftEyeOuter.x);
  const distToRight = Math.abs(noseTip.x - rightEyeOuter.x);
  const yawRatio = distToLeft / distToRight;

  // Calculate vertical symmetry (Pitch - Up/Down)
  const distToForehead = Math.abs(noseTip.y - forehead.y);
  const distToChin = Math.abs(noseTip.y - chin.y);
  const pitchRatio = distToForehead / distToChin;

  // Thresholds for detection (tweak based on testing)
  if (yawRatio < 0.6) return DETECTED_POSES.RIGHT;
  if (yawRatio > 1.6) return DETECTED_POSES.LEFT;
  if (pitchRatio < 0.6) return DETECTED_POSES.UP;
  if (pitchRatio > 1.5) return DETECTED_POSES.DOWN;

  return DETECTED_POSES.STRAIGHT;
}