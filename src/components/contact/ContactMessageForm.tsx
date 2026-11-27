"use client";

import React, { useState } from "react";
import { createContactInquiry } from "@/lib/api/contact.api";
import { CONTACT_FORM_CONFIG } from "./contact.config";
import type { ContactFormState } from "./types";

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

/**
 * ContactMessageForm Component
 *
 * Renders the "Send Us A Message" inquiry form on the right column
 * of the Contact Us card and persists submissions to `contact_inquiries`
 * via `POST /api/contact-inquiries`.
 */
export default function ContactMessageForm() {
  const [formState, setFormState] =
    useState<ContactFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (
    field: keyof ContactFormState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setSubmitted(false);
    }
    if (errorMsg) {
      setErrorMsg("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitted(false);

    const name = formState.name.trim();
    const email = formState.email.trim();
    const subject = formState.subject.trim();
    const message = formState.message.trim();

    if (!name || !email || !subject || !message) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = await createContactInquiry({
        name,
        email,
        subject,
        message,
      });
      if (!saved.id) {
        throw new Error("Failed to confirm message persistence.");
      }
      setFormState(INITIAL_FORM_STATE);
      setSubmitted(true);
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Unable to submit your message right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-zinc-200/90 bg-zinc-100/80 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:bg-zinc-900";

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {CONTACT_FORM_CONFIG.heading}
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {CONTACT_FORM_CONFIG.fields.name.label} *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formState.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            placeholder={CONTACT_FORM_CONFIG.fields.name.placeholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {CONTACT_FORM_CONFIG.fields.email.label} *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formState.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            placeholder={CONTACT_FORM_CONFIG.fields.email.placeholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {CONTACT_FORM_CONFIG.fields.subject.label} *
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            value={formState.subject}
            onChange={(event) =>
              handleFieldChange("subject", event.target.value)
            }
            placeholder={CONTACT_FORM_CONFIG.fields.subject.placeholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {CONTACT_FORM_CONFIG.fields.message.label} *
          </label>
          <textarea
            id="contact-message"
            rows={4}
            required
            value={formState.message}
            onChange={(event) =>
              handleFieldChange("message", event.target.value)
            }
            placeholder={CONTACT_FORM_CONFIG.fields.message.placeholder}
            className={inputClassName}
          />
        </div>

        {errorMsg && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300">
            {errorMsg}
          </p>
        )}

        {submitted && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300">
            {CONTACT_FORM_CONFIG.successMessage}
          </p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#1d4ed8] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e40af] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Sending..." : CONTACT_FORM_CONFIG.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
