import { useRef, useState, useEffect } from "react";
import "./DemoVideo.css";

/**
 * DemoVideo — video de demostración con autoplay silencioso, loop,
 * play/pausa al hacer clic y pausa automática fuera de pantalla.
 *
 * Uso:
 *   import DemoVideo from "./DemoVideo";
 *   import src from "./photo-stack-gallery.mp4";
 *   import poster from "./photo-stack-gallery-poster.jpg";
 *   <DemoVideo src={src} poster={poster} />
 */
export default function DemoVideo({
  src,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  aspectRatio = "1280 / 804",
  className = "",
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Respeta "reducir movimiento" y pausa cuando el video sale de pantalla
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoPlay && !reduce) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoPlay]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  return (
    <div className={`demo-video ${className}`} style={{ aspectRatio }}>
      <video
        ref={videoRef}
        className="demo-video__media"
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        controls={controls}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={controls ? undefined : toggle}
      />
      {!controls && (
        <button
          type="button"
          className={`demo-video__btn ${playing ? "is-playing" : ""}`}
          onClick={toggle}
          aria-label={playing ? "Pausar video" : "Reproducir video"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
