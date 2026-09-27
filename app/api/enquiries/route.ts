import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
const roles = new Set(["farmer", "agronomist", "engineer", "operator", "mentor", "other"]);
const trimmed = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "Unsupported request." }, { status: 415 });
  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 12000) return Response.json({ error: "Request too large." }, { status: 413 });
    const parsed: unknown = JSON.parse(body);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }
    data = parsed as Record<string, unknown>;
  } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (trimmed(data.website, 100)) return Response.json({ ok: true });
  const name = trimmed(data.name, 120), role = trimmed(data.role, 30);
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const email = trimmed(data.email, 254), location = trimmed(data.location, 160), message = trimmed(data.message, 2000);
  const crops = trimmed(data.crops, 200), currentMethod = trimmed(data.currentMethod, 1000);
  const landSize = Number(data.landSize);
  if (!name) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!roles.has(role)) return Response.json({ error: "Please select who you are." }, { status: 400 });
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]{7,25}$/.test(phone) || phone.length > 25 || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return Response.json({ error: "Please enter a phone number with 7–15 digits, using spaces, parentheses, hyphens or a leading +." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Please check your email address." }, { status: 400 });
  if (!location) return Response.json({ error: "Please enter your district and state." }, { status: 400 });
  if (!message) return Response.json({ error: "Please tell us what you would like to share." }, { status: 400 });
  if (role === "farmer" && !crops) return Response.json({ error: "Please add the crops you grow." }, { status: 400 });
  if (role === "farmer" && (!Number.isFinite(landSize) || landSize <= 0 || landSize > 100000)) return Response.json({ error: "Please enter your land size in acres." }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Enquiries are temporarily unavailable." }, { status: 503 });
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`INSERT INTO enquiries (name, role, phone, email, location, crops, land_size, current_method, message)
      VALUES (${name}, ${role}, ${phone}, ${email || null}, ${location}, ${role === "farmer" ? crops : null},
      ${role === "farmer" ? landSize : null}, ${role === "farmer" ? currentMethod || null : null}, ${message})`;
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Enquiry save failed", error);
    return Response.json({ error: "Enquiries are temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
