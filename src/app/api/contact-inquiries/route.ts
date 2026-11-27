import type { NextRequest } from "next/server";
import { contactController } from "@/server/modules/contact/contact.controller";

/**
 * GET /api/contact-inquiries
 * Lists paginated contact inquiries for authorized admin roles.
 */
export async function GET(request: NextRequest) {
  return contactController.listInquiries(request);
}

/**
 * POST /api/contact-inquiries
 * Persists a newly submitted contact inquiry.
 */
export async function POST(request: NextRequest) {
  return contactController.createInquiry(request);
}
