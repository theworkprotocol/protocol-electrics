import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/store";
import { sendEnquiryNotification } from "@/lib/email";

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

    return NextResponse.json(enquiry, { status: 201 });
  } catch (err) {
    console.error("Enquiry save error:", err);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
