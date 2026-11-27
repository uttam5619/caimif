/**
 * Static configuration and presentation constants for the public Collaborations page.
 * Decoupled from UI JSX to adhere to SRP and OCP.
 */
export const COLLABORATION_CONTENT_PREVIEW_LIMIT = 120;

export const COLLABORATION_SUMMARY_LABELS = {
  total: "Total Collaborations",
  international: "International",
  national: "National",
};

export const COLLABORATION_TABLE_HEADERS = [
  "FIRST PARTY",
  "SECOND PARTY",
  "DATE",
  "LEADING PERSON",
  "TYPE",
  "CONTENT",
] as const;
