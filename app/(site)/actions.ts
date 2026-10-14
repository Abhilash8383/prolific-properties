"use server";

import { collection } from "@/lib/db";
import { ENQUIRY_TYPES, type Enquiry } from "@/lib/types";

export type EnquiryState = { ok: boolean; error?: string } | null;

const known: Record<string, "name" | "phone" | "email" | "message"> = {
  "Full name": "name",
  "Your name": "name",
  Mobile: "phone",
  Email: "email",
  Message: "message",
};

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  if (form.get("company")) return { ok: true };

  const type = String(form.get("_type"));
  const doc = {
    type: (ENQUIRY_TYPES as readonly string[]).includes(type) ? (type as Enquiry["type"]) : "contact",
    status: "new" as const,
    subject: String(form.get("_subject") ?? "").slice(0, 200),
    name: "",
    phone: "",
    email: "",
    message: "",
    details: {} as Record<string, string>,
    createdAt: new Date(),
  };

  for (const [key, raw] of form.entries()) {
    if (key.startsWith("_") || key.startsWith("$") || key === "company" || typeof raw !== "string") continue;
    const value = raw.trim().slice(0, 2000);
    if (!value) continue;
    if (known[key]) doc[known[key]] = value;
    else if (Object.keys(doc.details).length < 20) doc.details[key.slice(0, 60)] = value;
  }

  if (!doc.name || !/^[+\d][\d\s-]{6,}$/.test(doc.phone)) {
    return { ok: false, error: "Please enter your name and a valid mobile number." };
  }

  await (await collection("enquiries")).insertOne(doc);
  return { ok: true };
}
