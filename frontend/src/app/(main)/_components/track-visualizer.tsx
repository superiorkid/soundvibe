"use client";

import { useAudio } from "@/context/audio-context";
import { formatTime } from "@/lib/utils";
import { TTrack } from "@/types/track.type";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface TrackVisualizerProps {
  audio: TTrack;
}

const TrackVisualizer = ({ audio }: TrackVisualizerProps) => {
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

  const createGradient = (ctx: CanvasRenderingContext2D, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height * 1.35);
    gradient.addColorStop(0, "#656666");
    gradient.addColorStop((height * 0.7) / height, "#656666");
    gradient.addColorStop((height * 0.7 + 1) / height, "#ffffff");
    gradient.addColorStop((height * 0.7 + 2) / height, "#ffffff");
    gradient.addColorStop((height * 0.7 + 3) / height, "#B1B1B1");
    gradient.addColorStop(1, "#B1B1B1");
    return gradient;
  };

  const createProgressGradient = (
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

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const height = 50;
    const waveGradient = createGradient(ctx, height);
    const progressGradient = createProgressGradient(ctx, height);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveGradient,
      progressColor: progressGradient,
      height,
      barWidth: 2,
      barGap: 1.3,
      cursorColor: "#f43f5e",
      normalize: true,
      interact: true,
    });

    setLoading(true);
    ws.load(audio.audioSrc);

    ws.on("ready", () => {
      setDuration(ws.getDuration());
      setLoading(false);
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [audio.audioSrc]);

  useEffect(() => {
    if (!wavesurfer || !audioRef.current) return;
    const audioEl = audioRef.current;

    const updateProgress = () => {
      if (currentTrack?.audioSrc === audio.audioSrc) {
        const progress = audioEl.currentTime / audioEl.duration || 0;
        setCurrentTime(audioEl.currentTime);
        setGlobalCurrentTime(audioEl.currentTime);
        wavesurfer.seekTo(progress);
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
  }, [
    wavesurfer,
    audioRef,
    currentTrack,
    audio.audioSrc,
    setGlobalCurrentTime,
  ]);

  useEffect(() => {
    if (currentTrack?.audioSrc !== audio.audioSrc) {
      setCurrentTime(0);
      wavesurfer?.seekTo(0);
    }
  }, [currentTrack, audio.audioSrc, wavesurfer]);

  useEffect(() => {
    if (!wavesurfer) return;

    const handleSeekAndPlay = () => {
      const newTime = wavesurfer.getCurrentTime();

      if (currentTrack?.audioSrc !== audio.audioSrc) {
        playTrack(audio, newTime);
      } else if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        if (audioRef.current.paused) audioRef.current.play();
      }
    };

    wavesurfer.on("interaction", handleSeekAndPlay);
    return () => {
      wavesurfer.un("interaction", handleSeekAndPlay);
    };
  }, [wavesurfer, audioRef, currentTrack, audio, playTrack]);

  useEffect(() => {
    if (!hoverRef.current || !containerRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      hoverRef.current!.style.width = `${e.offsetX}px`;
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
      style={{ userSelect: "none", height: 50 }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 50,
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
        style={{ visibility: loading ? "hidden" : "visible", height: 50 }}
      />

      <div
        ref={hoverRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 50,
          width: 0,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          backgroundColor: "rgba(255,255,255,0.5)",
          opacity: 0,
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
          userSelect: "none",
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
          userSelect: "none",
        }}
      >
        {formatTime(duration)}
      </div>
    </div>
  );
};

export default TrackVisualizer;
