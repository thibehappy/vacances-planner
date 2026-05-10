import { NextResponse } from "next/server";

const KV_KEY = "vacances-availability";

type AvailabilityData = Record<string, Record<string, string>>;

// ─── Storage: Upstash Redis (Vercel) or JSON file (local) ───

async function readData(): Promise<AvailabilityData> {
  if (process.env.KV_REST_API_URL) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN!,
    });
    return (await redis.get<AvailabilityData>(KV_KEY)) || {};
  }

  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "availability.json");
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}

async function writeData(data: AvailabilityData): Promise<void> {
  if (process.env.KV_REST_API_URL) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN!,
    });
    await redis.set(KV_KEY, data);
    return;
  }

  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "data", "availability.json");
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ─── API Routes ─────────────────────────────────────────────

export async function GET() {
  return NextResponse.json(await readData());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, date, status, batch } = body;
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const data = await readData();
  if (!data[name]) data[name] = {};

  if (batch && typeof batch === "object") {
    for (const [d, s] of Object.entries(batch)) {
      if (s === "unknown") {
        delete data[name][d];
      } else {
        data[name][d] = s as string;
      }
    }
  } else if (date && status) {
    if (status === "unknown") {
      delete data[name][date];
    } else {
      data[name][date] = status;
    }
  }

  await writeData(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }
  const data = await readData();
  delete data[name];
  await writeData(data);
  return NextResponse.json({ ok: true });
}
