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

// ---------------------------------------------------------------------------
// Helpers: determine whether Vercel KV is available
// ---------------------------------------------------------------------------

function isKVAvailable(): boolean {
  return Boolean(process.env.KV_REST_API_URL);
}

// Lazy-load the kv client so the module can still be imported in environments
// without @vercel/kv configured (avoids module-level errors).
async function getKV() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

// ---------------------------------------------------------------------------
// File-based fallback (original implementation)
// ---------------------------------------------------------------------------

const DATA_FILE = path.join(process.cwd(), "data", "enquiries.json");

function readEnquiriesFromFile(): Enquiry[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Enquiry[];
  } catch {
    return [];
  }
}

function writeEnquiriesToFile(enquiries: Enquiry[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2), "utf-8");
  } catch {
    // On Vercel / read-only filesystems this will silently fail.
    console.warn("[store] Could not write enquiries — filesystem may be read-only.");
  }
}

// ---------------------------------------------------------------------------
// KV-based implementation
// ---------------------------------------------------------------------------

type KVRecord = Record<string, unknown>;

async function getEnquiriesFromKV(): Promise<Enquiry[]> {
  const kv = await getKV();
  const ids = await kv.lrange<string>("enquiries", 0, -1);
  if (!ids || ids.length === 0) return [];
  const results = await Promise.all(
    ids.map((id) => kv.hgetall<KVRecord>("enquiry:" + id))
  );
  const enquiries = results
    .filter((e): e is KVRecord => e !== null)
    .map((e) => e as unknown as Enquiry);
  return enquiries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function getEnquiryFromKV(id: string): Promise<Enquiry | null> {
  const kv = await getKV();
  const result = await kv.hgetall<KVRecord>("enquiry:" + id);
  return result ? (result as unknown as Enquiry) : null;
}

async function saveEnquiryToKV(enquiry: Enquiry): Promise<void> {
  const kv = await getKV();
  await kv.hset("enquiry:" + enquiry.id, enquiry as unknown as KVRecord);
  await kv.lpush("enquiries", enquiry.id);
}

async function updateEnquiryInKV(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
  const kv = await getKV();
  const existing = await kv.hgetall<KVRecord>("enquiry:" + id);
  if (!existing) return null;
  const updated = { ...(existing as unknown as Enquiry), ...updates };
  await kv.hset("enquiry:" + id, updated as unknown as KVRecord);
  return updated;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getEnquiries(): Promise<Enquiry[]> {
  if (isKVAvailable()) {
    return getEnquiriesFromKV();
  }
  return readEnquiriesFromFile().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getEnquiry(id: string): Promise<Enquiry | undefined> {
  if (isKVAvailable()) {
    return (await getEnquiryFromKV(id)) ?? undefined;
  }
  return readEnquiriesFromFile().find((e) => e.id === id);
}

export function createEnquiry(
  data: Omit<Enquiry, "id" | "createdAt" | "status">
): Enquiry {
  const enquiry: Enquiry = {
    ...data,
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  if (isKVAvailable()) {
    // Fire-and-forget: KV write is async but we return the enquiry immediately
    saveEnquiryToKV(enquiry).catch((err) =>
      console.error("[store] KV write failed:", err)
    );
  } else {
    const enquiries = readEnquiriesFromFile();
    enquiries.push(enquiry);
    writeEnquiriesToFile(enquiries);
  }
  return enquiry;
}

export async function updateEnquiry(
  id: string,
  updates: Partial<Enquiry>
): Promise<Enquiry | null> {
  if (isKVAvailable()) {
    return updateEnquiryInKV(id, updates);
  }
  const enquiries = readEnquiriesFromFile();
  const idx = enquiries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  enquiries[idx] = { ...enquiries[idx], ...updates };
  writeEnquiriesToFile(enquiries);
  return enquiries[idx];
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<Enquiry | null> {
  return updateEnquiry(id, { status });
}

export async function getStats() {
  const enquiries = await getEnquiries();
  return {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    booked: enquiries.filter((e) => e.status === "booked").length,
    completed: enquiries.filter((e) => e.status === "completed").length,
  };
}
