import { NextRequest, NextResponse } from "next/server";
import { getEnquiries, updateEnquiry } from "@/lib/store";

export async function GET() {
  try {
    const enquiries = getEnquiries();
    return NextResponse.json(enquiries);
  } catch (err) {
    console.error("Get enquiries error:", err);
    return NextResponse.json({ error: "Failed to load enquiries" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = updateEnquiry(id, updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update enquiry error:", err);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
