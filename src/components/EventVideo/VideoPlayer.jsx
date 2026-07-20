import React, { forwardRef } from "react";

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    src,
    poster,
    onClick,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
  },
  ref
) {
  return (
    <video
      ref={ref}
      className="event-video"
      src={src}
      poster={poster}
      playsInline
      preload="metadata"
      controls={false}
      onClick={onClick}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
    />
  );
});

export default VideoPlayer;