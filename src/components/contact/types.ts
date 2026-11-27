/**
 * Data contracts for the Contact Us page components.
 */

export interface ContactInfoItem {
  label: string;
  value: string;
  href?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
