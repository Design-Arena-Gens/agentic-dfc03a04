import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { story, audioUrl } = await request.json();

    if (!story) {
      return NextResponse.json(
        { error: "Story is required" },
        { status: 400 }
      );
    }

    // For web-based deployment, we'll return a data structure
    // that the client can use to create a video using canvas
    // Real video encoding would require FFmpeg which doesn't work well in Vercel serverless

    const videoData = {
      story,
      duration: estimateDuration(story),
      scenes: generateScenes(story),
      effects: getHorrorEffects(),
    };

    return NextResponse.json({
      videoUrl: "/api/video-preview",
      videoData,
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

function estimateDuration(text: string): number {
  // Rough estimate: 150 words per minute
  const words = text.split(" ").length;
  return Math.ceil((words / 150) * 60);
}

function generateScenes(story: string): Array<{
  text: string;
  startTime: number;
  duration: number;
  effect: string;
}> {
  const sentences = story.match(/[^.!?]+[.!?]+/g) || [story];
  const totalDuration = estimateDuration(story);
  const sceneDuration = totalDuration / sentences.length;

  return sentences.map((sentence, index) => ({
    text: sentence.trim(),
    startTime: index * sceneDuration,
    duration: sceneDuration,
    effect: ["fade", "glitch", "flicker", "blood"][index % 4],
  }));
}

function getHorrorEffects() {
  return {
    backgroundColor: "#000000",
    textColor: "#8B0000",
    glitchIntensity: 0.7,
    flickerFrequency: 2,
    bloodDrips: true,
    vignette: true,
  };
}
