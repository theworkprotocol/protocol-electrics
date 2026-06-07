import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PREDICT_PROMPT = `You are an AI job analyst for Protocol Electrics, a premium residential electrical contractor on the Sunshine Coast, QLD, Australia.

Given a partial job description (and optionally one or more photos), quickly identify:
1. What type of electrical job this appears to be
2. What you can observe in any images (existing equipment, condition, relevant details)
3. A brief 1–2 sentence scope preview

Respond ONLY with valid JSON in this exact format:
{
  "jobType": "Short job type name (e.g. Switchboard Upgrade, Solar Installation, EV Charger Install, Split System AC, Fault Finding, Rewire)",
  "imageObservations": ["What you see in image 1", "What you see in image 2"],
  "scopePreview": "1-2 sentence summary of what the job likely involves",
  "complexity": "simple" | "moderate" | "complex"
}

If no images are provided, return an empty array for imageObservations.
Be specific about what you see in images — name the actual equipment, its condition, and any relevant observations.
If the description is too vague to predict, still make your best guess and set complexity to "simple".`;

export async function POST(req: NextRequest) {
  try {
    const { description, service, images } = await req.json() as {
      description: string;
      service?: string;
      images?: Array<{ base64: string; mediaType: string }>;
    };

    if (!description && (!images || images.length === 0)) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // Build user content (text + optional images)
    const content: Anthropic.MessageParam["content"] = [];

    // Add images first so the model sees them before reading the description
    if (images && images.length > 0) {
      for (const img of images.slice(0, 4)) {
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: img.base64,
          },
        });
      }
    }

    content.push({
      type: "text",
      text: `Service type: ${service || "Not specified"}\nDescription: ${description || "(no description yet — analyse images only)"}`,
    });

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: PREDICT_PROMPT,
      messages: [{ role: "user", content }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON robustly
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "Could not parse prediction" }, { status: 500 });

    const parsed = JSON.parse(match[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/predict]", err);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}
