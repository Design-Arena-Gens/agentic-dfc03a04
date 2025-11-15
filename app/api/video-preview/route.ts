import { NextResponse } from "next/server";

export async function GET() {
  // Return a placeholder video response
  // In production, this would stream actual video data
  return NextResponse.json({
    message: "Video preview endpoint",
    note: "This is a placeholder. Real video generation requires client-side canvas recording.",
  });
}
