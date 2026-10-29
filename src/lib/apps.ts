import { DRIVE, SHEETS } from "@/components/landing/DocumentVersions";
import type { WorkflowSlug } from "@/lib/workflows";

const composio = (slug: string) => `https://logos.composio.dev/api/${slug}`;

/** Icon for each app name used on the site. Product names, so not translated. */
export const appIcons: Record<string, string> = {
  Gmail: "/logos/gmail.svg",
  Outlook: "/logos/outlook.svg",
  WhatsApp: "/logos/whatsapp.svg",
  Zoho: "https://www.google.com/s2/favicons?domain=zoho.com&sz=64",
  Excel: "https://www.google.com/s2/favicons?domain=office.com&sz=64",
  Slack: composio("slack"),
  "Google Sheets": SHEETS,
  "Google Drive": DRIVE,
  "Google Docs": composio("googledocs"),
  "Google Calendar": composio("googlecalendar"),
  SharePoint: composio("share_point"),
  "Microsoft Teams": composio("microsoft_teams"),
  NetSuite: composio("netsuite"),
  Odoo: composio("odoo"),
  QuickBooks: composio("quickbooks"),
  Wati: composio("wati"),
  Docsumo: composio("docsumo"),
  Airtable: composio("airtable"),
  Notion: composio("notion"),
  Shopify: composio("shopify"),
  Canva: composio("canva"),
  Figma: composio("figma"),
  Miro: composio("miro"),
  Asana: composio("asana"),
  Jira: composio("jira"),
  Linear: composio("linear"),
  ClickUp: composio("clickup"),
  Zoom: composio("zoom"),
  Calendly: composio("calendly"),
  BigQuery: "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=64",
  "Business Central": "https://www.google.com/s2/favicons?domain=dynamics.microsoft.com&sz=64",
  Exa: "https://www.google.com/s2/favicons?domain=exa.ai&sz=64",
  Maersk: "/integrations/MAERSK-B.CO.svg",
  WeTransfer: composio("wetransfer"),
  Dropbox: composio("dropbox"),
  "Google Maps": composio("google_maps"),
  HubSpot: composio("hubspot"),
  Salesforce: composio("salesforce"),
  Mailchimp: composio("mailchimp"),
  Stripe: composio("stripe"),
  Zendesk: composio("zendesk")
};

/*
 * Per workflow: `core` is what the workflow itself reads or writes (from its
 * code); `more` is the rest of the connector catalogue (Composio, through Ask)
 * that fits the same team, split across the four pages so each shows a part.
 */
export const workflowApps: Record<WorkflowSlug, { core: string[]; more: string[] }> = {
  "supplier-followups": {
    core: ["Zoho", "Gmail", "Excel"],
    more: ["Outlook", "Google Sheets", "NetSuite", "Odoo", "QuickBooks", "Microsoft Teams", "WhatsApp", "Wati"]
  },
  "shipment-documents": {
    core: ["Gmail", "Outlook", "Zoho", "Excel", "Slack"],
    more: ["Google Drive", "SharePoint", "Docsumo", "QuickBooks", "NetSuite", "Airtable", "Google Docs"]
  },
  "production-planning": {
    core: ["Excel", "Zoho", "Gmail"],
    more: ["Google Sheets", "Odoo", "NetSuite", "Airtable", "Google Calendar", "Microsoft Teams", "Shopify", "Slack"]
  },
  "packaging-quality": {
    core: ["Gmail", "Google Sheets", "Slack"],
    more: ["Canva", "Figma", "Miro", "Asana", "Jira", "Linear", "ClickUp", "Notion", "Zoom", "Calendly"]
  },
  "export-shipments": {
    core: ["Gmail", "Outlook"],
    more: ["Maersk", "Google Maps", "Google Drive", "Dropbox", "WhatsApp", "Microsoft Teams"]
  },
  "production-sheets": {
    core: ["BigQuery"],
    more: ["Google Sheets", "Excel", "Google Drive", "Slack", "Microsoft Teams"]
  },
  "production-reconciliation": {
    core: ["Excel", "Gmail"],
    more: ["Google Sheets", "SharePoint", "Airtable", "Slack", "Microsoft Teams"]
  },
  replenishment: {
    core: ["Zoho", "Excel", "Gmail"],
    more: ["NetSuite", "Odoo", "QuickBooks", "Shopify", "Google Sheets"]
  },
  "customer-planning": {
    core: ["Zoho", "BigQuery", "Gmail"],
    more: ["HubSpot", "Salesforce", "Google Sheets", "Mailchimp", "Zendesk"]
  },
  "ceo-control-panel": {
    core: ["Business Central", "Outlook"],
    more: ["Stripe", "QuickBooks", "NetSuite", "Slack", "Google Calendar"]
  },
  "csr-monitor": {
    core: ["Exa", "Outlook"],
    more: ["Notion", "Google Docs", "SharePoint", "Slack"]
  },
  "packaging-specs": {
    core: ["Gmail", "Excel"],
    more: ["Google Drive", "Dropbox", "Canva", "Figma", "WeTransfer"]
  }
};
