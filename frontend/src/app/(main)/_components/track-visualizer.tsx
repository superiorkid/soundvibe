"use client";

import { useAudio } from "@/context/audio-context";
import { formatTime } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface TrackVisualizerProps {
  audio: TAudio;
  height?: number;
  barWidth?: number;
  barGap?: number;
  cursorColor?: string;
  waveColor?: string | CanvasGradient;
  progressColor?: string | CanvasGradient;
  hoverOverlayColor?: string;
}

const createDefaultGradient = (
  ctx: CanvasRenderingContext2D,
  height: number
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height * 1.35);
  gradient.addColorStop(0, "#656666");
  gradient.addColorStop((height * 0.7) / height, "#656666");
  gradient.addColorStop((height * 0.7 + 1) / height, "#ffffff");
  gradient.addColorStop((height * 0.7 + 2) / height, "#ffffff");
  gradient.addColorStop((height * 0.7 + 3) / height, "#B1B1B1");
  gradient.addColorStop(1, "#B1B1B1");
  return gradient;
};

const createDefaultProgressGradient = (
  ctx: CanvasRenderingContext2D,
  height: number
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height * 1.35);
  gradient.addColorStop(0, "#EE772F");
  gradient.addColorStop((height * 0.7) / height, "#EB4926");
  gradient.addColorStop((height * 0.7 + 1) / height, "#ffffff");
  gradient.addColorStop((height * 0.7 + 2) / height, "#ffffff");
  gradient.addColorStop((height * 0.7 + 3) / height, "#F6B094");
  gradient.addColorStop(1, "#F6B094");
  return gradient;
};

const TrackVisualizer = ({
  audio,
  height = 50,
  barWidth = 2,
  barGap = 1.3,
  cursorColor = "#f43f5e",
  waveColor,
  progressColor,
  hoverOverlayColor = "rgba(255,255,255,0.5)",
}: TrackVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const {
    audioRef,
    currentTrack,
    playTrack,
    setCurrentTime: setGlobalCurrentTime,
  } = useAudio();

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const gradientColors = useMemo(() => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return { wave: "#666", progress: "#f43f5e" };

    const defaultWave = createDefaultGradient(ctx, height);
    const defaultProgress = createDefaultProgressGradient(ctx, height);

    return {
      wave: waveColor || defaultWave,
      progress: progressColor || defaultProgress,
    };
  }, [height, waveColor, progressColor]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: gradientColors.wave,
      progressColor: gradientColors.progress,
      height,
      barWidth,
      barGap,
      cursorColor,
      normalize: true,
      interact: true,
      backend: "WebAudio",
      hideScrollbar: true,
      fetchParams: { credentials: "include" },
    });

    wavesurferRef.current = ws;
    setLoading(true);

    if (audio.streamUrl) {
      ws.load(`${process.env.NEXT_PUBLIC_BACKEND_URL}${audio.streamUrl}`);
    }

    ws.on("ready", () => {
      setDuration(ws.getDuration());
      setLoading(false);
    });

    ws.on("error", (error: Error) => {
      // Ignore AbortError since it's expected on destroy
      if (error?.name === "AbortError") return;
      console.error("WaveSurfer error:", error);
      setLoading(false);
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [
    audio.streamUrl,
    audio.id,
    gradientColors,
    height,
    barWidth,
    barGap,
    cursorColor,
  ]);

  useEffect(() => {
    if (!wavesurferRef.current || !audioRef.current) return;
    const audioEl = audioRef.current;

    let frameId: number;

    const update = () => {
      if (currentTrack?.id === audio.id) {
        const progress = audioEl.currentTime / (audioEl.duration || 1);
        setCurrentTime(audioEl.currentTime);
        setGlobalCurrentTime(audioEl.currentTime);
        wavesurferRef.current?.seekTo(progress);
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    const handleEnded = () => {
      setCurrentTime(0);
      setGlobalCurrentTime(0);
      wavesurferRef.current?.seekTo(0);
    };

    audioEl.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(frameId);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [audio.id, audioRef, currentTrack, setGlobalCurrentTime]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const handleInteraction = () => {
      const currentTime = ws.getCurrentTime();
      if (currentTrack?.id === audio.id) {
        if (audioRef.current) {
          audioRef.current.currentTime = currentTime;
        }
      } else {
        playTrack(audio, currentTime);
      }
    };

    ws.on("interaction", handleInteraction);
    return () => ws.un("interaction", handleInteraction);
  }, [audio, audioRef, currentTrack, playTrack]);

  useEffect(() => {
    if (!hoverRef.current || !containerRef.current) return;

    const hoverEl = hoverRef.current;
    const container = containerRef.current;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      hoverEl.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
      hoverEl.style.opacity = "1";
    };

    const handlePointerLeave = () => {
      hoverEl.style.opacity = "0";
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className="relative select-none"
      style={{ userSelect: "none", height }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ccc",
            filter: "blur(8px)",
            borderRadius: 4,
            zIndex: 10,
          }}
        />
      )}

      <div
        ref={containerRef}
        className="w-full cursor-pointer relative"
        style={{ visibility: loading ? "hidden" : "visible", height }}
      />

      <div
        ref={hoverRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          pointerEvents: "none",
          mixBlendMode: "overlay",
          backgroundColor: hoverOverlayColor,
          opacity: 0,
          transformOrigin: "left center",
          transform: "scaleX(0)",
          transition: "opacity 0.2s ease",
          zIndex: 11,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          fontSize: 11,
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "2px 4px",
          color: "#ddd",
          zIndex: 12,
        }}
      >
        {formatTime(currentTime)}
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          fontSize: 11,
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "2px 4px",
          color: "#ddd",
          zIndex: 12,
        }}
      >
        {formatTime(duration)}
      </div>
    </div>
  );
};

export default TrackVisualizer;
