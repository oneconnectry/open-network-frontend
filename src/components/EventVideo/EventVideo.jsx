import React, { useEffect, useRef, useState } from "react";
import "./EventVideo.css";
import VideoPlayer from "./VideoPlayer";

export default function EventVideo({ eventVideo }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [orientation, setOrientation] = useState("landscape");
  const [rotated, setRotated] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(
        document.fullscreenElement
      );

      setFullscreen(isFullscreen);

      if (!isFullscreen) {
        setRotated(false);
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Video play error:", error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const toggleRotate = () => {
    setRotated((previous) => !previous);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(video.duration);
    setCurrentTime(0);
    setProgress(0);

    if (video.videoWidth > video.videoHeight) {
      setOrientation("landscape");
    } else if (video.videoHeight > video.videoWidth) {
      setOrientation("portrait");
    } else {
      setOrientation("square");
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const currentProgress =
      (video.currentTime / video.duration) * 100;

    setProgress(currentProgress);
    setCurrentTime(video.currentTime);
  };

  const handleSeek = (event) => {
    const newTime = Number(event.target.value);

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }

    setCurrentTime(newTime);
  };

  if (!eventVideo?.video_url) {
    return null;
  }

  return (
    <section className="event-video-section">
      <div
        ref={containerRef}
        className={`event-video-container ${
          fullscreen ? "is-fullscreen" : ""
        } ${orientation} ${
          rotated ? "is-rotated" : ""
        }`}
      >
        <VideoPlayer
          ref={videoRef}
          src={eventVideo.video_url}
          poster={eventVideo.thumbnail_url}
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* Center Play Button */}

        {!playing && (
          <button
            className="video-center-play"
            onClick={togglePlay}
            aria-label="Play video"
          >
            ▶
          </button>
        )}

        {/* Before Playing - Only Duration */}

        {!fullscreen && !playing && (
          <span className="video-duration">
            {formatTime(duration)}
          </span>
        )}

        {/* Normal Mode - Fullscreen Button Top Right */}

        {!fullscreen && playing && (
          <button
            className="video-normal-fullscreen-btn video-icon-btn"
            onClick={toggleFullscreen}
            aria-label="Enter fullscreen"
          >
            ⛶
          </button>
        )}

        {/* Normal Mode - Mute Button Bottom Right */}

        {!fullscreen && playing && (
          <button
            className="video-normal-mute-btn video-icon-btn"
            onClick={toggleMute}
            aria-label={
              muted
                ? "Unmute video"
                : "Mute video"
            }
          >
            {muted ? "🔇" : "🔊"}
          </button>
        )}

        {/* Fullscreen - Close Button Top Left */}

        {/* Fullscreen - Close Button Top Left */}

{fullscreen && (
  <button
    className="video-fullscreen-close video-icon-btn"
    onClick={toggleFullscreen}
    aria-label="Exit fullscreen"
  >
    ✕
  </button>
)}

{/* Fullscreen - Rotate Button Top Right */}

{fullscreen && (
  <button
    className="video-fullscreen-rotate video-icon-btn"
    onClick={toggleRotate}
    aria-label="Rotate video"
  >
    ↻
  </button>
)}

{/* Fullscreen - Mute Button Bottom Right */}

{fullscreen && (
  <button
    className="video-fullscreen-mute video-icon-btn"
    onClick={toggleMute}
    aria-label={
      muted
        ? "Unmute video"
        : "Mute video"
    }
  >
    {muted ? "🔇" : "🔊"}
  </button>
)}

        {/* Normal Mode - Instagram Progress */}

        {!fullscreen && playing && (
          <div className="video-normal-progress">
            <div
              className="video-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        )}

        {/* Fullscreen Mode - Seek Bar */}

        {fullscreen && (
          <div className="video-fullscreen-progress">
            <span className="video-time">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              className="video-seek-bar"
              onChange={handleSeek}
            />

            <span className="video-time">
              {formatTime(duration)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}