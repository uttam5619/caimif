import React from "react";
import ContactSection from "@/components/contact/ContactSection";

/**
 * Contact Us Page Component (`/contectus`)
 *
 * Thin route orchestrator composing `ContactSection` from `src/components/contact/`.
 */
export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen py-8 sm:py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </div>
    </div>
  );
}
