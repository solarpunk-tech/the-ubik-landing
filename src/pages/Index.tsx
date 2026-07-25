import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  LinkedinLogoIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { featuredBlogPost } from "@/lib/landing-content";
import { externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";

const programmeRows = [
  ["01", "Buyer promise", "ETA has moved. Three customers need a new answer."],
  ["02", "Inventory and lots", "Available stock is split across two warehouses and four lots."],
  ["03", "Commercial terms", "The quote floor, payment terms, and margin need checking together."],
  ["04", "Approvals", "Sales, finance, and operations need one decision trail—not six threads."]
] as const;

const workOutputs = [
  {
    label: "Vendor replies",
    status: "4 replied",
    title: "Packaging vendors replied",
    copy: "One reviewed update went to every raw-material vendor. Replies are logged against the same programme.",
    system: "Gmail",
    view: "reply",
    footLeft: "Bulk action by Ubik",
    footRight: "4 responses logged",
    commitTitle: "Bulk reply completed",
    commitCopy: "Four vendor responses are now attached to the packaging programme."
  },
  {
    label: "Shipment tracker",
    status: "Route found",
    title: "A faster lane surfaced",
    copy: "The booked Maersk route stays visible while Ubik prices a lower-cost alternative across the same two points.",
    system: "Carrier + shipment tracker",
    view: "route",
    footLeft: "Detected by Ubik",
    footRight: "Waiting for route approval",
    commitTitle: "Alternative ready for review",
    commitCopy: "No carrier booking changes until your team approves the new lane."
  },
  {
    label: "Approval",
    status: "Approved",
    title: "Manager decisions are in",
    copy: "Leadership sees what was delegated, who approved it in their Ubik, and the trade-off each manager accepted.",
    system: "Leadership view",
    view: "approval",
    footLeft: "Delegated by leadership",
    footRight: "Approved in managers' Ubik",
    commitTitle: "Delegated approvals complete",
    commitCopy: "The accepted trade-offs remain attached to the leadership record."
  },
  {
    label: "ETA watch",
    status: "Monitoring",
    title: "ETA exceptions stay covered",
    copy: "The live watch separates healthy promises from shipments that need review before the next buyer update.",
    system: "Fulfilment · live",
    view: "eta",
    footLeft: "Monitored by Ubik",
    footRight: "No action required",
    commitTitle: "ETA watch running",
    commitCopy: "Ubik reopens the workflow only when the customer promise moves."
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

const workflowTeams = [
  {
    number: "01",
    team: "Compliance & CSR",
    shortTeam: "Compliance",
    apps: [
      { label: "FDA Import Alert", glyph: "WEB", status: "Watched" },
      { label: "BAP Certificate", glyph: "CERT", status: "Valid" },
      { label: "Health PDF", glyph: "PDF", status: "Extracted" }
    ],
    entity: "Shrimp certificate / Lot 87",
    validTime: "17 JUL · 06:00",
    knownTime: "19 JUL · 09:42",
    memoryLabel: "DOCUMENT INTELLIGENCE",
    links: ["Shrimp", "Supplier", "Lot", "Destination"],
    resultLabel: "LOT TRACEABILITY",
    outcomeTitle: "Compliance release",
    resultTitle: "12 shrimp lots cleared",
    resultDetail: "Health certificate, BAP proof, and FDA lane evidence match before release.",
    kind: "traceability",
    stats: [["Cleared", "12"], ["Review", "02"], ["Blocked", "00"]]
  },
  {
    number: "02",
    team: "Sales Operations",
    shortTeam: "Sales Ops",
    apps: [
      { label: "Buyer Email", domain: "outlook.com", status: "Matched" },
      { label: "WhatsApp", domain: "whatsapp.com", status: "Live" },
      { label: "CRM Promise", domain: "salesforce.com", status: "Updated" }
    ],
    entity: "Shrimp buyer promise / SO-29481",
    validTime: "29 JUL · 12:00",
    knownTime: "19 JUL · 10:06",
    memoryLabel: "PROMISE HISTORY",
    links: ["Buyer", "Shrimp SKU", "Lane", "Margin"],
    resultLabel: "PROMISE WATCH",
    outcomeTitle: "Buyer update",
    resultTitle: "3 promises recalculated",
    resultDetail: "Retail buyer replies are ready with the revised shrimp ETA attached.",
    kind: "promise",
    stats: [["Ready", "03"], ["At risk", "01"], ["Sent", "07"]]
  },
  {
    number: "03",
    team: "Plant & Inventory",
    shortTeam: "Plant & Inventory",
    apps: [
      { label: "SAP Stock", domain: "sap.com", status: "Synced" },
      { label: "Cold Store", glyph: "INV", status: "Checked" },
      { label: "Power BI", domain: "powerbi.microsoft.com", status: "Read" }
    ],
    entity: "Shrimp lot allocation / LOT-87",
    validTime: "18 JUL · 14:20",
    knownTime: "19 JUL · 08:16",
    memoryLabel: "ALLOCATION MEMORY",
    links: ["Shrimp", "Warehouse", "Expiry", "Order"],
    resultLabel: "LOT READINESS",
    outcomeTitle: "Production plan",
    resultTitle: "12.4 MT ready",
    resultDetail: "Four frozen shrimp lots across two warehouses can protect the order.",
    kind: "inventory",
    stats: [["Lots", "04"], ["Warehouses", "02"], ["Shortfall", "0"]]
  },
  {
    number: "04",
    team: "Packaging",
    shortTeam: "Packaging",
    apps: [
      { label: "Artwork PDF", glyph: "PDF", status: "Extracted" },
      { label: "Buyer Spec", glyph: "SPEC", status: "Compared" },
      { label: "Packaging Policy", glyph: "RULE", status: "Applied" }
    ],
    entity: "Shrimp pack spec / SKU-4471",
    validTime: "21 JUL · 09:00",
    knownTime: "19 JUL · 11:24",
    memoryLabel: "REVISION CONTROL",
    links: ["Buyer", "Carton", "Shrimp lots", "Rule"],
    resultLabel: "MATERIAL RULE",
    outcomeTitle: "Packaging override",
    resultTitle: "18 lots affected",
    resultDetail: "The approved carton spec keeps compliant shrimp production moving.",
    kind: "override",
    stats: [["Detected", "18"], ["Reviewed", "18"], ["Cleared", "16"]]
  },
  {
    number: "05",
    team: "Finance",
    shortTeam: "Finance",
    apps: [
      { label: "Ramp", domain: "ramp.com", status: "Costs" },
      { label: "FX Sheet", glyph: "XLS", status: "Read" },
      { label: "Power BI", domain: "powerbi.microsoft.com", status: "Live" }
    ],
    entity: "Shrimp landed cost / SH-29481",
    validTime: "17 JUL · 16:10",
    knownTime: "19 JUL · 09:52",
    memoryLabel: "MARGIN MEMORY",
    links: ["Shrimp quote", "Freight", "FX", "Terms"],
    resultLabel: "MARGIN WATCH",
    outcomeTitle: "Margin approval",
    resultTitle: "18.4% margin",
    resultDetail: "The shrimp expedite stays above the 17.5% approved floor.",
    kind: "margin",
    stats: [["Current", "18.4%"], ["Floor", "17.5%"], ["Room", "+90 bps"]]
  },
  {
    number: "06",
    team: "Procurement",
    shortTeam: "Procurement",
    apps: [
      { label: "Supplier Email", domain: "outlook.com", status: "Parsed" },
      { label: "Coupa", domain: "coupa.com", status: "Compared" },
      { label: "Vendor Certs", glyph: "CERT", status: "Checked" }
    ],
    entity: "Shrimp supplier promise / PKG-2841",
    validTime: "22 JUL · 17:00",
    knownTime: "19 JUL · 14:38",
    memoryLabel: "SUPPLIER PROJECT",
    links: ["Shrimp vendor", "MOQ", "Material", "Plan"],
    resultLabel: "VENDOR COMPARISON",
    outcomeTitle: "Supplier choice",
    resultTitle: "4 replies matched",
    resultDetail: "Cost, MOQ, certification, and lead time resolve into one choice.",
    kind: "vendors",
    stats: [["Replies", "04"], ["Qualified", "03"], ["Recommended", "01"]]
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

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const companyLogo = (company: TeamCompany) => company.logo ?? favicon(company.domain ?? "");

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
            <span className="approval-person">{initials}</span>
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
      <div className="workflow-result-rule" aria-hidden="true"><i /><i /><i /><i /><i /></div>
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
      <div className="trade-work-ledger-head">
        <span>CHANGE SET / SHIPMENT 24-0917</span>
        <strong>4 WORKFLOWS IN MOTION</strong>
      </div>
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
          <div className="trade-work-paper-foot">
            <span>{output.footLeft}</span>
            <span>{output.footRight}</span>
          </div>
        </article>
      </div>
    </div>
  );
}

function TradeFlowOntology() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const item = workflowTeams[active];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % workflowTeams.length), 4200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="trade-flow-section border-b border-border">
      <div className="container-page py-16 sm:py-24">
        <div className="max-w-6xl">
          <h2 className="home-section-title max-w-4xl">No bots, copilots or Chief of Staffs</h2>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-foreground/78">ubik aids your team in eliminating decision delays that impact margins, operating cost &amp; revenue the most</p>
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
              <div className="workflow-panel-label"><span>01 / EXISTING SYSTEMS</span><strong>{item.team}</strong></div>
              <div className="workflow-app-grid">
                {item.apps.map((app) => (
                  <div key={app.label}>
                    {"domain" in app ? <img src={favicon(app.domain)} alt="" /> : <i aria-hidden="true">{app.glyph}</i>}
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
        <section className="home-hero">
          <div className="home-collision-grid" aria-hidden="true" />
          <div className="container-page relative z-10 py-16 sm:py-24 lg:min-h-[calc(100svh-4rem)] lg:py-20">
            <div className="max-w-5xl">
              <h1 className="home-display max-w-[10ch]">
                Trade decisions, <em>together.</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/72">
                Ubik pulls the messages, lots, approvals, and buyer promises back into one calm operating view.
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
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/52">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="home-programmes border-y border-border">
          <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <h2 className="home-section-title">Own your data and intelligence</h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {programmeRows.map(([number, title, copy]) => (
                <article key={number} className="grid gap-4 py-5 sm:grid-cols-[3rem_13rem_1fr] sm:items-baseline">
                  <span className="font-mono text-[10px] text-primary">{number}</span>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm leading-6 text-foreground/68">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <TradeFlowOntology />

        <section className="home-outcomes bg-shell text-primary-foreground">
          <div className="container-page py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <h2 className="home-section-title text-primary-foreground">Audit decisions not data</h2>
                <p className="mt-6 max-w-md text-lg font-medium leading-8 text-primary-foreground">
                  why ubik feels like the best employee you ever had that never left
                </p>
              </div>
              <TradeWorkLedger />
            </div>
          </div>
        </section>

        <section className="home-closing">
          <div className="container-page py-16 sm:py-24">
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

            <div className="closing-main-grid mt-14">
              <div className="founder-note-grid">
                <a className="founder-photo-link" href="https://www.linkedin.com/in/hemanth-thimmasarthi" target="_blank" rel="noreferrer" aria-label="Hemanth Rao on LinkedIn">
                  <img src="/founders/hemanth.png" alt="Hemanth Rao, founder of Ubik" className="founder-note-photo" />
                </a>
                <div>
                  <p className="mt-5 max-w-xl text-xl font-medium leading-8 sm:text-2xl">“The hard part is not finding another dashboard. It is knowing which decision is safe when the documents, messages, and numbers disagree.”</p>
                  <a className="founder-link mt-5" href="https://www.linkedin.com/in/hemanth-thimmasarthi" target="_blank" rel="noreferrer">
                    Hemanth Rao · Operator in Chief <LinkedinLogoIcon weight="fill" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="lg:text-right">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Eliminate your SaaS &amp; AI bills
                </h2>
                <Button asChild size="lg" className="home-primary-action mt-7">
                  <a href={externalLinks.founderMeeting}>Plan your first workflow <ArrowRightIcon /></a>
                </Button>
              </div>
            </div>

            <section className="home-deploy-proof mt-14" aria-labelledby="home-deploy-proof-title">
              <div>
                <p className="founder-company-label">Getting started</p>
                <h2 id="home-deploy-proof-title" className="home-section-title">Deploy anywhere</h2>
              </div>
              <div className="home-deploy-grid" aria-label="Ubik deployment options">
                {[
                  ["01 / On premises", "In your data center.", "Self-host on bare metal or your own Kubernetes. Zero data leaves your perimeter.", "premises"],
                  ["02 / Your cloud", "In your VPC.", "Deploy to AWS, GCP, or Azure inside your account. BYOC from day one.", "cloud"],
                  ["03 / Local", "On your laptop.", "Run the full stack on a workstation for offline dev, demos, or sensitive work.", "local"]
                ].map(([label, title, copy, variant]) => (
                  <article key={label} className="home-deploy-card">
                    <p>{label}</p>
                    <div className={`home-deploy-visual is-${variant}`} aria-hidden="true">
                      <span /><span /><span />
                    </div>
                    <h3>{title}</h3>
                    <span>{copy}</span>
                  </article>
                ))}
              </div>
            </section>

            <div className="meet-team-strip mt-14">
              <div className="meet-team-grid">
                {teamProfiles.map((profile) => (
                  <article key={profile.name}>
                    <div>
                      <span>{profile.role}</span>
                      <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label={`${profile.name} on LinkedIn`}>
                        <LinkedinLogoIcon weight="fill" aria-hidden="true" />
                      </a>
                    </div>
                    <h3>{profile.name}</h3>
                    <p>{profile.bio}</p>
                  </article>
                ))}
              </div>
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
