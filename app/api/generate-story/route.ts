import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use OpenAI API for story generation
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      // Fallback to pre-written horror story if no API key
      const fallbackStory = generateFallbackStory(prompt);
      return NextResponse.json({ story: fallbackStory });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a master horror story writer. Create short, terrifying horror stories (200-300 words) that are engaging, suspenseful, and have a shocking twist. Focus on psychological horror and atmosphere.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const story = data.choices[0].message.content;

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error generating story:", error);

    // Return fallback story on error
    const { prompt } = await request.json();
    const fallbackStory = generateFallbackStory(prompt);
    return NextResponse.json({ story: fallbackStory });
  }
}

function generateFallbackStory(prompt: string): string {
  const stories = [
    `The old house at the end of Maple Street had been abandoned for decades. Sarah's friends dared her to spend the night inside. At midnight, she heard footsteps on the stairs. Heavy, deliberate footsteps. She hid in a closet, her heart pounding.

The footsteps stopped outside the closet door. Through the crack, she saw a shadow. A hand reached for the doorknob. It turned slowly. The door creaked open.

"Hello, Sarah," a voice whispered. "I've been waiting for you."

She recognized the voice. It was her own.

The next morning, police found the house empty. Sarah was never seen again. But sometimes, late at night, neighbors swear they can see her in the window, beckoning others to come inside.`,

    `Dr. Marcus had performed thousands of surgeries, but this patient was different. The man had no medical records, no identification. Just a note: "Remove it before midnight."

During the operation, Marcus found something impossible – a small, beating heart inside the patient's stomach. It wasn't human. As he touched it, the patient's eyes opened.

"You shouldn't have done that," the patient whispered, though he was under full anesthesia.

The lights went out. When they came back on, the patient was gone. In his place was a message written in blood: "Now it's inside you."

That night at 11:59 PM, Dr. Marcus felt something moving in his stomach.`,

    `The abandoned asylum had one rule: never open the door marked "DO NOT ENTER." Emily's YouTube channel needed views, so she decided to break it.

Inside, she found a single mirror in an empty room. As she filmed, her reflection moved differently. It smiled when she didn't. It waved when she stood still.

"Want to switch places?" her reflection asked.

Before Emily could run, her reflection stepped through the mirror. Emily tried to scream, but no sound came out. She was trapped behind the glass.

Her reflection picked up the camera, smiled at it, and walked out. The door locked behind her.

Now Emily watches from the mirror as her reflection lives her life. And she's not the only one trapped inside.`,
  ];

  return stories[Math.floor(Math.random() * stories.length)];
}
