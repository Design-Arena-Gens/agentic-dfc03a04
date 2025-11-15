"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface VideoGeneratorProps {
  generating: boolean;
  setGenerating: (value: boolean) => void;
}

export default function VideoGenerator({
  generating,
  setGenerating,
}: VideoGeneratorProps) {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const themes = [
    "Abandoned asylum",
    "Haunted house",
    "Dark forest",
    "Old cemetery",
    "Cursed object",
    "Ghost encounter",
    "Serial killer",
    "Supernatural entity",
  ];

  const handleGenerate = async () => {
    if (!storyPrompt.trim()) {
      setError("Please enter a story prompt");
      return;
    }

    setGenerating(true);
    setError("");
    setProgress(0);
    setVideoUrl("");

    try {
      // Step 1: Generate story
      setProgress(20);
      const storyResponse = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: storyPrompt }),
      });

      if (!storyResponse.ok) throw new Error("Failed to generate story");
      const { story } = await storyResponse.json();
      setGeneratedStory(story);

      // Step 2: Generate audio
      setProgress(40);
      const audioResponse = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: story }),
      });

      if (!audioResponse.ok) throw new Error("Failed to generate audio");
      const audioBlob = await audioResponse.blob();

      // Step 3: Create video
      setProgress(60);
      const videoResponse = await fetch("/api/create-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, audioUrl: URL.createObjectURL(audioBlob) }),
      });

      if (!videoResponse.ok) throw new Error("Failed to create video");
      const { videoUrl: url } = await videoResponse.json();

      setProgress(100);
      setVideoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
    } finally {
      setGenerating(false);
    }
  };

  const quickPrompt = (theme: string) => {
    setStoryPrompt(`Tell me a terrifying horror story about ${theme.toLowerCase()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-black/60 backdrop-blur-lg border border-red-900/50 rounded-lg p-8 shadow-2xl"
      >
        {/* Story Prompt Input */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-3 text-red-500">
            Enter Your Horror Story Prompt
          </label>
          <textarea
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            placeholder="E.g., A group of friends exploring an abandoned mental asylum discovers something horrifying..."
            className="w-full h-32 px-4 py-3 bg-black/80 border border-red-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
            disabled={generating}
          />
        </div>

        {/* Quick Theme Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Quick themes:</p>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => quickPrompt(theme)}
                disabled={generating}
                className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !storyPrompt.trim()}
          className="w-full py-4 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-900/50"
        >
          {generating ? "Generating Horror..." : "🎬 Generate Horror Story Video"}
        </button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Progress Bar */}
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Generating...</span>
              <span className="text-sm text-red-500">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-black/80 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-900 to-red-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2 animate-pulse">
              {progress < 30 && "Crafting your horror story..."}
              {progress >= 30 && progress < 60 && "Generating deep voice narration..."}
              {progress >= 60 && progress < 90 && "Adding horror effects..."}
              {progress >= 90 && "Finalizing your video..."}
            </p>
          </motion.div>
        )}

        {/* Generated Story Display */}
        {generatedStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-black/80 border border-red-900/50 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-3 text-red-500">Generated Story:</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {generatedStory}
            </p>
          </motion.div>
        )}

        {/* Video Preview */}
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-xl font-semibold mb-3 text-red-500">Your Horror Video:</h3>
            <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-red-900/50">
              <video
                ref={videoRef}
                controls
                className="w-full"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex gap-3 mt-4">
              <a
                href={videoUrl}
                download="horror-story.mp4"
                className="flex-1 py-3 bg-red-900/50 hover:bg-red-900/70 text-center border border-red-800 rounded-lg transition-colors"
              >
                📥 Download Video
              </a>
              <button
                onClick={() => {
                  setVideoUrl("");
                  setGeneratedStory("");
                  setStoryPrompt("");
                }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-center border border-gray-700 rounded-lg transition-colors"
              >
                🔄 Generate New Story
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Hidden canvas for video generation */}
      <canvas ref={canvasRef} className="hidden" width="1920" height="1080" />
    </div>
  );
}
