import type { WorkflowSlug } from "@/lib/workflows";

/*
 * ASCII mascots for the workflow card loaders: each card shows its own
 * object while the noise around it clears (AsciiSkeleton `art`). Kept to
 * 22 columns by 7 rows so they fit the 32 by 14 field. Workflows without one
 * get plain noise.
 */
export const workflowMascots: Partial<Record<WorkflowSlug, string[]>> = {
  "supplier-followups": [
    "        |~",
    "   _____|_____",
    " _|[][][][][]|___",
    " \\  o   o   o   /",
    "~~~~~~~~~~~~~~~~~~~~"
  ],
  "shipment-documents": [
    " _________",
    "| PO-2481 |\\",
    "| ======= |_\\",
    "| ------v  |",
    "| ------v  |",
    "| ------x  |",
    "|__________|"
  ],
  "production-planning": [
    "   _    _",
    "  | |  | |___",
    " _|_|__|_|___|___",
    "|  []  []  []  []|",
    "|_____|=|________|"
  ],
  "packaging-quality": [
    "    _________",
    "   /        /|",
    "  /________/ |",
    "  | 2 kg   | |",
    "  | [====] | /",
    "  |________|/"
  ]
};
