import { useEffect, useRef } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-900/90 to-bg-900/70 z-10" />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-dark-blue-ink-in-water-7795-large.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default BackgroundVideo;
