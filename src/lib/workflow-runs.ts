import { appIcons } from "@/lib/apps";
import type { WorkflowSlug } from "@/lib/workflows";

/*
 * "How it runs" for every workflow page: four screens, one per step in the
 * copy, each drawn from that workflow's real screen in the product (labels
 * are the product's own). Records, suppliers and figures are made up.
 *
 * Adding a workflow page = its copy under workflows.items.<slug>, its apps in
 * lib/apps.ts, and four screens here. WorkflowRun renders the rest.
 *
 * Each screen plays in three phases: 0 the screen as it lands, 1 ubik's
 * verdicts appear, 2 the result (sent, approved, moved).
 */

export type Tone = "ok" | "warn" | "bad" | "muted";
export type Pill = { text: string; tone: Tone };

export type ListScreen = {
  kind: "list";
  title: string;
  rows: { icon?: string; title: string; files?: string[]; meta?: string; pill: Pill; reason?: string }[];
  side?: { title: string; items: { label: string; before: Pill; after: Pill }[] };
};
export type CompareScreen = {
  kind: "compare";
  title: string;
  columns: string[];
  rows: { cells: string[]; verdict: Pill; flag?: number }[];
  finding?: { severity: string; text: string; owner: string; tone?: Tone };
};
export type DraftScreen = {
  kind: "draft";
  to: string;
  subject: string;
  body: string[];
  attached?: string;
  note: string;
  send: string;
  sent: string;
};
export type ApproveScreen = {
  kind: "approve";
  title: string;
  badge?: string;
  checks: string[];
  button: string;
  done: string;
  footnote?: string;
  side?: { title: string; icon?: string; rows: [string, string][]; button: string; done: string };
};
export type RunScreen = ListScreen | CompareScreen | DraftScreen | ApproveScreen;
export type WorkflowRunData = { app: string; ref: string; badges: string[]; screens: [RunScreen, RunScreen, RunScreen, RunScreen] };

const ok = (text: string): Pill => ({ text, tone: "ok" });
const warn = (text: string): Pill => ({ text, tone: "warn" });
const bad = (text: string): Pill => ({ text, tone: "bad" });
const muted = (text: string): Pill => ({ text, tone: "muted" });
const { Gmail, Zoho, Excel } = appIcons;

export const workflowRuns: Record<WorkflowSlug, WorkflowRunData> = {
  "supplier-followups": {
    app: "Supplier Update",
    ref: "Week 44",
    badges: ["Awaiting reply"],
    screens: [
      {
        kind: "list",
        title: "Weekly schedule",
        rows: [
          { icon: Gmail, title: "Supplier 214", files: ["Supplier 214 · open POs.xlsx"], pill: ok("Sent"), reason: "14 open POs" },
          { icon: Gmail, title: "Supplier 087", files: ["Supplier 087 · open POs.xlsx"], pill: ok("Sent"), reason: "6 open POs" },
          { icon: Gmail, title: "Supplier 311", pill: muted("Paused"), reason: "Paused suppliers never receive it" }
        ],
        side: {
          title: "Open PO book",
          items: [
            { label: "Synced from Zoho", before: muted("Last night"), after: ok("Today 06:00") },
            { label: "Suppliers active", before: muted("—"), after: ok("12") },
            { label: "In test", before: muted("—"), after: warn("2") }
          ]
        }
      },
      {
        kind: "list",
        title: "Supplier 214 · follow-ups",
        rows: [
          { icon: Gmail, title: "Weekly Schedule · W.I.P report", meta: "Mon 09:00", pill: ok("Sent") },
          { icon: Gmail, title: "Re: reminder", meta: "Wed 09:00 · no reply after 48 h", pill: warn("Reminder") },
          { icon: Gmail, title: "Re: escalation, level 1", meta: "Thu 09:00 · copies the account owner", pill: bad("Escalated") }
        ]
      },
      {
        kind: "compare",
        title: "Changes received",
        columns: ["PO", "Field", "Before", "After"],
        rows: [
          { cells: ["ZFPO-06106", "Production status", "50%", "70%"], verdict: ok("Changed"), flag: 3 },
          { cells: ["ZFPO-06106", "ETD", "12 Nov", "18 Nov"], verdict: bad("Moved"), flag: 3 },
          { cells: ["ZFPO-06111", "Container", "—", "MSKU 482 117 3"], verdict: ok("New"), flag: 3 },
          { cells: ["ZFPO-06120", "B/L", "—", "—"], verdict: muted("No change") }
        ],
        finding: { tone: "warn", severity: "Warning", text: "ETD moved six days. It goes in this week's change report.", owner: "Internal" }
      },
      {
        kind: "draft",
        to: "Supplier 214 · exports team",
        subject: "Re: Weekly Schedule · two POs to confirm",
        body: [
          "Hello,",
          "Thanks for the update. For ZFPO-06106 the ETD moved from 12 to 18 Nov. Can you confirm the vessel, and whether ZFPO-06120 has a B/L number yet?",
          "The two rows are attached."
        ],
        attached: "Selected POs.xlsx",
        note: "Ask supplier: only the rows you selected go out.",
        send: "Ask supplier",
        sent: "Sent · clarification reminder set"
      }
    ]
  },

  "shipment-documents": {
    app: "Document verification",
    ref: "ZFPO-06106",
    badges: ["Sailed", "Receiving"],
    screens: [
      {
        kind: "list",
        title: "Emails to file",
        rows: [
          { icon: Gmail, title: "Docs for ZFPO-06106", files: ["INV-7781.pdf", "PL-7781.xlsx", "BL draft.pdf"], pill: ok("Filed"), reason: "PO number printed on the invoice" },
          { icon: Gmail, title: "Health cert, lot 2207", files: ["HC_2207.pdf"], pill: warn("Needs confirmation"), reason: "Only a lot code matched." },
          { icon: Gmail, title: "Fwd: ISF worksheet", files: ["ISF 10+2.xlsx"], pill: ok("Filed"), reason: "PO number in the file name" }
        ],
        side: {
          title: "Checklist",
          items: [
            { label: "Commercial invoice", before: muted("Missing"), after: ok("Received") },
            { label: "Packing list", before: muted("Missing"), after: ok("Received") },
            { label: "Draft bill of lading", before: muted("Missing"), after: ok("Received") },
            { label: "Health certificate", before: muted("Missing"), after: warn("Partial") },
            { label: "Certificate of origin", before: muted("Missing"), after: muted("Missing") }
          ]
        }
      },
      {
        kind: "compare",
        title: "Critical comparison",
        columns: ["Field", "PO", "Invoice", "Packing list"],
        rows: [
          { cells: ["Cases", "1,200", "1,200", "1,200"], verdict: ok("Verified") },
          { cells: ["Net weight, kg", "21,600", "21,600", "21,450"], verdict: bad("Differs"), flag: 3 },
          { cells: ["Unit price, USD/kg", "7.80", "7.80", "—"], verdict: ok("Verified") },
          { cells: ["Invoice total, USD", "168,480", "168,480", "—"], verdict: ok("Verified") }
        ],
        finding: { severity: "Blocker", text: "Net weight: the documents disagree.", owner: "Supplier to fix" }
      },
      {
        kind: "draft",
        to: "Supplier 214 · exports team",
        subject: "ZFPO-06106: net weight on the packing list",
        body: [
          "Hello,",
          "The packing list for ZFPO-06106 shows 21,450 kg net. The invoice and the PO show 21,600 kg. Please send a corrected packing list, or confirm which figure is right."
        ],
        attached: "PL-7781.xlsx, INV-7781.pdf",
        note: "Drafted from this PO. Change anything before you send.",
        send: "Send email",
        sent: "Sent · logged under Emails sent from this PO"
      },
      {
        kind: "approve",
        title: "Approve verification",
        badge: "v2",
        checks: ["All required documents received", "Net weight corrected by the supplier", "No open blockers"],
        button: "Approve verification",
        done: "Approved · v2",
        footnote: "Approval registers document verification only. It does not authorise payment, create a bill or release a shipment.",
        side: {
          title: "Create the bill in Zoho",
          icon: Zoho,
          rows: [["Vendor", "Supplier 214"], ["Bill number", "INV-7781"], ["Lines", "3, matched to the PO"], ["Total", "USD 168,480.00"], ["Terms", "PO Net 30 · invoice Net 30"]],
          button: "Create bill",
          done: "Bill created in Zoho"
        }
      }
    ]
  },

  "production-planning": {
    app: "Planning",
    ref: "November plan",
    badges: ["Synced from Zoho"],
    screens: [
      {
        kind: "list",
        title: "Versions",
        rows: [
          { icon: Excel, title: "Production plan Nov.xlsx", meta: "Uploaded Mon 10:12 · 38 loads", pill: ok("v1") },
          { icon: Excel, title: "Cell edit: L-2207 cases 1,800 → 1,650", meta: "Tue 15:40 · audit row written", pill: ok("v2") },
          { icon: Zoho, title: "Production progress", meta: "Daily · from Zoho", pill: ok("Synced") }
        ],
        side: {
          title: "Plan health",
          items: [
            { label: "Safe", before: muted("—"), after: ok("29") },
            { label: "Watch", before: muted("—"), after: warn("6") },
            { label: "At risk", before: muted("—"), after: bad("2") },
            { label: "Critical", before: muted("—"), after: bad("1") }
          ]
        }
      },
      {
        kind: "compare",
        title: "RM requirement",
        columns: ["Load", "Planned lbs", "Cases left", "Headless MT"],
        rows: [
          { cells: ["L-2201", "42,000", "120", "1.4"], verdict: ok("Safe") },
          { cells: ["L-2204", "40,000", "940", "9.8"], verdict: warn("Watch"), flag: 2 },
          { cells: ["L-2207", "44,000", "1,650", "17.2"], verdict: bad("At risk"), flag: 2 },
          { cells: ["L-2210", "38,000", "0", "0.0"], verdict: muted("Finished") }
        ],
        finding: { tone: "warn", severity: "At risk", text: "L-2207 needs 17.2 MT of headless raw material in 9 days.", owner: "Planning" }
      },
      {
        kind: "list",
        title: "Follow-up",
        rows: [
          { title: "SO-1182 · L-2204", meta: "96% produced · no container · 6 days", pill: bad("Follow up") },
          { title: "SO-1190 · L-2209", meta: "91% produced · no container · 5 days", pill: bad("Follow up") },
          { title: "PO 88213", meta: "In production, in no plan", pill: warn("Outside the plan") }
        ]
      },
      {
        kind: "draft",
        to: "Plant team · weekly",
        subject: "Weekly planning report · Plant 1 · week 45",
        body: ["Loads at risk: L-2207, short 17.2 MT headless.", "Two POs are over 90% produced with no container for five days or more.", "One PO is in production but in no plan."],
        attached: "plant-1-2026-11-planning.xlsx",
        note: "Goes every week. On the 15th the mid-month report replaces it.",
        send: "Preview report",
        sent: "Sent · delivery status: sent"
      }
    ]
  },

  "packaging-quality": {
    app: "Packaging Tracker",
    ref: "Combined",
    badges: ["Chase"],
    screens: [
      {
        kind: "list",
        title: "Inbox",
        rows: [
          { icon: Gmail, title: "Re: dieline for 2 kg master carton", files: ["MC-2kg_dieline_v3.pdf"], pill: ok("Packaging task"), reason: "Dieline, owner from the thread" },
          { icon: Gmail, title: "Q-Mark audit dates", pill: muted("Not packaging"), reason: "Q-Mark and BAP labels are left out" },
          { icon: Gmail, title: "New allergen line on inner bag", files: ["inner-bag_v2.ai"], pill: ok("Packaging task"), reason: "Label change, deadline Friday" }
        ]
      },
      {
        kind: "compare",
        title: "Tasks",
        columns: ["Task", "Owner", "Waiting on", "Deadline"],
        rows: [
          { cells: ["2 kg master carton dieline", "Priya", "Printer", "EOD"], verdict: ok("On track") },
          { cells: ["Inner bag allergen line", "Ravi", "Customer", "Fri"], verdict: warn("Chase"), flag: 2 },
          { cells: ["Retail sleeve reprint", "Asha", "Tracked team", "6 days ago"], verdict: bad("Critical"), flag: 3 }
        ],
        finding: { severity: "Escalated", text: "Retail sleeve reprint: six business days with no reply from us.", owner: "Owner" }
      },
      {
        kind: "approve",
        title: "Chase the customer",
        badge: "+3 working days",
        checks: ["Our reply went out Monday", "No answer from the customer since", "Second prompt at +7, auto-close at +15"],
        button: "Open in Gmail",
        done: "Reminder sent from Gmail · detected",
        footnote: "ubik prompts the owner to chase. The owner sends it; ubik sees it in the thread."
      },
      {
        kind: "approve",
        title: "Confirm close",
        checks: ["Closure evidence: the printer's proof approved in the thread", "Attachment: inner-bag_v3_final.ai", "Customer replied “approved, go ahead”"],
        button: "Confirm close",
        done: "Done · resolution note saved",
        side: { title: "Close reason", rows: [["Reason", "Handed to printer"], ["Evidence", "Thread 18 Oct, 14:02"], ["Reopens if", "The customer replies again"]], button: "Save", done: "Saved" }
      }
    ]
  },

  "export-shipments": {
    app: "Shipments",
    ref: "SHP-0412",
    badges: ["Draft BL Review", "Attention"],
    screens: [
      {
        kind: "list",
        title: "Inbox",
        rows: [
          { icon: Gmail, title: "Booking confirmation MSK 2841", files: ["BKG_2841.pdf"], pill: ok("Booking Confirmed"), reason: "Booking number matched" },
          { icon: Gmail, title: "SI and VGM submitted", pill: ok("SI and VGM"), reason: "Container MSKU 482 117 3" },
          { icon: Gmail, title: "Draft BL attached", files: ["Draft_BL_2841.pdf"], pill: warn("Needs review"), reason: "Confidence 0.81, under 0.92" }
        ],
        side: {
          title: "Stage",
          items: [
            { label: "Booking Confirmed", before: muted("Waiting"), after: ok("Done") },
            { label: "SI and VGM", before: muted("Waiting"), after: ok("Done") },
            { label: "Draft BL Review", before: muted("Waiting"), after: warn("Now") }
          ]
        }
      },
      {
        kind: "compare",
        title: "Draft BL review",
        columns: ["Field", "SI", "Draft B/L"],
        rows: [
          { cells: ["Consignee", "Northbay Foods", "Northbay Foods"], verdict: ok("Matches") },
          { cells: ["Container", "MSKU 482 117 3", "MSKU 482 117 3"], verdict: ok("Matches") },
          { cells: ["HS code", "0306.17", "0306.16"], verdict: bad("Differs"), flag: 2 },
          { cells: ["Net weight, kg", "21,600", "21,600"], verdict: ok("Matches") }
        ],
        finding: { severity: "Blocked", text: "HS code on the draft B/L disagrees with the SI.", owner: "Forwarder" }
      },
      {
        kind: "draft",
        to: "Forwarder · documentation desk",
        subject: "SHP-0412 · draft BL corrections",
        body: ["Hello,", "Please correct the HS code on the draft B/L for MSK 2841 from 0306.16 to 0306.17, as per the SI. Everything else is approved."],
        note: "Draft, approve, then send. The sent copy becomes evidence.",
        send: "Approve and send",
        sent: "Sent · waiting on forwarder"
      },
      {
        kind: "approve",
        title: "Draft BL Approved",
        checks: ["Corrected draft received", "HS code now matches the SI", "Stage moves on evidence. Nobody drags the card."],
        button: "Accept evidence",
        done: "Moved to Draft BL Approved",
        side: { title: "Next", rows: [["Stage", "OBL Received"], ["Waiting on", "Carrier"], ["Health", "On track"]], button: "Open board", done: "On track" }
      }
    ]
  },

  "production-sheets": {
    app: "Capture",
    ref: "Plant 1 · Shift A",
    badges: ["What's owed"],
    screens: [
      {
        kind: "list",
        title: "What's owed",
        rows: [
          { title: "Grading sheet · Shift A", meta: "Photographed 08:14", pill: ok("Saved") },
          { title: "Soaking sheet · Shift A", meta: "Due by 10:00", pill: warn("Still due") },
          { title: "Value addition · Shift B", meta: "Explained: line down for cleaning", pill: muted("Explained") }
        ]
      },
      {
        kind: "compare",
        title: "Grading sheet · read",
        columns: ["Row", "Engine A", "Engine B", "Row total"],
        rows: [
          { cells: ["Row 12", "418", "418", "Adds up"], verdict: ok("Read") },
          { cells: ["Row 13", "392", "392", "Adds up"], verdict: ok("Read") },
          { cells: ["Row 14", "376", "316", "Off by 60"], verdict: bad("Check"), flag: 2 },
          { cells: ["Row 15", "", "", "Empty"], verdict: warn("Check") }
        ],
        finding: { severity: "Failed arithmetic", text: "Row 14: the engines disagree and the row does not add up.", owner: "Operator" }
      },
      {
        kind: "list",
        title: "Flagged cells",
        rows: [
          { title: "Row 14 · 26/30 count", meta: "Operator: 376, from the sheet", pill: ok("Fixed") },
          { title: "Row 15 · 31/40 count", meta: "Operator: no fish in this grade today", pill: ok("Fixed") }
        ],
        side: { title: "Order", items: [{ label: "Failed arithmetic", before: bad("1"), after: ok("0") }, { label: "Engines disagree", before: warn("1"), after: ok("0") }, { label: "Empty cell", before: warn("1"), after: ok("0") }] }
      },
      {
        kind: "approve",
        title: "Publish these figures to the warehouse?",
        checks: ["Every flagged cell fixed by the operator", "Two corrections, each with a reason", "Totals add up"],
        button: "Approve",
        done: "Published",
        side: { title: "Data", icon: appIcons.BigQuery, rows: [["Table", "production_grading"], ["Rows", "48"], ["Shift", "A · 30 Oct"]], button: "Open data", done: "In the warehouse" }
      }
    ]
  },

  "production-reconciliation": {
    app: "Production Reconciliation",
    ref: "Plant 1 · 29 Oct",
    badges: ["Waiting on plant"],
    screens: [
      {
        kind: "list",
        title: "Today's reports",
        rows: [
          { icon: Excel, title: "Grading Report", files: ["grading_29-10.xlsx"], pill: ok("Approved") },
          { icon: Excel, title: "Value Addition Report", files: ["va_29-10.xlsx"], pill: ok("Approved") },
          { icon: Excel, title: "Soaking + Production Report", files: ["soak_prod_29-10.xlsx"], pill: warn("Review"), reason: "Every figure links to its cell" }
        ]
      },
      {
        kind: "compare",
        title: "Yield check",
        columns: ["Stage", "In, kg", "Out, kg", "Yield"],
        rows: [
          { cells: ["Grading", "12,400", "12,160", "98.1%"], verdict: ok("In policy") },
          { cells: ["Peeling", "12,160", "7,420", "61.0%"], verdict: bad("Below 64%"), flag: 3 },
          { cells: ["Soaking", "7,420", "7,980", "107.5%"], verdict: ok("In policy") }
        ],
        finding: { severity: "Open", text: "Peeling yield 61.0% against a policy floor of 64%.", owner: "Plant" }
      },
      {
        kind: "draft",
        to: "Plant 1 · production manager",
        subject: "29 Oct · peeling yield below policy",
        body: ["Hello,", "Peeling yield on 29 Oct was 61.0% against a floor of 64%. Please fill in root cause, corrective action, owner and due date in the attached sheet."],
        attached: "clarification_29-10.xlsx",
        note: "Drafted by ubik. You pick the findings and edit before sending.",
        send: "Send clarification",
        sent: "Sent · reply parsed: root cause, owner, due date"
      },
      {
        kind: "approve",
        title: "Send the tallying report",
        checks: ["All three reports approved", "Plant's explanation accepted", "Figures unchanged since the draft"],
        button: "Send to plant",
        done: "Sent to plant",
        side: { title: "Attachment", icon: Excel, rows: [["File", "Plant1_Vannamei_Grade_Wise_Tallying_29-10.xlsx"], ["Grades", "14"]], button: "Preview", done: "Attached" }
      }
    ]
  },

  replenishment: {
    app: "Replenishment",
    ref: "Week 45",
    badges: ["Recommendations"],
    screens: [
      {
        kind: "list",
        title: "Sources",
        rows: [
          { icon: Zoho, title: "Stock and open POs", meta: "ERP · this morning", pill: ok("Read") },
          { icon: Excel, title: "Forecast Q4.xlsx", meta: "Uploaded Monday", pill: ok("Read") },
          { icon: Gmail, title: "ETD and ETA", meta: "From supplier updates", pill: ok("Read") }
        ]
      },
      {
        kind: "compare",
        title: "Recommendation queue",
        columns: ["Item", "On hand", "On the water", "8-week need"],
        rows: [
          { cells: ["Vannamei 26/30 · 2 kg", "1,200", "800", "3,900"], verdict: bad("Reorder"), flag: 3 },
          { cells: ["Vannamei 31/40 · 2 kg", "2,600", "1,600", "3,700"], verdict: muted("No order") },
          { cells: ["Black tiger 16/20 · 1 kg", "300", "0", "320"], verdict: warn("Watch") },
          { cells: ["PD tail-on 21/25", "4,100", "1,200", "2,400"], verdict: warn("Excess") }
        ],
        finding: { severity: "Shortage", text: "26/30 runs out in week 49 unless a container ships by 20 Nov.", owner: "Purchasing" }
      },
      {
        kind: "approve",
        title: "Approve adjusted",
        badge: "26/30 · 2 kg",
        checks: ["Recommended: 2 containers, 3,200 cases", "Adjusted to 2 containers, 3,000 cases", "Reason: buyer moved 200 cases to December"],
        button: "Approve adjusted",
        done: "Approved · action draft written"
      },
      {
        kind: "draft",
        to: "Purchasing team",
        subject: "Action draft · Vannamei 26/30 · 2 kg",
        body: ["Prepare 2 containers, 3,000 cases, for week 49 arrival.", "Supplier: Supplier 214. Latest ETD reported: 18 Nov."],
        note: "Nothing is sent to suppliers. A person places the order.",
        send: "Copy draft",
        sent: "Copied"
      }
    ]
  },

  "customer-planning": {
    app: "Customer Planning",
    ref: "All customers",
    badges: ["Synced from Zoho"],
    screens: [
      {
        kind: "list",
        title: "Customers",
        rows: [
          { title: "Northbay Foods", meta: "11 open orders", pill: bad("2 late") },
          { title: "Harbour Fresh", meta: "7 open orders", pill: ok("On plan") },
          { title: "Coastline Retail", meta: "4 open orders", pill: warn("1 not issued") }
        ]
      },
      {
        kind: "compare",
        title: "Northbay Foods · open orders",
        columns: ["AZ#", "SO#", "Item", "Produced"],
        rows: [
          { cells: ["AZ-5521", "SO-1182", "26/30 · 2 kg", "96%"], verdict: warn("No container") , flag: 3 },
          { cells: ["AZ-5530", "SO-1190", "31/40 · 2 kg", "40%"], verdict: bad("Late"), flag: 3 },
          { cells: ["AZ-5533", "—", "16/20 · 1 kg", "0%"], verdict: muted("SO not issued") }
        ],
        finding: { tone: "warn", severity: "Insight", text: "Two Northbay orders are behind the ship date the buyer was given.", owner: "Sales" }
      },
      {
        kind: "draft",
        to: "Sales and planning",
        subject: "Order book · week 45",
        body: ["Northbay Foods: 2 of 11 orders late, SO-1190 at 40% with 9 days to ship.", "Coastline Retail: 1 item has no sales order issued."],
        note: "Preview never sends.",
        send: "Preview",
        sent: "Preview ready"
      },
      {
        kind: "approve",
        title: "Weekly order-book brief",
        checks: ["Off until an admin turns it on", "Goes every Monday to the people you list", "Same view as the page, nothing extra"],
        button: "Turn on",
        done: "On · Mondays 08:00"
      }
    ]
  },

  "ceo-control-panel": {
    app: "CEO Control Panel",
    ref: "Thu 30 Oct",
    badges: ["Snapshot 02:00"],
    screens: [
      {
        kind: "list",
        title: "Exceptions",
        rows: [
          { icon: appIcons["Business Central"], title: "Receivables over 60 days up 18%", meta: "Since yesterday", pill: bad("Worsened") },
          { icon: appIcons["Business Central"], title: "Margin on PO 4471 below 12%", meta: "First seen today", pill: warn("New") },
          { icon: appIcons["Business Central"], title: "Stock count variance, cold store 2", meta: "Snoozed until today", pill: muted("Reminder") }
        ]
      },
      {
        kind: "compare",
        title: "Collections",
        columns: ["Customer", "Due", "Promised"],
        rows: [
          { cells: ["Customer A", "EUR 84,200", "28 Oct"], verdict: bad("Missed promise"), flag: 2 },
          { cells: ["Customer B", "EUR 31,000", "5 Nov"], verdict: ok("Promised") },
          { cells: ["Customer C", "EUR 12,750", "—"], verdict: warn("No response") },
          { cells: ["Customer D", "EUR 9,400", "—"], verdict: bad("Disputed") }
        ],
        finding: { severity: "Missed", text: "Customer A promised EUR 84,200 by 28 Oct. Nothing has arrived.", owner: "Finance" }
      },
      {
        kind: "draft",
        to: "CEO",
        subject: "Brief · jeudi 30 octobre",
        body: ["1 exception worsened, 1 new, 1 reminder.", "Customer A missed a payment promise of EUR 84,200.", "Margin on PO 4471 is 11.4%."],
        note: "07:00 Paris, French or English. Off until switched on.",
        send: "Preview brief",
        sent: "Sent 07:00 from Outlook"
      },
      {
        kind: "approve",
        title: "Receivables over 60 days",
        badge: "Worsened",
        checks: ["Customer A accounts for 71% of the rise", "Finance owns the follow-up", "Comes back tomorrow if it worsens again"],
        button: "Acknowledge",
        done: "Acknowledged",
        side: { title: "Or", rows: [["Snooze", "Until Monday"], ["Resolve", "With a note"]], button: "Snooze", done: "Snoozed" }
      }
    ]
  },

  "csr-monitor": {
    app: "CSR Monitor",
    ref: "Week 44",
    badges: ["Sweep done"],
    screens: [
      {
        kind: "list",
        title: "Regulatory monitor",
        rows: [
          { icon: appIcons.Exa, title: "EU deforestation regulation, guidance update", meta: "europa.eu · full text", pill: ok("Fact") },
          { icon: appIcons.Exa, title: "Fishery improvement project closes in Andhra", meta: "Trade press · snippet", pill: ok("Fact") },
          { icon: appIcons.Exa, title: "Retailer to drop farmed shrimp, says headline", meta: "Title only, page behind a login", pill: warn("Unverified") }
        ]
      },
      {
        kind: "compare",
        title: "Benchmark watch",
        columns: ["Peer", "Claim", "Source"],
        rows: [
          { cells: ["Peer A", "100% ASC by 2027", "Annual report"], verdict: ok("Verified") },
          { cells: ["Peer B", "Scope 3 baseline published", "Press release"], verdict: ok("Verified") },
          { cells: ["Peer C", "Ends sourcing from region X", "Headline only"], verdict: warn("Unverified"), flag: 1 }
        ],
        finding: { tone: "warn", severity: "Medium", text: "A title-only source can never be stated as fact, and tops out at medium.", owner: "Rule" }
      },
      {
        kind: "list",
        title: "Certification tracker",
        rows: [
          { title: "BAP · Plant 1", meta: "Expires 14 Jan", pill: warn("75 days") },
          { title: "ASC · Supplier 087", meta: "Expires 02 Mar", pill: ok("Valid") },
          { title: "BRCGS · Cold store", meta: "Expired 20 Oct", pill: bad("Expired") }
        ]
      },
      {
        kind: "draft",
        to: "Sustainability team",
        subject: "CSR memo · week 44",
        body: ["Act: BRCGS for the cold store lapsed on 20 Oct.", "Watch: EU deforestation guidance changes the due-diligence statement for Q1.", "Unverified: one retailer headline, kept out of the summary."],
        note: "One model call writes the prose. Severity and actions are rules.",
        send: "Share memo",
        sent: "Shared by link"
      }
    ]
  },

  "packaging-specs": {
    app: "Packaging Specifications",
    ref: "France · Supplier 214",
    badges: ["Completeness 82%"],
    screens: [
      {
        kind: "list",
        title: "Register",
        rows: [
          { title: "France", meta: "6 suppliers · 41 SKUs", pill: ok("Country") },
          { title: "Supplier 214", meta: "12 SKUs", pill: ok("Supplier") },
          { title: "Vannamei 26/30 · 2 kg", meta: "4 layers", pill: ok("SKU") }
        ]
      },
      {
        kind: "compare",
        title: "Vannamei 26/30 · 2 kg · layers",
        columns: ["Layer", "Spec", "Photo"],
        rows: [
          { cells: ["Inner bag", "PE 80 µm, 2 kg", "inner_bag.jpg"], verdict: ok("Complete") },
          { cells: ["Inner carton", "5-ply, 6 × 2 kg", "inner_ctn.jpg"], verdict: ok("Complete") },
          { cells: ["Master carton", "7-ply, 12 kg", "—"], verdict: warn("No photo"), flag: 2 },
          { cells: ["Pallet", "—", "—"], verdict: bad("Missing") }
        ],
        finding: { tone: "warn", severity: "Incomplete", text: "Master carton has no photo. Pallet has no spec.", owner: "Supplier" }
      },
      {
        kind: "list",
        title: "Photos",
        rows: [
          { icon: Gmail, title: "master_ctn_front.jpg", meta: "From Supplier 214, Tue", pill: ok("Attached") },
          { icon: Gmail, title: "pallet_pattern.pdf", meta: "From Supplier 214, Tue", pill: ok("Attached") }
        ],
        side: { title: "Completeness", items: [{ label: "Vannamei 26/30 · 2 kg", before: warn("50%"), after: ok("100%") }, { label: "Supplier 214", before: warn("74%"), after: ok("82%") }] }
      },
      {
        kind: "approve",
        title: "Spec sheet",
        badge: "26/30 · 2 kg",
        checks: ["Four layers, each with a spec", "A photo for every layer", "Supplier and country on record"],
        button: "Export",
        done: "Exported"
      }
    ]
  }
};
