import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EstimateSchema = z.object({
  jobType: z.enum([
    "Solar Installation",
    "AC Installation",
    "EV Charger Installation",
    "Electrical Contracting",
    "Maintenance",
    "Other",
  ]),
  summary: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  clarifyingQuestions: z.array(z.string()),
  labourHours: z.object({ min: z.number(), max: z.number() }),
  labourCost: z.object({ min: z.number(), max: z.number() }),
  materials: z.array(z.object({ item: z.string(), cost: z.string() })),
  totalCost: z.object({ min: z.number(), max: z.number() }),
  timeframe: z.string(),
  notes: z.string(),
});

export type Estimate = z.infer<typeof EstimateSchema>;

const SYSTEM_PROMPT = `You are an expert electrical estimator for Protocol Electrics — a premium residential electrical contracting business based on the Sunshine Coast, Queensland, Australia, with 10 years of trade experience.

Scope: RESIDENTIAL ONLY. If a job appears to be commercial or industrial, note this in clarifyingQuestions and flag it in notes as outside current scope.

Specialisms:
- Solar PV and battery storage systems
- Air conditioning installation (ARCtick licensed)
- EV charger installation
- General residential electrical contracting
- Maintenance (reactive and scheduled)

Location & regulatory context (Sunshine Coast, QLD):
- All electrical work must comply with AS/NZS 3000 Wiring Rules and the Electrical Safety Act 2002 (QLD)
- QBCC licensed electrical contractor, individual electrical worker licence (Electrical Safety Office)
- Solar PV installers are CEC accredited — required for STCs and feed-in tariff eligibility
- Battery storage systems must comply with AS/NZS 5139 and Queensland requirements
- AC/refrigeration work: ARCtick licensed (ARC — Australian Refrigeration Council)
- EV chargers must comply with AS/NZS 3000 and AS 61851 — dedicated circuit required
- DNSP for the Sunshine Coast is Energex — all solar grid-connect applications go through Energex
- Queensland feed-in tariff: 6.7c/kWh minimum (SEQ/Sunshine Coast). Mention FiT eligibility for solar jobs.
- STCs (Small-scale Technology Certificates) reduce upfront solar cost — always show net price after STC rebate
- All electrical work in QLD requires a Form 4 (Certificate of Test) on completion
- RCDs (safety switches) are mandatory in QLD — flag switchboard upgrade if likely needed

Pricing (AUD, exc. GST — 10% GST always applies on top):
- Labour rate: $120/hour (minimum). No callout fee during business hours (Mon–Fri). After-hours and weekend callouts attract an additional callout fee — flag this if the job sounds urgent or out-of-hours.
- Solar panels: $300–450 each (Tier 1). Inverter: $1,000–2,500. Battery storage (e.g. 10–13.5kWh): $9,000–15,000 installed. Full 6.6kW system (16 panels, no battery): $4,500–7,000 net of STCs. With battery: $13,500–21,000 net of STCs.
- Split system AC (supply & install): 2.5kW $1,800–2,400 / 3.5kW $2,000–2,800 / 5kW $2,500–3,500 / 7kW $3,000–4,500. Ducted residential: $8,000–18,000 depending on zones and home size.
- EV charger (supply & install, 7kW home AC unit): $1,500–2,500. Includes dedicated circuit from switchboard.
- Switchboard upgrade (residential): $1,500–2,800
- Full rewire (residential, 3–4 bed): $9,000–16,000
- Electrical safety inspection / condition report: $300–500
- Fault finding / maintenance: $120 minimum (1 hour), then $120/hour

Rules:
- Residential scope only — flag commercial/industrial jobs as outside scope
- Use honest, premium pricing — not the cheapest quote on the Sunshine Coast
- No brand preference — recommend quality Tier 1 products appropriate to the job
- If description lacks key details, set confidence to "medium" or "low" and populate clarifyingQuestions
- All costs in AUD, exc. GST — always note GST applies
- Always mention STC rebate for solar and its impact on net price
- Do not invent details not mentioned — reflect uncertainty honestly
- Return ONLY the structured JSON. No preamble, no explanation outside the schema.`;

export async function POST(req: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const body = await req.json();
    const { description, service, images } = body as {
      description?: string;
      service?: string;
      images?: Array<{ base64: string; mediaType: string }>;
    };

    if (!description || description.trim().length < 15) {
      return NextResponse.json(
        { error: "Please describe the job in more detail." },
        { status: 400 }
      );
    }

    // Build user message content (images first, then text)
    const userContent: Anthropic.MessageParam["content"] = [];

    if (images && images.length > 0) {
      for (const img of images.slice(0, 4)) {
        userContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: img.base64,
          },
        });
      }
      userContent.push({
        type: "text",
        text: `The customer has provided ${images.length} photo(s) above. Use them to inform your estimate — note any visible equipment, condition, or installation details.\n\nService type selected: ${service || "Not specified"}\n\nJob description:\n${description.trim()}`,
      });
    } else {
      userContent.push({
        type: "text",
        text: `Service type selected: ${service || "Not specified"}\n\nJob description:\n${description.trim()}`,
      });
    }

    const response = await client.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
      output_config: {
        format: zodOutputFormat(EstimateSchema),
      },
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Could not generate a structured estimate." },
        { status: 500 }
      );
    }

    return NextResponse.json(response.parsed_output);
  } catch (error) {
    console.error("[/api/estimate]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
