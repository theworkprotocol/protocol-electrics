import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/store";
import { sendEnquiryNotification } from "@/lib/email";
import { notifyMonique } from "@/lib/monique";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, description, estimate } = body;

    if (!name || !email || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const enquiry = createEnquiry({ name, email, phone, service, description, estimate });

    // Send owner notification — wrapped so a failed email never breaks form submission
    try {
      await sendEnquiryNotification(enquiry);
    } catch (emailErr) {
      console.error("[email] Failed to send enquiry notification:", emailErr);
    }

    // Ping Monique (Telegram + quote pipeline) — same rule: never break the submission
    try {
      await notifyMonique({ name, email, phone, service, description, estimate });
    } catch (moniqueErr) {
      console.error("[monique] Failed to notify:", moniqueErr);
    }

    // Customer confirmation now comes from protocol-engine (via notifyMonique's
    // engine call above) — sending here too would double up.

    return NextResponse.json(enquiry, { status: 201 });
  } catch (err) {
    console.error("Enquiry save error:", err);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
