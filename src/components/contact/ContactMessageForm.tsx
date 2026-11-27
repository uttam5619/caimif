"use client";

import React, { useState } from "react";
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
 * of the Contact Us card.
 */
export default function ContactMessageForm() {
  const [formState, setFormState] =
    useState<ContactFormState>(INITIAL_FORM_STATE);
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (
    field: keyof ContactFormState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState(INITIAL_FORM_STATE);
    setSubmitted(true);
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

        {submitted && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300">
            {CONTACT_FORM_CONFIG.successMessage}
          </p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            className="rounded-lg bg-[#1d4ed8] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#1e40af] cursor-pointer"
          >
            {CONTACT_FORM_CONFIG.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
