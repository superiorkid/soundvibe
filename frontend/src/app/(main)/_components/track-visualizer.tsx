"use client";

import { useAudio } from "@/context/audio-context";
import { formatTime } from "@/lib/utils";
import { TAudio } from "@/types/audio.type";
import { useEffect, useRef, useState } from "react";
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
  const {
    audioRef,
    currentTrack,
    playTrack,
    setCurrentTime: setGlobalCurrentTime,
  } = useAudio();

  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const progressGradient = ctx.createLinearGradient(0, 0, 0, height * 1.35);
    progressGradient.addColorStop(0, "#EE772F");
    progressGradient.addColorStop((height * 0.7) / height, "#EB4926");
    progressGradient.addColorStop((height * 0.7 + 1) / height, "#ffffff");
    progressGradient.addColorStop((height * 0.7 + 2) / height, "#ffffff");
    progressGradient.addColorStop((height * 0.7 + 3) / height, "#F6B094");
    progressGradient.addColorStop(1, "#F6B094");
    return progressGradient;
  };

  // Initialize waveform
  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const waveColorFinal = waveColor || createDefaultGradient(ctx, height);
    const progressColorFinal =
      progressColor || createDefaultProgressGradient(ctx, height);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveColorFinal,
      progressColor: progressColorFinal,
      height,
      barWidth,
      barGap,
      cursorColor,
      normalize: true,
      interact: true,
      // Use WebAudio backend for better performance
      backend: "WebAudio",
      hideScrollbar: true,
      fetchParams: {
        credentials: "include",
      },
    });

    setLoading(true);

    if (audio.streamUrl) {
      ws.load(`http://localhost:8000${audio.streamUrl}`);
    } else {
      console.error("No streamUrl provided for audio:", audio.id);
      setLoading(false);
      return;
    }

    ws.on("ready", () => {
      setDuration(ws.getDuration());
      setLoading(false);
    });

    ws.on("error", (error) => {
      console.error("WaveSurfer loading error:", error);
      setLoading(false);
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [
    audio.streamUrl,
    audio.id,
    height,
    barWidth,
    barGap,
    cursorColor,
    waveColor,
    progressColor,
  ]);

  // Sync current time (local + global)
  useEffect(() => {
    if (!wavesurfer || !audioRef.current) return;
    const audioEl = audioRef.current;

    const updateProgress = () => {
      if (currentTrack?.id === audio.id) {
        const progress = audioEl.currentTime / audioEl.duration || 0;
        setCurrentTime(audioEl.currentTime);
        setGlobalCurrentTime(audioEl.currentTime);

        // Only update wavesurfer if it's not currently interacting
        if (!wavesurfer.isSeeking) {
          wavesurfer.seekTo(progress);
        }
      }
    };

    const handleEnded = () => {
      setCurrentTime(0);
      setGlobalCurrentTime(0);
      wavesurfer.seekTo(0);
    };

    audioEl.addEventListener("timeupdate", updateProgress);
    audioEl.addEventListener("ended", handleEnded);

    return () => {
      audioEl.removeEventListener("timeupdate", updateProgress);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [wavesurfer, audioRef, currentTrack, audio.id, setGlobalCurrentTime]);

  // Reset when track changes
  useEffect(() => {
    if (currentTrack?.id !== audio.id) {
      setCurrentTime(0);
      wavesurfer?.seekTo(0);
    }
  }, [currentTrack, audio.id, wavesurfer]);

  // Click-to-seek + play
  useEffect(() => {
    if (!wavesurfer) return;

    const handleInteraction = () => {
      const currentTime = wavesurfer.getCurrentTime();

      if (currentTrack?.id === audio.id) {
        // If this is the current track, just seek
        if (audioRef.current) {
          audioRef.current.currentTime = currentTime;
        }
      } else {
        // If this is a different track, play it from the clicked position
        playTrack(audio, currentTime);
      }
    };

    wavesurfer.on("interaction", handleInteraction);

    return () => {
      wavesurfer.un("interaction", handleInteraction);
    };
  }, [wavesurfer, audioRef, currentTrack, audio, playTrack]);

  // Hover effect
  useEffect(() => {
    if (!hoverRef.current || !containerRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      hoverRef.current!.style.width = `${offsetX}px`;
      hoverRef.current!.style.opacity = "1";
    };

    const handlePointerLeave = () => {
      hoverRef.current!.style.opacity = "0";
    };

    const container = containerRef.current;
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
            left: 0,
            top: 0,
            width: "100%",
            height,
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
          height,
          width: 0,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          backgroundColor: hoverOverlayColor,
          opacity: 0,
          transition: "opacity 0.2s ease",
          zIndex: 11,
        }}
      />

      {/* Current Time */}
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
          userSelect: "none",
        }}
      >
        {formatTime(currentTime)}
      </div>

      {/* Duration */}
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
          userSelect: "none",
        }}
      >
        {formatTime(duration)}
      </div>
    </div>
  );
};

export default TrackVisualizer;
