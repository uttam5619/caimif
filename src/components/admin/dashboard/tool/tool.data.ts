import type { ToolTabItem } from "./types";

/**
 * Four-tab definitions for the Tool dashboard section.
 * Decoupled from ToolView JSX to adhere to SRP and OCP.
 */
export const TOOL_TABS: ToolTabItem[] = [
  {
    id: "tools",
    label: "List of Tools",
  },
  {
    id: "categories",
    label: "List of Tool Category",
  },
  {
    id: "add-category",
    label: "Add Tool Category",
  },
  {
    id: "add-tool",
    label: "Add Tool",
  },
];
