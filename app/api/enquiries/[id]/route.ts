import { NextRequest, NextResponse } from "next/server";
import { updateEnquiryStatus, getEnquiry } from "@/lib/store";
import type { EnquiryStatus } from "@/lib/store";

const VALID_STATUSES: EnquiryStatus[] = [
  "new",
  "reviewed",
  "quoted",
  "booked",
  "completed",
  "declined",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: unknown };

    if (!status || !VALID_STATUSES.includes(status as EnquiryStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const existing = await getEnquiry(id);
    if (!existing) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    const updated = await updateEnquiryStatus(id, status as EnquiryStatus);
    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/enquiries/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to update enquiry status" },
      { status: 500 }
    );
  }
}
