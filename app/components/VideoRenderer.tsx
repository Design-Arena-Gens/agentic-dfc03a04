"use client";

import { useEffect, useRef, useState } from "react";

interface Scene {
  text: string;
  startTime: number;
  duration: number;
  effect: string;
}

interface VideoRendererProps {
  story: string;
  scenes: Scene[];
  audioUrl?: string;
  onComplete?: (videoBlob: Blob) => void;
}

export default function VideoRenderer({
  story,
  scenes,
  audioUrl,
  onComplete,
}: VideoRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    renderScene(ctx, scenes[currentScene] || scenes[0]);
  }, [currentScene, scenes]);

  const renderScene = (
    ctx: CanvasRenderingContext2D,
    scene: Scene
  ) => {
    const canvas = ctx.canvas;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add vignette effect
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 4,
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 1.2
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add blood drips effect
    if (Math.random() > 0.7) {
      ctx.fillStyle = "rgba(139, 0, 0, 0.3)";
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.3;
        ctx.fillRect(x, y, 3, Math.random() * 50 + 20);
      }
    }

    // Render text with horror effect
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 64px Arial";

    const text = scene.text;
    const maxWidth = canvas.width * 0.8;
    const lineHeight = 80;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    // Word wrap
    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    // Apply effect
    switch (scene.effect) {
      case "glitch":
        ctx.fillStyle = "#ff0000";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0000";
        break;
      case "flicker":
        ctx.fillStyle = Math.random() > 0.5 ? "#8B0000" : "#ffffff";
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#8B0000";
        break;
      case "blood":
        ctx.fillStyle = "#8B0000";
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#8B0000";
        break;
      default:
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#000000";
    }

    // Draw text
    const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
    });

    ctx.restore();

    // Add scan lines
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let i = 0; i < canvas.height; i += 4) {
      ctx.fillRect(0, i, canvas.width, 2);
    }
  };

  const startRendering = async () => {
    if (!canvasRef.current) return;

    setRendering(true);

    // Simulate video rendering by cycling through scenes
    for (let i = 0; i < scenes.length; i++) {
      setCurrentScene(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Create video blob (simplified - real implementation would use MediaRecorder)
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob && onComplete) {
        onComplete(blob);
      }
      setRendering(false);
    }, "image/png");
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full border border-red-900/50 rounded-lg"
        style={{ maxHeight: "500px" }}
      />
      {!rendering && (
        <button
          onClick={startRendering}
          className="mt-4 w-full py-3 bg-red-900 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors"
        >
          🎬 Render Video Preview
        </button>
      )}
      {rendering && (
        <div className="mt-4 text-center">
          <p className="text-red-500 animate-pulse">
            Rendering scene {currentScene + 1} of {scenes.length}...
          </p>
        </div>
      )}
    </div>
  );
}
