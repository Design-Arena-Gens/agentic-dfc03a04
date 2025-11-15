"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playHorrorAmbience = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Create low frequency drone (horror ambience)
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();

    oscillator1.type = "sine";
    oscillator1.frequency.setValueAtTime(55, ctx.currentTime); // Low A note
    gainNode1.gain.setValueAtTime(0, ctx.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);

    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);
    oscillator1.start();

    // Add subtle detuned oscillator for unease
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();

    oscillator2.type = "sine";
    oscillator2.frequency.setValueAtTime(57, ctx.currentTime);
    gainNode2.gain.setValueAtTime(0, ctx.currentTime);
    gainNode2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);

    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    oscillator2.start();

    // Create heartbeat effect
    const heartbeatInterval = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }, 800);

    setIsPlaying(true);

    // Stop after 30 seconds
    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
      clearInterval(heartbeatInterval);
      setIsPlaying(false);
    }, 30000);
  };

  const generateScreamEffect = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "sawtooth";
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    // Scream pitch sweep
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      ctx.currentTime + 0.5
    );

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <button
        onClick={playHorrorAmbience}
        disabled={isPlaying}
        className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg text-sm backdrop-blur-sm border border-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? "🔊 Playing..." : "🔇 Horror Ambience"}
      </button>
      <button
        onClick={generateScreamEffect}
        className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg text-sm backdrop-blur-sm border border-red-700 transition-colors"
      >
        😱 Scream
      </button>
    </div>
  );
}
