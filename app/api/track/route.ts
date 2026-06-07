import { NextRequest, NextResponse } from "next/server";
import { getEnquiry } from "@/lib/store";

const REF_REGEX = /^PE-[A-Z0-9]{6}$/;

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");

  if (!ref || !REF_REGEX.test(ref)) {
    return NextResponse.json(
      { error: "Invalid reference format. Expected PE-XXXXXX." },
      { status: 400 }
    );
  }

  const enquiry = await getEnquiry(ref);

  if (!enquiry) {
    return NextResponse.json(
      { error: "No job found with that reference." },
      { status: 404 }
    );
  }

  // Return only safe public fields — never email, phone, description, estimate
  return NextResponse.json({
    id: enquiry.id,
    name: enquiry.name,
    service: enquiry.service,
    status: enquiry.status,
    createdAt: enquiry.createdAt,
  });
}
