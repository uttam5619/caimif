import type { ContactInfoItem } from "./types";

/**
 * Static Contact Us details and form metadata decoupled from UI components (SRP & OCP).
 */
export const GET_IN_TOUCH_HEADING = "Get In Touch";

export const GET_IN_TOUCH_ITEMS: ContactInfoItem[] = [
  {
    label: "Corporate Address",
    value:
      "Room 103 B, Block-2 First Floor, Sharda University Plot No. 32-34, Knowledge Park III, Greater Noida, Uttar Pradesh - 201310",
  },
  {
    label: "Email Us",
    value: "center.ai@sharda.ac.in",
    href: "mailto:center.ai@sharda.ac.in",
  },
  {
    label: "Call Us",
    value: "+91-9718930785",
    href: "tel:+919718930785",
  },
];

export const CONTACT_FORM_CONFIG = {
  heading: "Send Us A Message",
  fields: {
    name: { label: "Your Name", placeholder: "Your name" },
    email: { label: "Your Email", placeholder: "xyz@example.com" },
    subject: { label: "Subject", placeholder: "Subject" },
    message: { label: "Message", placeholder: "Write your message here..." },
  },
  submitLabel: "Send Message",
  successMessage:
    "Thank you for reaching out. Your message has been recorded.",
};
