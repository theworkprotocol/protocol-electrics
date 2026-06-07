import fs from "fs";
import path from "path";

export type EnquiryStatus = "new" | "reviewed" | "quoted" | "booked" | "completed" | "declined";

export interface Enquiry {
  id: string;
  createdAt: string;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone?: string;
  service: string;
  description: string;
  estimate?: {
    jobType: string;
    totalCost: { min: number; max: number };
    labourHours: { min: number; max: number };
    labourCost: { min: number; max: number };
    summary: string;
    confidence: string;
    timeframe: string;
    notes?: string;
    clarifyingQuestions: string[];
    materials: { item: string; cost: string }[];
  };
  adminNotes?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "enquiries.json");

function readEnquiries(): Enquiry[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Enquiry[];
  } catch {
    return [];
  }
}

function writeEnquiries(enquiries: Enquiry[]): void {
  try {
    // Ensure the data directory exists
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2), "utf-8");
  } catch {
    // On Vercel / read-only filesystems this will silently fail.
    // Upgrade to a database (e.g. Vercel KV) for persistent storage in production.
    console.warn("[store] Could not write enquiries — filesystem may be read-only.");
  }
}

export function getEnquiries(): Enquiry[] {
  return readEnquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getEnquiry(id: string): Enquiry | undefined {
  return readEnquiries().find((e) => e.id === id);
}

export function createEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
  const enquiries = readEnquiries();
  const enquiry: Enquiry = {
    ...data,
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  enquiries.push(enquiry);
  writeEnquiries(enquiries);
  return enquiry;
}

export function updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | null {
  const enquiries = readEnquiries();
  const idx = enquiries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  enquiries[idx] = { ...enquiries[idx], ...updates };
  writeEnquiries(enquiries);
  return enquiries[idx];
}

export function getStats() {
  const enquiries = readEnquiries();
  return {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    booked: enquiries.filter((e) => e.status === "booked").length,
    completed: enquiries.filter((e) => e.status === "completed").length,
  };
}
