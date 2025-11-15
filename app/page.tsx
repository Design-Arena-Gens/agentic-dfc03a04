"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VideoGenerator from "./components/VideoGenerator";
import HorrorBackground from "./components/HorrorBackground";
import AudioManager from "./components/AudioManager";

export default function Home() {
  const [generating, setGenerating] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <HorrorBackground />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="horror-text text-6xl md:text-8xl font-bold mb-4 animate-pulse-slow">
            AI HORROR STORIES
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate spine-chilling horror stories with AI-powered narratives,
            deep voice narration, and terrifying sound effects
          </p>
        </motion.div>

        <VideoGenerator generating={generating} setGenerating={setGenerating} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>🎃 Powered by AI | Generate unlimited horror stories</p>
        </motion.div>
      </div>

      <AudioManager />
    </main>
  );
}
