import type { NextRequest } from "next/server";
import { contactController } from "@/server/modules/contact/contact.controller";

interface ContactInquiryRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/contact-inquiries/[id]
 * Deletes a contact inquiry record for authorized admin roles.
 */
export async function DELETE(
  request: NextRequest,
  context: ContactInquiryRouteContext
) {
  const { id } = await context.params;
  return contactController.deleteInquiry(request, id);
}
