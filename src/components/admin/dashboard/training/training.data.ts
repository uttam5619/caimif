import type { TrainingTabItem } from "./types";

/**
 * Tab definitions for the Training dashboard section.
 * Decoupled from TrainingView to separate presentation data from UI JSX.
 */
export const TRAINING_TABS: TrainingTabItem[] = [
  {
    id: "list",
    label: "List of Trainings",
  },
  {
    id: "add",
    label: "Add Training",
  },
];
