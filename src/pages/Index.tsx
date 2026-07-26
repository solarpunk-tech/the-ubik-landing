import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { ParticleField } from "@/components/landing/ParticleField";
import { DitherTile } from "@/components/landing/DitherTile";
import { featuredBlogPost } from "@/lib/landing-content";
import { externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";

/* The loop verb lives on the card chip, not in a caption strip above the grid.
   One occurrence each: the chip labels its own card, so a separate
   Remember/Reason/Act line would have restated it a second time. */
const ubikLayers = [
  [
    "01",
    "Remember",
    "Organisational memory",
    "Every decision, in your database.",
    "memory"
  ],
  [
    "02",
    "Reason",
    "Operating intelligence",
    "Models trained on your trade lanes.",
    "intelligence"
  ],
  [
    "03",
    "Act",
    "Agentic workflows",
    "Humans move out of loops to do better work.",
    "agents"
  ]
] as const;

const workOutputs = [
  {
    label: "Vendor replies",
    status: "4 replied",
    title: "Packaging vendors replied",
    copy: "One reviewed update went to every raw-material vendor. Replies are logged against the same programme.",
    system: "Gmail",
    view: "reply"
  },
  {
    label: "Shipment tracker",
    status: "Route found",
    title: "A faster lane surfaced",
    copy: "The booked Maersk route stays visible while Ubik prices a lower-cost alternative across the same two points.",
    system: "Carrier + shipment tracker",
    view: "route"
  },
  {
    label: "Approval",
    status: "Approved",
    title: "Manager decisions are in",
    copy: "Leadership sees what was delegated, who approved it in their Ubik, and the trade-off each manager accepted.",
    system: "Leadership view",
    view: "approval"
  },
  {
    label: "ETA watch",
    status: "Monitoring",
    title: "ETA exceptions stay covered",
    copy: "The live watch separates healthy promises from shipments that need review before the next buyer update.",
    system: "Fulfilment · live",
    view: "eta"
  }
] as const;

type TeamCompany = {
  label: string;
  domain?: string;
  logo?: string;
};

const teamCompanies: readonly TeamCompany[] = [
  { label: "AZ Gems", domain: "azgems.com" },
  { label: "Sandhya Aqua", logo: "https://sandhyaaqua.com/wp-content/uploads/2020/07/SA-Logo.png" },
  { label: "Dr. Reddy's", domain: "drreddys.com" },
  { label: "Airtel", domain: "airtel.in" },
  { label: "Udaan", domain: "udaan.com" },
  { label: "Ola", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Ola_Cabs_logo.svg" },
  { label: "Walmart", domain: "walmart.com" },
  { label: "Whole Foods Market", domain: "wholefoodsmarket.com" },
  { label: "Costco", domain: "costco.com" },
  { label: "AquaExchange", domain: "aquaexchange.com" },
  { label: "ClearTax", domain: "cleartax.in" },
  { label: "Arintra", domain: "arintra.com" },
  { label: "Lumian", domain: "lumian.ai" },
  { label: "Housing", domain: "housing.com" }
] as const;

// Every row carries a list of interchangeable tools rather than one logo: real
// operators run Gmail *or* Outlook, SAP *or* Oracle *or* Odoo. The source panel
// cycles them so the stack reads as "whatever you already use".
const workflowTeams = [
  {
    number: "01",
    team: "Sales Operations",
    shortTeam: "Sales Ops",
    sourceLine: "Inbox, chat and CRM",
    apps: [
      { label: "Buyer email", alts: ["gmail.com", "outlook.com"], status: "Matched" },
      { label: "Buyer chat", alts: ["whatsapp.com", "slack.com"], status: "Live" },
      { label: "CRM promise", alts: ["salesforce.com", "hubspot.com", "odoo.com"], status: "Updated" }
    ],
    entity: "Buyer promise / SO-29481",
    validTime: "29 JUL · 12:00",
    knownTime: "19 JUL · 10:06",
    memoryLabel: "PROMISE HISTORY",
    links: ["Buyer", "SKU", "Lane", "Margin"],
    resultLabel: "PROMISE WATCH",
    outcomeTitle: "Buyer update",
    resultTitle: "3 promises recalculated",
    resultDetail: "Retail buyer replies are ready with the revised ETA attached.",
    kind: "promise",
    chart: "line",
    stats: [["Ready", "03"], ["At risk", "01"], ["Sent", "07"]]
  },
  {
    number: "02",
    team: "Warehouse & Inventory",
    shortTeam: "Warehouse & Inventory",
    sourceLine: "ERP, warehouse and BI",
    apps: [
      { label: "ERP stock", alts: ["sap.com", "oracle.com", "zoho.com", "odoo.com"], status: "Synced" },
      { label: "Warehouse", alts: ["manh.com", "blueyonder.com"], status: "Checked" },
      { label: "BI dashboard", alts: ["powerbi.microsoft.com", "tableau.com", "metabase.com"], status: "Read" }
    ],
    entity: "Lot allocation / LOT-87",
    validTime: "18 JUL · 14:20",
    knownTime: "19 JUL · 08:16",
    memoryLabel: "ALLOCATION MEMORY",
    links: ["Lot 87", "Warehouse", "Expiry", "Order"],
    resultLabel: "LOT READINESS",
    outcomeTitle: "Allocation plan",
    resultTitle: "12.4 MT ready",
    resultDetail: "Four frozen lots across two warehouses can cover the order.",
    kind: "inventory",
    chart: "bars",
    stats: [["Lots", "04"], ["Warehouses", "02"], ["Shortfall", "0"]]
  },
  {
    number: "03",
    team: "Compliance & Quality",
    shortTeam: "Compliance & Quality",
    sourceLine: "Regulator feeds + certificates",
    apps: [
      { label: "Import alerts", alts: ["fda.gov", "europa.eu"], status: "Watched" },
      { label: "Certification", alts: ["bapcertification.org", "asc-aqua.org", "globalgap.org"], status: "Valid" },
      { label: "Health certificate", alts: ["docusign.com", "adobe.com"], status: "Extracted" }
    ],
    entity: "Health certificate / Lot 87",
    validTime: "17 JUL · 06:00",
    knownTime: "19 JUL · 09:42",
    memoryLabel: "DOCUMENT INTELLIGENCE",
    links: ["Lot 87", "Supplier", "Destination", "Certificate"],
    resultLabel: "LOT TRACEABILITY",
    outcomeTitle: "Quality release",
    resultTitle: "12 lots cleared",
    resultDetail: "Health certificate, BAP proof and FDA lane evidence agree before release.",
    kind: "traceability",
    chart: "heatmap",
    stats: [["Cleared", "12"], ["Review", "02"], ["Blocked", "00"]]
  },
  {
    number: "04",
    team: "Packaging",
    shortTeam: "Packaging",
    sourceLine: "Artwork, specs and policy",
    apps: [
      { label: "Artwork files", alts: ["adobe.com", "figma.com"], status: "Extracted" },
      { label: "Buyer spec", alts: ["dropbox.com", "box.com", "sharepoint.com"], status: "Compared" },
      { label: "Packaging policy", alts: ["notion.so", "atlassian.com"], status: "Applied" }
    ],
    entity: "Pack spec / SKU-4471",
    validTime: "21 JUL · 09:00",
    knownTime: "19 JUL · 11:24",
    memoryLabel: "REVISION CONTROL",
    links: ["Buyer", "Carton", "Lots", "Rule"],
    resultLabel: "MATERIAL RULE",
    outcomeTitle: "Packaging override",
    resultTitle: "18 lots affected",
    resultDetail: "The approved carton spec keeps compliant production moving.",
    kind: "override",
    chart: "steps",
    stats: [["Detected", "18"], ["Reviewed", "18"], ["Cleared", "16"]]
  },
  {
    number: "05",
    team: "Procurement",
    shortTeam: "Procurement",
    sourceLine: "Supplier mail and sourcing",
    apps: [
      { label: "Supplier email", alts: ["outlook.com", "gmail.com"], status: "Parsed" },
      { label: "Sourcing", alts: ["coupa.com", "ariba.com", "zycus.com"], status: "Compared" },
      { label: "Vendor certs", alts: ["docusign.com", "dropbox.com"], status: "Checked" }
    ],
    entity: "Supplier promise / PKG-2841",
    validTime: "22 JUL · 17:00",
    knownTime: "19 JUL · 14:38",
    memoryLabel: "SUPPLIER PROJECT",
    links: ["Vendor", "MOQ", "Material", "Plan"],
    resultLabel: "VENDOR COMPARISON",
    outcomeTitle: "Supplier choice",
    resultTitle: "4 replies matched",
    resultDetail: "Cost, MOQ, certification, and lead time resolve into one choice.",
    kind: "vendors",
    chart: "funnel",
    stats: [["Replies", "04"], ["Qualified", "03"], ["Recommended", "01"]]
  },
  {
    number: "06",
    team: "Finance & Logistics",
    shortTeam: "Finance & Logistics",
    sourceLine: "Spend, freight and FX",
    apps: [
      { label: "Spend", alts: ["ramp.com", "brex.com"], status: "Costs" },
      { label: "Freight rates", alts: ["maersk.com", "flexport.com"], status: "Compared" },
      { label: "FX rates", alts: ["xe.com", "wise.com"], status: "Read" }
    ],
    entity: "Landed cost / SH-29481",
    validTime: "17 JUL · 16:10",
    knownTime: "19 JUL · 09:52",
    memoryLabel: "MARGIN MEMORY",
    links: ["Quote", "Freight", "FX", "Landed cost"],
    resultLabel: "MARGIN WATCH",
    outcomeTitle: "Margin approval",
    resultTitle: "18.4% margin",
    resultDetail: "Freight, duty and FX land the expedite above the 17.5% approved floor.",
    kind: "margin",
    chart: "stack",
    stats: [["Current", "18.4%"], ["Floor", "17.5%"], ["Room", "+90 bps"]]
  }
] as const;

const teamProfiles = [
  {
    name: "Shubhranshu Jha",
    role: "Product GTM",
    bio: "Turns complex operating context into calm products, integrations, and dependable workflows.",
    linkedin: "https://www.linkedin.com/in/11shubhranshu"
  },
  {
    name: "Sai Kiran",
    role: "Agent systems",
    bio: "Builds and ships the workflow layer that carries trade decisions safely into the systems teams use.",
    linkedin: "https://www.linkedin.com/in/saikiraniitb/"
  }
] as const;

const additionalIntegrations = [
  ["Slack", "slack.com"],
  ["Microsoft Teams", "teams.microsoft.com"],
  ["Oracle", "oracle.com"],
  ["Zoho", "zoho.com"],
  ["HubSpot", "hubspot.com"],
  ["Maersk", "maersk.com"],
  ["Power BI", "powerbi.microsoft.com"],
  ["NetSuite", "netsuite.com"]
] as const;

/* sz=128, not 64: the strip renders these at ~38px, and Google was serving
   16-48px for several domains (Costco 16, ClearTax 22, Airtel 31), so they were
   upscaled and blurry in both themes. Google returns the largest it has, so
   asking for 128 is a no-op where the site has nothing bigger. */
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const companyLogo = (company: TeamCompany) => company.logo ?? favicon(company.domain ?? "");

/** Canonical LinkedIn glyph — just the mark, no rounded container chrome. */
function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V24H.22zM8.34 8.02h4.37v2.18h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7V24h-4.56v-8.13c0-1.94-.03-4.43-2.7-4.43-2.7 0-3.11 2.11-3.11 4.29V24H8.34z" />
    </svg>
  );
}

/**
 * Cycles through interchangeable tools for one source row (Gmail → Outlook,
 * SAP → Oracle → Zoho → Odoo). Each row is offset so the grid never flips in
 * unison, and a single-tool row just renders static.
 */
function ShufflingLogo({ alts, label }: { alts: readonly string[]; label: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (alts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((c) => (c + 1) % alts.length), 2400);
    return () => window.clearInterval(timer);
  }, [alts.length]);

  return (
    <img
      key={alts[index]}
      className="workflow-app-logo"
      src={favicon(alts[index])}
      alt={label}
      loading="lazy"
    />
  );
}

function BulkReplyArtifact() {
  const vendors = [
    ["Amcor", "amcor.com", "Film spec + MOQ", "Replied · 14:36"],
    ["Mondi", "mondigroup.com", "Kraft carton grade", "Replied · 14:37"],
    ["Berry Global", "berryglobal.com", "Liner allocation", "Replied · 14:38"],
    ["Sealed Air", "sealedair.com", "Cold-chain pouch", "Replied · 14:38"]
  ] as const;

  return (
    <div className="bulk-reply-artifact">
      <div className="bulk-reply-head"><span>Vendor</span><span>Update</span><span>Status</span></div>
      {vendors.map(([name, domain, request, status]) => (
        <div className="bulk-reply-row" key={name}>
          <span><img src={favicon(domain)} alt="" />{name}</span>
          <span>{request}</span>
          <strong><i />{status}</strong>
        </div>
      ))}
      <div className="artifact-nudge"><span>4 replies / 1 reviewed action</span><strong>Written to packaging programme</strong></div>
    </div>
  );
}

function ShipmentRouteArtifact() {
  return (
    <div className="shipment-route-artifact">
      <div className="route-canvas">
        <svg viewBox="0 0 640 220" role="img" aria-label="Booked Maersk route and a dotted lower-cost alternative proposed by Ubik">
          <path className="route-coast" d="M46 23c41 35 24 72 62 94 27 16 12 52 48 78M584 16c-28 42-14 75-52 98-34 21-17 57-58 87" />
          <path className="route-current" d="M112 154C220 61 391 55 528 145" />
          <path className="route-alternate" d="M112 154C233 197 394 194 528 145" />
          <circle cx="112" cy="154" r="7" />
          <circle cx="528" cy="145" r="7" />
        </svg>
        <span className="route-point is-origin"><strong>Visakhapatnam</strong><small>IN VTZ</small></span>
        <span className="route-point is-destination"><strong>Newark</strong><small>US EWR</small></span>
        <span className="route-carrier is-current"><img src={favicon("maersk.com")} alt="" />Maersk · booked</span>
        <span className="route-carrier is-alternate"><img src={favicon("hapag-lloyd.com")} alt="" />Hapag-Lloyd · alternative</span>
        <span className="route-ubik-signal"><i />Efficiency found</span>
      </div>
      <div className="route-comparison">
        <div><span>Booked route</span><strong>38 days · $46.2K</strong></div>
        <div className="is-better"><span>Ubik alternative</span><strong>34 days · $37.8K</strong></div>
        <p>−4 days <b>and</b> −$8.4K</p>
      </div>
    </div>
  );
}

/**
 * Deterministic square identicon for the approver avatars.
 *
 * These are fictional operators in a product mockup, so a stock-photo service
 * would be inventing faces for people who don't exist. A generated mark from
 * the same square vocabulary as everything else says "a person" without
 * pretending to be one, and costs no network request.
 */
function Identicon({ seed }: { seed: string }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  // Mirrored 5x5 so it reads as a face-like mark rather than static.
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      cells[y * 5 + x] = ((h >>> 0) % 100) > 45;
    }
    cells[y * 5 + 3] = cells[y * 5 + 1];
    cells[y * 5 + 4] = cells[y * 5 + 0];
  }
  return (
    <svg className="identicon" viewBox="0 0 5 5" aria-hidden="true" focusable="false">
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % 5} y={Math.floor(i / 5)} width="1" height="1" /> : null
      )}
    </svg>
  );
}

function ApprovalArtifact() {
  const approvals = [
    ["AM", "Operations", "Service protected", "Expedite +$3.2K"],
    ["MR", "Commercial", "Margin above floor", "−60 bps"],
    ["SI", "Quality", "Lot 87 cleared", "Cert retained"]
  ] as const;

  return (
    <div className="approval-artifact">
      <div className="approval-steps" aria-label="Delegated, reviewed, approved, committed">
        <i className="is-done" /><i className="is-done" /><i className="is-done" /><i />
      </div>
      <div className="approval-step-labels"><span>Delegated</span><span>Reviewed</span><span>Approved</span><span>Committed</span></div>
      <div className="approval-list">
        {approvals.map(([initials, role, decision, tradeoff]) => (
          <div key={role}>
            <span className="approval-person"><Identicon seed={role} /><b>{initials}</b></span>
            <p><strong>{role}</strong><small>Approved in their Ubik</small></p>
            <p><strong>{decision}</strong><small>{tradeoff}</small></p>
            <span className="approval-check">✓</span>
          </div>
        ))}
      </div>
      <div className="approval-leadership-note">
        <span>Leadership readout</span>
        <strong>Protect the buyer promise. Margin remains 40 bps above floor.</strong>
      </div>
    </div>
  );
}

function EtaWatchArtifact() {
  return (
    <div className="eta-watch-artifact">
      <div className="eta-metrics">
        <div><span>Next carrier check</span><strong>02:14</strong></div>
        <div><span>Promises watched</span><strong>22</strong></div>
      </div>
      <div className="eta-stack" aria-label="18 in SLA, 3 watched, 0 breached, 1 pending">
        <span className="is-ok" style={{ width: "82%" }} />
        <span className="is-watch" style={{ width: "13%" }} />
        <span className="is-pending" style={{ width: "5%" }} />
      </div>
      <div className="eta-legend">
        <span><i className="is-ok" />In SLA <strong>18</strong></span>
        <span><i className="is-watch" />Watch <strong>3</strong></span>
        <span><i className="is-breach" />Breached <strong>0</strong></span>
        <span><i className="is-pending" />Pending <strong>1</strong></span>
      </div>
      <div className="eta-focus-row">
        <span><img src={favicon("maersk.com")} alt="" />Maersk / MSK-2841</span>
        <p><strong>Buyer promise holds</strong><small>Review again if ETA moves ±2 days</small></p>
        <em>WATCH</em>
      </div>
      <div className="artifact-nudge"><span>Next check · 18:00 local</span><strong>3 shipments need no action yet</strong></div>
    </div>
  );
}

function WorkArtifactView({ view }: { view: (typeof workOutputs)[number]["view"] }) {
  if (view === "reply") return <BulkReplyArtifact />;
  if (view === "route") return <ShipmentRouteArtifact />;
  if (view === "approval") return <ApprovalArtifact />;
  return <EtaWatchArtifact />;
}

function WorkflowMemoryView({ item }: { item: (typeof workflowTeams)[number] }) {
  if (item.kind === "traceability") {
    return (
      <div className="workflow-memory-view is-extraction">
        <div className="memory-document">
          <span>PDF · HEALTH CERTIFICATE</span>
          <i /><i /><i /><i />
          <b>OCR + IMAGE EXTRACTION</b>
        </div>
        <div className="memory-extracted-fields">
          <span><b>Lot</b><strong>LOT-87</strong></span>
          <span><b>Species</b><strong>Vannamei</strong></span>
          <span><b>Valid from</b><strong>17 JUL</strong></span>
          <span><b>Evidence</b><strong>Matched</strong></span>
        </div>
      </div>
    );
  }

  if (item.kind === "promise") {
    return (
      <div className="workflow-memory-view is-timeline">
        <div className="memory-timeline">
          <i /><i /><i className="is-active" /><i />
          <span className="is-original">19 JUL<br /><b>Buyer promise</b></span>
          <span className="is-known">29 JUL<br /><b>Revised ETA</b></span>
        </div>
        <p><span>WHAT WAS KNOWN</span><strong>Carrier change reached sales at 10:06</strong></p>
      </div>
    );
  }

  if (item.kind === "inventory") {
    return (
      <div className="workflow-memory-view is-allocation">
        <div className="memory-allocation-chart">
          <span style={{ height: "74%" }}><b>LOT 87</b><i>6.2 MT</i></span>
          <span style={{ height: "52%" }}><b>LOT 91</b><i>3.8 MT</i></span>
          <span style={{ height: "31%" }}><b>LOT 94</b><i>2.4 MT</i></span>
        </div>
        <div className="memory-allocation-foot"><span>WAREHOUSE A</span><span>WAREHOUSE B</span><strong>12.4 MT READY</strong></div>
      </div>
    );
  }

  if (item.kind === "override") {
    return (
      <div className="workflow-memory-view is-revision">
        {[
          ["Artwork extracted", "DONE"],
          ["Destination rule checked", "DONE"],
          ["Material conflict reviewed", "DONE"],
          ["Production tracker updated", "LIVE"]
        ].map(([label, status], index) => (
          <div key={label}><span>0{index + 1}</span><strong>{label}</strong><em className={status === "LIVE" ? "is-live" : ""}>{status}</em></div>
        ))}
      </div>
    );
  }

  if (item.kind === "margin") {
    return (
      <div className="workflow-memory-view is-margin-chart">
        <div className="memory-margin-head"><span>LANDED MARGIN</span><strong>18.4%</strong></div>
        <svg viewBox="0 0 360 120" role="img" aria-label="Margin history remains above the approved floor">
          <path className="margin-floor" d="M0 88H360" />
          <path className="margin-line" d="M0 48C42 42 63 57 102 53S159 32 201 45s55 28 91 14 44-23 68-18" />
          <circle cx="360" cy="41" r="5" />
        </svg>
        <div className="memory-margin-foot"><span>17.5% FLOOR</span><strong>EXPEDITE INCLUDED</strong></div>
      </div>
    );
  }

  return (
    <div className="workflow-memory-view is-project">
      <div className="memory-project-progress"><span style={{ width: "78%" }} /><b>78% COMPLETE</b></div>
      {[
        ["Vendor replies normalised", "4 / 4"],
        ["MOQ + lead time compared", "DONE"],
        ["Recommended supplier reviewed", "1 READY"]
      ].map(([label, status]) => (
        <div key={label}><i /><strong>{label}</strong><span>{status}</span></div>
      ))}
    </div>
  );
}

/**
 * One visual per team rather than the same five bars everywhere. Vocabulary and
 * palette follow ubik-design's chart tokens: mono-blue stepped series, slate for
 * neutral, green/red for outcome, amber for status only.
 */
function WorkflowChart({ chart }: { chart: (typeof workflowTeams)[number]["chart"] }) {
  if (chart === "heatmap") {
    // Lot grid — most cleared, a couple under review, none blocked.
    const cells = "b1 s b2 b3 s b1 o s b2 b1 b3 o b2 s a o b1 b3 s b1 o b2 b1 s g b1 o s b2 b3 b1 o b1 s b2 b3".split(" ");
    return (
      <div className="wf-chart wf-heatmap" aria-hidden="true">
        {cells.map((tone, i) => <i key={i} className={`is-${tone}`} />)}
      </div>
    );
  }

  if (chart === "line") {
    // Promise ETA drift: committed date (blue) against the live forecast (slate).
    return (
      <div className="wf-chart wf-line" aria-hidden="true">
        <svg viewBox="0 0 320 88" preserveAspectRatio="none">
          <path className="wf-line-series" d="M0 64L40 52L80 58L120 40L160 50L200 33L240 38L280 20L320 26" />
          <path className="wf-line-baseline" d="M0 76L40 70L80 74L120 62L160 68L200 63L240 66L280 57L320 50" />
        </svg>
      </div>
    );
  }

  if (chart === "bars") {
    // Lot quantities across two warehouses; the allocated lot is highlighted.
    const heights = [34, 52, 41, 68, 47, 83, 61, 96];
    return (
      <div className="wf-chart wf-bars" aria-hidden="true">
        {heights.map((h, i) => (
          <i key={i} className={i === heights.length - 1 ? "is-peak" : i % 3 === 0 ? "is-b3" : "is-b2"} style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  if (chart === "steps") {
    return (
      <div className="wf-chart wf-steps" aria-hidden="true">
        <div className="wf-steps-track"><i className="is-done" /><i className="is-done" /><i className="is-now" /><i /></div>
        <div className="wf-steps-labels"><span>Detected</span><span>Reviewed</span><span>Override</span><span>Cleared</span></div>
      </div>
    );
  }

  if (chart === "stack") {
    // Margin composition against the approved floor.
    return (
      <div className="wf-chart wf-stack" aria-hidden="true">
        <div className="wf-stack-bar">
          <span className="is-floor" style={{ width: "74%" }} />
          <span className="is-room" style={{ width: "16%" }} />
          <span className="is-rest" style={{ width: "10%" }} />
        </div>
        <div className="wf-stack-legend">
          <span><b className="is-floor" />Floor 17.5%</span>
          <span><b className="is-room" />Room +90 bps</span>
        </div>
      </div>
    );
  }

  // funnel — replies narrowing to one recommendation
  const rows: readonly [string, number, string][] = [
    ["Replied", 100, "is-b1"],
    ["Qualified", 74, "is-b2"],
    ["Shortlist", 46, "is-b3"],
    ["Chosen", 22, "is-slate"]
  ];
  return (
    <div className="wf-chart wf-funnel" aria-hidden="true">
      {rows.map(([label, width, tone]) => (
        <div key={label}><span>{label}</span><i className={tone} style={{ width: `${width}%` }} /></div>
      ))}
    </div>
  );
}

function WorkflowResult({ item }: { item: (typeof workflowTeams)[number] }) {
  return (
    <div className={`workflow-result-widget is-${item.kind}`}>
      <div className="workflow-result-head"><span>{item.resultLabel}</span><em>LIVE</em></div>
      <strong className="workflow-result-title">{item.outcomeTitle}</strong>
      <h3>{item.resultTitle}</h3>
      <p>{item.resultDetail}</p>
      <div className="workflow-result-stats">
        {item.stats.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <WorkflowChart chart={item.chart} />
      <div className="workflow-result-foot"><span>REVIEWED BY YOUR TEAM</span><strong>WRITTEN BACK TO MEMORY</strong></div>
    </div>
  );
}

function TradeWorkLedger() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const output = workOutputs[active];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % workOutputs.length), 3600);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="trade-work-ledger" aria-label="Work Ubik produces after a trade decision">
      <div className="trade-work-ledger-body">
        <div className="trade-work-index" role="tablist" aria-label="Produced work">
          {workOutputs.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={index === active ? "is-active" : undefined}
              onClick={() => {
                setActive(index);
                setIsPaused(true);
              }}
            >
              <span>0{index + 1}</span>
              <strong>{item.label}</strong>
              <em>{item.status}</em>
            </button>
          ))}
        </div>
        <article className="trade-work-paper" key={output.label}>
          <div className="trade-work-paper-topline">
            <span>{output.system}</span>
            <strong>{output.status}</strong>
          </div>
          <h3>{output.title}</h3>
          <p>{output.copy}</p>
          <WorkArtifactView view={output.view} />
        </article>
      </div>
    </div>
  );
}

function TradeFlowOntology() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const item = workflowTeams[active];

  // Only rotate while the panel is actually on screen. On mobile it is taller
  // than the viewport, so an off-screen tick would swap out the rows the reader
  // is in the middle of, and land them on a freshly-mounted panel.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % workflowTeams.length), 4200);
    return () => window.clearInterval(timer);
  }, [isPaused, inView]);

  return (
    <section ref={sectionRef} className="trade-flow-section border-b border-border">
      <div className="container-page py-16 sm:py-24">
        <div className="max-w-6xl">
          <h2 className="home-section-title max-w-4xl">No bots, copilots, or Chief of Staffs</h2>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-foreground/78">Ubik removes the decision delays that cost you the most margin, time, and revenue.</p>
        </div>
        <div className="workflow-memory-stack mt-12">
          <div className="workflow-team-spine" role="tablist" aria-label="How Ubik works across your teams">
            {workflowTeams.map((team, index) => (
              <button
                key={team.team}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={index === active ? "is-active" : undefined}
                onClick={() => {
                  setActive(index);
                  setIsPaused(true);
                }}
              >
                <span>{team.number}</span><strong>{team.shortTeam}</strong>
              </button>
            ))}
            <i className="workflow-spine-core ubik-core-mark" style={{ left: `${((active + 0.5) / workflowTeams.length) * 100}%` }} aria-hidden="true" />
          </div>
          <div className="workflow-memory-panel" key={item.team}>
            <div className="workflow-orchestration-rail" aria-label="Ubik is orchestrating this workflow">
              <span>UBIK IS WORKING</span><i><b className="ubik-core-mark" /></i><em>evidence → memory → action</em>
            </div>
            <section className="workflow-sources">
              <div className="workflow-panel-label"><span>01 / EXISTING SYSTEMS</span><strong>{item.sourceLine}</strong></div>
              <div className="workflow-app-grid">
                {item.apps.map((app) => (
                  <div key={app.label}>
                    <ShufflingLogo alts={app.alts} label={app.label} />
                    <strong>{app.label}</strong>
                    <span>{app.status}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="workflow-memory-record">
              <div className="workflow-panel-label"><span>02 / {item.memoryLabel}</span><strong>{item.entity}</strong></div>
              <WorkflowMemoryView item={item} />
              <div className="workflow-entity-links">
                <span>LINKED CONTEXT</span>
                <p>{item.links.map((link) => <b key={link}>{link}</b>)}</p>
              </div>
            </section>
            <section className="workflow-outcome">
              <div className="workflow-panel-label"><span>03 / REVIEWED OUTPUT</span><strong>{item.outcomeTitle}</strong></div>
              <WorkflowResult item={item} />
            </section>
          </div>
          <div className="workflow-integration-foot" aria-label="Ubik connects with more than one hundred additional tools">
            <span>AND THE REST OF YOUR STACK</span>
            <div>
              {additionalIntegrations.map(([label, domain]) => <img key={label} src={favicon(domain)} alt={label} title={label} />)}
            </div>
            <strong>+100 MORE</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

const deployOptions = [
  {
    label: "01 / On premises",
    title: "Your data centre.",
    copy: "Bare metal or your own Kubernetes. Nothing leaves your perimeter.",
    scene: "premises" as const
  },
  {
    label: "02 / Your cloud",
    title: "Your VPC.",
    copy: "AWS, GCP, or Azure, inside your own account.",
    scene: "cloud" as const
  },
  {
    label: "03 / Managed",
    title: "We run it.",
    copy: "Ubik hosts and operates the stack, you keep the decision trail.",
    scene: "managed" as const
  }
];

// Typographic marks, not the certification bodies' logos — we are not certified
// yet and reproducing their marks would imply that we are.
const compliancePosture = ["GDPR", "DPDP", "SOC 2 Type II"];

/**
 * The operating loop + the three layers.
 *
 * Same visual system as DeployProof — dithered vector tiles, a hairline
 * three-up grid, a mono label chip per card — so the two read as one design
 * language applied twice, not two competing diagram styles.
 */
function OperatingLoop() {
  return (
    <section className="home-layers border-y border-border" aria-labelledby="home-layers-title">
      <div className="container-page py-16 sm:py-24">
        <div className="layer-head">
          <h2 id="home-layers-title" className="home-section-title">
            Supercharge Perishable Trade
          </h2>
        </div>

        <div className="loop-grid" aria-label="The three layers of Ubik's operating loop">
          {ubikLayers.map(([number, verb, title, copy, scene]) => (
            <article key={number} className="loop-card">
              <p>{`${number} / ${verb}`}</p>
              <DitherTile scene={scene} className="loop-tile" />
              <h3>{title}</h3>
              <span>{copy}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeployProof() {
  return (
    <section className="home-deploy-section border-b border-border" aria-labelledby="home-deploy-proof-title">
      <div className="container-page py-16 sm:py-24">
        <div className="home-deploy-proof">
          <div>
            <p className="founder-company-label">Getting started</p>
            <h2 id="home-deploy-proof-title" className="home-section-title">Deploy anywhere</h2>
          </div>
          <div>
            <div className="home-deploy-grid" aria-label="Ubik deployment options">
              {deployOptions.map((option) => (
                <article key={option.label} className="home-deploy-card">
                  <p>{option.label}</p>
                  <DitherTile scene={option.scene} className="home-deploy-tile" />
                  <h3>{option.title}</h3>
                  <span>{option.copy}</span>
                </article>
              ))}
            </div>
            <div className="compliance-strip">
              <span className="compliance-strip-label">Compliance posture</span>
              <ul>
                {compliancePosture.map((mark) => (
                  <li key={mark}>{mark}</li>
                ))}
              </ul>
              <span className="compliance-strip-note">In progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <PageShell>
      <Seo
        title="Ubik | Trade operations, held together"
        description="Ubik connects the messages, lots, approvals, and buyer promises that break apart across a shipment—so trade teams can make the next decision with confidence."
        image="/og-image.png"
        imageAlt="Ubik for perishable trade operations"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Ubik",
          applicationCategory: "BusinessApplication",
          description: "A decision workspace for perishable trade operations.",
          operatingSystem: "Web"
        }}
      />

      <main className="home-minimal overflow-hidden">
        <ParticleField />

        <section className="home-hero">
          <div className="home-collision-grid" aria-hidden="true" />
          <div className="container-page relative z-10 py-16 sm:py-24 lg:min-h-[calc(100svh-4rem)] lg:py-20">
            <div className="max-w-5xl">
              <h1 className="home-display max-w-[10ch]">
                Trade decisions, <em>together.</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/72">
                Ubik pulls the messages, approvals, and buyer promises back into one calm operating view.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="home-primary-action">
                  <a href={externalLinks.app} onClick={() => trackEvent("cta_clicked", { cta: "try_ubik", location: "hero" })}>
                    See Ubik in your workflow <ArrowRightIcon />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="home-secondary-action">
                  <a href={externalLinks.founderMeeting}>Talk to the founders</a>
                </Button>
              </div>
              <div className="mt-14 grid max-w-xl grid-cols-3 border-t border-foreground/18 pt-5">
                {[['100+', 'containers / year'], ['$25m+', 'trade flow'], ['3 / wk', 'tailored workflows']].map(([value, label]) => (
                  <div key={value} className="pr-3">
                    <p className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/72">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <OperatingLoop />

        <TradeFlowOntology />

        <section className="home-outcomes bg-shell text-primary-foreground">
          <div className="container-page py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <h2 className="home-section-title text-primary-foreground">Audit decisions, not data</h2>
                <p className="mt-6 max-w-md text-lg font-medium leading-8 text-primary-foreground">
                  The best employee you ever had — and this one never leaves.
                </p>
              </div>
              <TradeWorkLedger />
            </div>
          </div>
        </section>

        <DeployProof />

        {/* Tighter top padding: the logo row is a rule-bounded strip and was
            sitting a full section-gap below the band above it. */}
        <section className="home-closing">
          <div className="container-page pb-16 pt-8 sm:pb-24 sm:pt-10">
            <div className="founder-company-row" aria-label="Companies our team has worked with">
              <span className="founder-company-label">Over 15+ years</span>
              <div className="founder-company-ticker logo-ticker-fade">
                <div className="logo-ticker-track">
                  {[...teamCompanies, ...teamCompanies].map((company, index) => (
                    <span key={`${company.label}-${index}`}>
                      <img src={companyLogo(company)} alt="" loading="lazy" />
                      <small>{company.label}</small>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Founder quote runs the full column width — it was previously
                squeezed into the left half of a split grid and clipping the
                team cards below it. */}
            <div className="founder-note-grid mt-12">
              <a className="founder-photo-link" href="https://www.linkedin.com/in/hemanth-thimmasarthi" target="_blank" rel="noreferrer" aria-label="Hemanth Rao on LinkedIn">
                <img src="/founders/hemanth.png" alt="Hemanth Rao, founder of Ubik" className="founder-note-photo" />
              </a>
              <div>
                <p className="founder-note-quote">“The hard part is not finding another dashboard. It is knowing which decision is safe when the documents, messages, and numbers disagree.”</p>
                <a className="founder-link mt-5" href="https://www.linkedin.com/in/hemanth-thimmasarthi" target="_blank" rel="noreferrer">
                  Hemanth Rao · Founder <LinkedInMark />
                </a>
              </div>
            </div>

            <div className="meet-team-strip mt-10">
              <div className="meet-team-grid">
                {teamProfiles.map((profile) => (
                  <article key={profile.name}>
                    <div>
                      <span>{profile.role}</span>
                      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={`${profile.name} on LinkedIn`}>
                        <LinkedInMark />
                      </a>
                    </div>
                    <h3>{profile.name}</h3>
                    <p>{profile.bio}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="closing-cta mt-14">
              <div>
                <h2 className="home-section-title">Priced on outcome, not seats</h2>
                <p className="closing-cta-copy">
                  Base ships 2-3 new workflows a month. Enterprise ships 2-3 a week, plus WhatsApp, ERP and CRM automation.
                </p>
              </div>
              <Button asChild size="lg" className="home-primary-action">
                <a href={externalLinks.founderMeeting}>Plan your first workflow <ArrowRightIcon /></a>
              </Button>
            </div>
          </div>
        </section>

        <section className="home-journal border-t border-border">
          <div className="container-page grid gap-8 py-16 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <h2 className="home-section-title">Trade Notes</h2>
            </div>
            <div className="border-l-2 border-primary pl-6 sm:pl-8">
              <h3 className="max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">{featuredBlogPost.title}</h3>
              <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read latest <ArrowRightIcon /></Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
