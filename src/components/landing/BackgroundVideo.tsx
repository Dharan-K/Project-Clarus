import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

const FADE_MS = 500;

/**
 * Full-bleed looping background video with a JS-controlled fade loop:
 * 0.5s fade-in at the start, 0.5s fade-out at the end, then a brief pause
 * before replaying from 0. Mirrors the MotionSites hero behaviour.
 */
export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      if (!video.duration) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = video.currentTime;
      const d = video.duration;
      const fade = FADE_MS / 1000;

      let opacity = 1;
      if (t < fade) {
        opacity = t / fade; // fade in
      } else if (t > d - fade) {
        opacity = Math.max(0, (d - t) / fade); // fade out
      }
      video.style.opacity = String(opacity);
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play().catch(() => {});
      }, 100);
    };

    video.style.opacity = "0";
    void video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(tick);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0 }}
      muted
      playsInline
      preload="auto"
      src={VIDEO_URL}
    />
  );
}
