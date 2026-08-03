const AppChip = ({ mark, name }) => (
  <span className="ubik-demo__chip"><span>{mark}</span>{name}</span>
);

const StateTabs = ({ id, label, tabs, children }) => (
  <div className={`ubik-demo__states ubik-demo__states--${id}`}>
    {tabs.map((tab, index) => (
      <input
        className="ubik-demo__state"
        defaultChecked={index === 0}
        id={`${id}-${tab.id}`}
        key={tab.id}
        name={`${id}-state`}
        type="radio"
      />
    ))}
    <div className="ubik-demo__tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <label htmlFor={`${id}-${tab.id}`} key={tab.id}>{tab.label}</label>
      ))}
    </div>
    <div className="ubik-demo__panels">{children}</div>
  </div>
);

export const OperatorPrototype = ({ compact = false }) => {
  const tabs = [
    { id: "start", label: "Start" },
    { id: "connected", label: "Apps connected" },
    { id: "artifact", label: "Artifact" },
  ];

  return (
    <section className={`ubik-demo ${compact ? "is-compact" : ""}`} aria-label="Interactive Ask ubik guide">
      <div className="ubik-demo__bar">
        <span className="ubik-demo__identity">Ask ubik</span>
        <span className="ubik-demo__status"><i /> interactive guide</span>
      </div>
      <StateTabs id="operator" label="Ask ubik guide state" tabs={tabs}>
        <div className="ubik-demo__panel" data-state="start">
          <div className="ubik-demo__body">
            <p className="ubik-demo__eyebrow">Start with a question or task</p>
            <div className="ubik-demo__sourcebar"><span className="is-active">Organization knowledge</span><span>Files</span></div>
            <div className="ubik-demo__composer">Name the decision, comparison, or follow-up you need.</div>
            <div className="ubik-demo__suggestions">
              <label htmlFor="operator-connected"><b>GitHub · Notion · Slack</b><span>Daily morning brief</span></label>
              <label htmlFor="operator-connected"><b>Slack</b><span>Catch up on Slack</span></label>
              <label htmlFor="operator-connected"><b>GitHub</b><span>PRs to review</span></label>
            </div>
          </div>
        </div>
        <div className="ubik-demo__panel" data-state="connected">
          <div className="ubik-demo__body">
            <p className="ubik-demo__eyebrow">Context attached</p>
            <div className="ubik-demo__chips"><AppChip mark="GH" name="GitHub" /><AppChip mark="N" name="Notion" /><AppChip mark="S" name="Slack" /></div>
            <div className="ubik-demo__composer is-filled">Create my morning brief. Group open reviews, recent decisions, and unanswered threads by source. Flag what needs me first.</div>
            <label className="ubik-demo__action" htmlFor="operator-artifact">Create brief <span>→</span></label>
          </div>
        </div>
        <div className="ubik-demo__panel" data-state="artifact">
          <div className="ubik-demo__body">
            <div className="ubik-demo__artifact-head"><div><p className="ubik-demo__eyebrow">Artifact created</p><strong>Morning brief</strong></div><span className="ubik-demo__badge is-ready">Ready to review</span></div>
            <div className="ubik-demo__rows">
              <div className="ubik-demo__row"><span className="ubik-demo__source">GitHub</span><b>Two reviews need an owner</b><span>Open first</span></div>
              <div className="ubik-demo__row"><span className="ubik-demo__source">Slack</span><b>One question has no reply</b><span>Reply</span></div>
              <div className="ubik-demo__row"><span className="ubik-demo__source">Notion</span><b>Planning note changed</b><span>Read</span></div>
            </div>
          </div>
        </div>
      </StateTabs>
    </section>
  );
};

export const InboxPrototype = () => {
  const tabs = [{ id: "thread", label: "Thread" }, { id: "tasks", label: "Tasks" }, { id: "files", label: "Files" }];
  return (
    <section className="ubik-demo" aria-label="Interactive Inbox guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Inbox</span><span className="ubik-demo__status"><i /> source first</span></div>
      <div className="ubik-demo__inbox">
        <div className="ubik-demo__thread-list"><button className="is-selected" type="button"><b>Packaging documents</b><span>Promise date needs review</span></button><button type="button"><b>Supplier production</b><span>Waiting for update</span></button><button type="button"><b>Container arrival</b><span>No action required</span></button></div>
        <div className="ubik-demo__thread">
          <div className="ubik-demo__thread-head"><div><strong>Packaging documents</strong><span>Buyer reply · 09:42</span></div><span className="ubik-demo__badge is-watch">Review</span></div>
          <StateTabs id="inbox" label="Inbox context" tabs={tabs}>
            <div className="ubik-demo__panel" data-state="thread"><div className="ubik-demo__message"><p>Please confirm whether the revised documents change Friday's release.</p><span>Read the source before the prepared answer.</span></div></div>
            <div className="ubik-demo__panel" data-state="tasks"><div className="ubik-demo__mini-list"><span>Owner</span><b>Documentation team</b><span>Due</span><b>Today · 16:00</b></div></div>
            <div className="ubik-demo__panel" data-state="files"><div className="ubik-demo__mini-list"><span>Attached</span><b>Release packet.pdf</b><span>Changed</span><b>Today · 09:31</b></div></div>
          </StateTabs>
          <div className="ubik-demo__actions"><button type="button">Ask ubik</button><button className="is-primary" type="button">Reply</button></div>
        </div>
      </div>
    </section>
  );
};

export const TasksPrototype = () => {
  const tabs = [{ id: "mine", label: "Mine" }, { id: "team", label: "Team" }];
  const Rows = ({ team = false }) => (team ? [
    ["Open", "Review margin exception", "Finance"], ["Waiting", "Customer artwork approval", "Buyer"], ["Closed", "Container pickup booked", "Confirmation attached"],
  ] : [
    ["Open", "Confirm revised release date", "Today"], ["Waiting", "Supplier production update", "Monitored"], ["Closed", "Warehouse receiving tally", "Receipt attached"],
  ]).map(([state, task, owner]) => <div className="ubik-demo__row" key={task}><span className={`ubik-demo__badge is-${state.toLowerCase()}`}>{state}</span><b>{task}</b><span>{owner}</span></div>);
  return (
    <section className="ubik-demo" aria-label="Interactive Tasks guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Tasks</span><span className="ubik-demo__status"><i /> obligations</span></div>
      <StateTabs id="tasks" label="Task ownership" tabs={tabs}>
        <div className="ubik-demo__panel" data-state="mine"><div className="ubik-demo__kpis"><div><span>Open</span><strong>7</strong></div><div><span>Waiting</span><strong>12</strong></div><div><span>Closed today</span><strong>4</strong></div></div><div className="ubik-demo__rows"><Rows /></div></div>
        <div className="ubik-demo__panel" data-state="team"><div className="ubik-demo__kpis"><div><span>Open</span><strong>5</strong></div><div><span>Waiting</span><strong>8</strong></div><div><span>Closed today</span><strong>9</strong></div></div><div className="ubik-demo__rows"><Rows team /></div></div>
      </StateTabs>
    </section>
  );
};

export const WorkflowPrototype = ({ compact = false }) => {
  const tabs = [{ id: "library", label: "Library" }, { id: "live", label: "Live" }, { id: "map", label: "Week 1 map" }];
  return (
    <section className={`ubik-demo ${compact ? "is-compact" : ""}`} aria-label="Interactive workflow guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Workflows</span><span className="ubik-demo__status"><i /> interactive guide</span></div>
      <StateTabs id="workflow" label="Workflow guide state" tabs={tabs}>
        <div className="ubik-demo__panel" data-state="library"><div className="ubik-demo__body"><p className="ubik-demo__eyebrow">Choose a team, then one loop</p><div className="ubik-demo__team-grid"><label htmlFor="workflow-live"><span>Sales ops</span><b>Enquiry to quote</b><small>Designed</small></label><label htmlFor="workflow-live"><span>Operations</span><b>Packaging SLA</b><small className="is-live">Live</small></label><label htmlFor="workflow-map"><span>Planning</span><b>Demand and supply</b><small>Map</small></label></div></div></div>
        <div className="ubik-demo__panel" data-state="live"><div className="ubik-demo__body"><div className="ubik-demo__artifact-head"><div><p className="ubik-demo__eyebrow">Live workflow</p><strong>Packaging SLA</strong></div><span className="ubik-demo__badge is-ready">In SLA</span></div><div className="ubik-demo__kpis"><div><span>Open</span><strong>7</strong></div><div><span>On track</span><strong>6</strong></div><div><span>Critical</span><strong>1</strong></div></div><div className="ubik-demo__row"><span className="ubik-demo__badge is-critical">Critical</span><b>Release declaration waiting</b><span>1 day behind</span></div></div></div>
        <div className="ubik-demo__panel" data-state="map"><div className="ubik-demo__body"><p className="ubik-demo__eyebrow">Week 1 · one operating loop</p><div className="ubik-demo__flow"><div><span>01</span><b>Customer provides</b><small>Plan · production · arrivals</small></div><div><span>02</span><b>ubik checks</b><small>Snapshot · remaining demand</small></div><div><span>03</span><b>ubik alerts</b><small>Conflict · delay · missing input</small></div><div><span>04</span><b>Operator decides</b><small>Owner · action · reviewed write</small></div></div></div></div>
      </StateTabs>
    </section>
  );
};

export const WatchPrototype = () => {
  const tabs = [{ id: "ask", label: "Ask ubik" }, { id: "inbox", label: "Inbox" }, { id: "tasks", label: "Tasks" }, { id: "workflows", label: "Workflows" }, { id: "memory", label: "Trade memory" }, { id: "finetuning", label: "Finetuning" }];
  const steps = [
    ["ask", "01 / 06", "Question becomes an artifact", "Attach only context that can change the answer."],
    ["inbox", "02 / 06", "Thread becomes a reviewed move", "Read the source, inspect the deciding context, then reply or assign."],
    ["tasks", "03 / 06", "Follow-up keeps an owner", "Open, waiting, and closed name who owes the move and what proves completion."],
    ["workflows", "04 / 06", "Repeated work becomes a contract", "Inputs, checks, alerts, review, and outcome stay visible."],
    ["memory", "05 / 06", "Approved work becomes trade memory", "The next question can recall the decision, evidence, and handoff."],
    ["finetuning", "06 / 06", "Failures become a tested update", "Approved examples, edits, and rejections define the next evaluation set."],
  ];
  return (
    <section className="ubik-demo ubik-watch" aria-label="Six-part ubik product walkthrough">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Watch</span><span className="ubik-demo__status"><i /> six states</span></div>
      <StateTabs id="watch" label="Watch lesson" tabs={tabs}>
        {steps.map(([state, count, title, body]) => (
          <div className="ubik-demo__panel" data-state={state} key={state}><div className="ubik-watch__stage"><div className="ubik-watch__copy"><span>{count}</span><strong>{title}</strong><p>{body}</p></div><div className={`ubik-watch__visual is-${state}`}><span className="ubik-watch__node">{state === "ask" ? "Question" : state === "memory" ? "Decision" : state}</span><span className="ubik-watch__arrow">→</span><span className="ubik-watch__result">{state === "finetuning" ? "Evaluation set" : state === "workflows" ? "Reviewed action" : "Artifact ready"}</span></div></div></div>
        ))}
      </StateTabs>
    </section>
  );
};

const PRODUCT_SURFACES = [
  { id: "inbox", label: "Inbox", rows: [["Inquiry", "Buyer asks for availability", "New"], ["PO", "PO-2381 needs SKU mapping", "2h"]] },
  { id: "email", label: "Email", rows: [["Drafted", "Renewal follow-up ready to send", "Draft"], ["Sent", "Quote update sent to three vendors", "2m"]] },
  { id: "tasks", label: "Tasks", rows: [["Open", "Confirm COA for BL-2408-219", "Today"], ["Open", "Send revised quote to MFL", "Tomorrow"]] },
  { id: "workflows", label: "Workflows", rows: [["Running", "Import clearance, 6 of 9 steps", "62%"], ["Queued", "Demurrage review", "Next"]] },
  { id: "markets", label: "Market intel", rows: [["Up", "Shrimp L2 spot", "+4.2%"], ["Flat", "Salmon fillet, 30d average", "$6.80/kg"]] },
  { id: "meetings", label: "Meetings", rows: [["Fri", "Buyer sync, renewal terms", "10:00"], ["Ready", "Transcript, MFL renewal call", "Today"], ["Pre-read", "Last-call memory summarized", "Ready"]] },
  { id: "artifacts", label: "Artifacts", rows: [["PDF", "Q3 shipment report", "Ready"], ["DOC", "Customs packet, BL-2408-219", "Ready"]] },
];

export const ProductSurfacePreview = () => (
  <section className="ubik-demo ubik-surface-preview" aria-label="ubik product surfaces">
    <div className="ubik-surface-preview__stats">
      <div><strong>$700M+</strong><span>Perishables traded</span></div>
      <div><strong>20x</strong><span>Faster operations</span></div>
      <div><strong>$200K</strong><span>Average annual savings</span></div>
    </div>
    <StateTabs id="surface" label="Product surface" tabs={PRODUCT_SURFACES}>
      {PRODUCT_SURFACES.map((surface) => (
        <div className="ubik-demo__panel" data-state={surface.id} key={surface.id}>
          <div className="ubik-surface-preview__head"><span>{surface.label}</span><b>Live product surface</b></div>
          <div className="ubik-demo__rows">
            {surface.rows.map(([tag, text, meta]) => <div className="ubik-demo__row" key={text}><span className="ubik-demo__source">{tag}</span><b>{text}</b><span>{meta}</span></div>)}
          </div>
        </div>
      ))}
    </StateTabs>
    <div className="ubik-surface-preview__trust">
      <span><b>Security</b>SOC 2 Type II and GDPR</span>
      <span><b>Private</b>Data never trained on</span>
      <a href="https://theubik.com/download"><b>ubik Meetings</b>Get the desktop app</a>
    </div>
  </section>
);

export const MeetingsPreview = () => {
  const tabs = [{ id: "list", label: "List" }, { id: "calendar", label: "Calendar" }];
  return (
    <section className="ubik-demo ubik-meetings" aria-label="Meetings workspace">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Meetings</span><span className="ubik-demo__status"><i /> desktop capture</span></div>
      <div className="ubik-meetings__filters"><span className="is-active">All meetings · 6</span><span>Supplier review · 2</span><span>Logistics · 2</span><span>My notes · 2</span></div>
      <StateTabs id="meeting-view" label="Meetings view" tabs={tabs}>
        <div className="ubik-demo__panel" data-state="list">
          <div className="ubik-meetings__layout">
            <div className="ubik-meetings__list">
              <span className="ubik-demo__eyebrow">Coming up</span>
              <div><b>Supplier review, Thai Union</b><span>Today · 10:30</span><small>Upcoming</small></div>
              <div><b>Logistics sync, Maersk</b><span>Today · 14:00</span><small>Upcoming</small></div>
              <span className="ubik-demo__eyebrow">Past</span>
              <div><b>MFL renewal call</b><span>Transcript and decisions ready</span><small>Completed</small></div>
            </div>
            <aside className="ubik-meetings__rail">
              <span className="ubik-demo__eyebrow">Before the next call</span>
              <b>Capture the conversation, then keep its decisions and follow-ups linked.</b>
              <a href="https://theubik.com/download">Get the desktop app →</a>
            </aside>
          </div>
        </div>
        <div className="ubik-demo__panel" data-state="calendar">
          <div className="ubik-meetings__calendar">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            <div>12</div><div>13<small>Supplier review</small></div><div>14</div><div>15<small>Logistics sync</small></div><div>16<small>Buyer renewal</small></div>
          </div>
        </div>
      </StateTabs>
    </section>
  );
};
