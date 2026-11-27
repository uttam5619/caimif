import React from "react";
import ContactMessageForm from "./ContactMessageForm";
import GetInTouchInfo from "./GetInTouchInfo";

/**
 * ContactSection Component
 *
 * Combines institutional contact information (`GetInTouchInfo`) and
 * message inquiry form (`ContactMessageForm`) inside the Contact Us card.
 */
export default function ContactSection() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <GetInTouchInfo />
        <ContactMessageForm />
      </div>
    </div>
  );
}
