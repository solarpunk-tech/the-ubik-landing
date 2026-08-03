const DemoTabs = ({ tabs, active, onChange, label }) => (
  <div className="ubik-demo__tabs" role="tablist" aria-label={label}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={active === tab.id}
        className={active === tab.id ? "is-active" : ""}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const AppChip = ({ mark, name }) => (
  <span className="ubik-demo__chip"><span>{mark}</span>{name}</span>
);

export const OperatorPrototype = ({ compact = false }) => {
  const [active, setActive] = useState("start");
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
      <DemoTabs tabs={tabs} active={active} onChange={setActive} label="Ask ubik guide state" />

      {active === "start" && (
        <div className="ubik-demo__body">
          <p className="ubik-demo__eyebrow">Start with a question or task</p>
          <div className="ubik-demo__sourcebar">
            <span className="is-active">Organization knowledge</span>
            <span>Files</span>
          </div>
          <div className="ubik-demo__composer">Name the decision, comparison, or follow-up you need.</div>
          <div className="ubik-demo__suggestions">
            <button type="button" onClick={() => setActive("connected")}><b>GitHub · Notion · Slack</b><span>Daily morning brief</span></button>
            <button type="button" onClick={() => setActive("connected")}><b>Slack</b><span>Catch up on Slack</span></button>
            <button type="button" onClick={() => setActive("connected")}><b>GitHub</b><span>PRs to review</span></button>
          </div>
        </div>
      )}

      {active === "connected" && (
        <div className="ubik-demo__body">
          <p className="ubik-demo__eyebrow">Context attached</p>
          <div className="ubik-demo__chips">
            <AppChip mark="GH" name="GitHub" />
            <AppChip mark="N" name="Notion" />
            <AppChip mark="S" name="Slack" />
          </div>
          <div className="ubik-demo__composer is-filled">
            Create my morning brief. Group open reviews, recent decisions, and unanswered threads by source. Flag what needs me first.
          </div>
          <button className="ubik-demo__action" type="button" onClick={() => setActive("artifact")}>Create brief <span>→</span></button>
        </div>
      )}

      {active === "artifact" && (
        <div className="ubik-demo__body">
          <div className="ubik-demo__artifact-head">
            <div><p className="ubik-demo__eyebrow">Artifact created</p><strong>Morning brief</strong></div>
            <span className="ubik-demo__badge is-ready">Ready to review</span>
          </div>
          <div className="ubik-demo__rows">
            <div className="ubik-demo__row"><span className="ubik-demo__source">GitHub</span><b>Two reviews need an owner</b><span>Open first</span></div>
            <div className="ubik-demo__row"><span className="ubik-demo__source">Slack</span><b>One question has no reply</b><span>Reply</span></div>
            <div className="ubik-demo__row"><span className="ubik-demo__source">Notion</span><b>Planning note changed</b><span>Read</span></div>
          </div>
        </div>
      )}
    </section>
  );
};

export const InboxPrototype = () => {
  const [active, setActive] = useState("thread");
  const tabs = [
    { id: "thread", label: "Thread" },
    { id: "tasks", label: "Tasks" },
    { id: "files", label: "Files" },
  ];

  return (
    <section className="ubik-demo" aria-label="Interactive Inbox guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Inbox</span><span className="ubik-demo__status"><i /> source first</span></div>
      <div className="ubik-demo__inbox">
        <div className="ubik-demo__thread-list">
          <button className="is-selected" type="button"><b>Packaging documents</b><span>Promise date needs review</span></button>
          <button type="button"><b>Supplier production</b><span>Waiting for update</span></button>
          <button type="button"><b>Container arrival</b><span>No action required</span></button>
        </div>
        <div className="ubik-demo__thread">
          <div className="ubik-demo__thread-head"><div><strong>Packaging documents</strong><span>Buyer reply · 09:42</span></div><span className="ubik-demo__badge is-watch">Review</span></div>
          <DemoTabs tabs={tabs} active={active} onChange={setActive} label="Inbox context" />
          {active === "thread" && <div className="ubik-demo__message"><p>Please confirm whether the revised documents change Friday's release.</p><span>Read the source before the prepared answer.</span></div>}
          {active === "tasks" && <div className="ubik-demo__mini-list"><span>Owner</span><b>Documentation team</b><span>Due</span><b>Today · 16:00</b></div>}
          {active === "files" && <div className="ubik-demo__mini-list"><span>Attached</span><b>Release packet.pdf</b><span>Changed</span><b>Today · 09:31</b></div>}
          <div className="ubik-demo__actions"><button type="button">Ask ubik</button><button className="is-primary" type="button">Reply</button></div>
        </div>
      </div>
    </section>
  );
};

export const TasksPrototype = () => {
  const [active, setActive] = useState("mine");
  const tabs = [
    { id: "mine", label: "Mine" },
    { id: "team", label: "Team" },
  ];
  const mine = [
    ["Open", "Confirm revised release date", "Today"],
    ["Waiting", "Supplier production update", "Monitored"],
    ["Closed", "Warehouse receiving tally", "Receipt attached"],
  ];
  const team = [
    ["Open", "Review margin exception", "Finance"],
    ["Waiting", "Customer artwork approval", "Buyer"],
    ["Closed", "Container pickup booked", "Confirmation attached"],
  ];
  const rows = active === "mine" ? mine : team;

  return (
    <section className="ubik-demo" aria-label="Interactive Tasks guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Tasks</span><span className="ubik-demo__status"><i /> obligations</span></div>
      <DemoTabs tabs={tabs} active={active} onChange={setActive} label="Task ownership" />
      <div className="ubik-demo__kpis">
        <div><span>Open</span><strong>7</strong></div><div><span>Waiting</span><strong>12</strong></div><div><span>Closed today</span><strong>4</strong></div>
      </div>
      <div className="ubik-demo__rows">
        {rows.map(([state, task, owner]) => (
          <div className="ubik-demo__row" key={task}>
            <span className={`ubik-demo__badge is-${state.toLowerCase()}`}>{state}</span><b>{task}</b><span>{owner}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const WorkflowPrototype = ({ compact = false }) => {
  const [active, setActive] = useState("library");
  const tabs = [
    { id: "library", label: "Library" },
    { id: "live", label: "Live" },
    { id: "map", label: "Week 1 map" },
  ];

  return (
    <section className={`ubik-demo ${compact ? "is-compact" : ""}`} aria-label="Interactive workflow guide">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Workflows</span><span className="ubik-demo__status"><i /> interactive guide</span></div>
      <DemoTabs tabs={tabs} active={active} onChange={setActive} label="Workflow guide state" />

      {active === "library" && (
        <div className="ubik-demo__body">
          <p className="ubik-demo__eyebrow">Choose a team, then one loop</p>
          <div className="ubik-demo__team-grid">
            <button type="button" onClick={() => setActive("live")}><span>Sales ops</span><b>Enquiry to quote</b><small>Designed</small></button>
            <button type="button" onClick={() => setActive("live")}><span>Operations</span><b>Packaging SLA</b><small className="is-live">Live</small></button>
            <button type="button" onClick={() => setActive("map")}><span>Planning</span><b>Demand and supply</b><small>Map</small></button>
          </div>
        </div>
      )}

      {active === "live" && (
        <div className="ubik-demo__body">
          <div className="ubik-demo__artifact-head"><div><p className="ubik-demo__eyebrow">Live workflow</p><strong>Packaging SLA</strong></div><span className="ubik-demo__badge is-ready">In SLA</span></div>
          <div className="ubik-demo__kpis"><div><span>Open</span><strong>7</strong></div><div><span>On track</span><strong>6</strong></div><div><span>Critical</span><strong>1</strong></div></div>
          <div className="ubik-demo__row"><span className="ubik-demo__badge is-critical">Critical</span><b>Release declaration waiting</b><span>1 day behind</span></div>
        </div>
      )}

      {active === "map" && (
        <div className="ubik-demo__body">
          <p className="ubik-demo__eyebrow">Week 1 · one operating loop</p>
          <div className="ubik-demo__flow">
            <div><span>01</span><b>Customer provides</b><small>Plan · production · arrivals</small></div>
            <div><span>02</span><b>ubik checks</b><small>Snapshot · remaining demand</small></div>
            <div><span>03</span><b>ubik alerts</b><small>Conflict · delay · missing input</small></div>
            <div><span>04</span><b>Operator decides</b><small>Owner · action · reviewed write</small></div>
          </div>
        </div>
      )}
    </section>
  );
};

export const WatchPrototype = () => {
  const [active, setActive] = useState("ask");
  const tabs = [
    { id: "ask", label: "Ask ubik" },
    { id: "inbox", label: "Inbox" },
    { id: "tasks", label: "Tasks" },
    { id: "workflows", label: "Workflows" },
    { id: "memory", label: "Trade memory" },
    { id: "finetuning", label: "Finetuning" },
  ];
  const copy = {
    ask: ["01 / 06", "Question becomes an artifact", "Attach only context that can change the answer."],
    inbox: ["02 / 06", "Thread becomes a reviewed move", "Read the source, inspect the deciding context, then reply or assign."],
    tasks: ["03 / 06", "Follow-up keeps an owner", "Open, waiting, and closed name who owes the move and what proves completion."],
    workflows: ["04 / 06", "Repeated work becomes a contract", "Inputs, checks, alerts, review, and outcome stay visible."],
    memory: ["05 / 06", "Approved work becomes trade memory", "The next question can recall the decision, evidence, and handoff."],
    finetuning: ["06 / 06", "Failures become a tested update", "Approved examples, edits, and rejections define the next evaluation set."],
  };

  return (
    <section className="ubik-demo ubik-watch" aria-label="Six-part ubik product walkthrough">
      <div className="ubik-demo__bar"><span className="ubik-demo__identity">Watch</span><span className="ubik-demo__status"><i /> six states</span></div>
      <DemoTabs tabs={tabs} active={active} onChange={setActive} label="Watch lesson" />
      <div className="ubik-watch__stage">
        <div className="ubik-watch__copy"><span>{copy[active][0]}</span><strong>{copy[active][1]}</strong><p>{copy[active][2]}</p></div>
        <div className={`ubik-watch__visual is-${active}`}>
          {active === "ask" && <><span className="ubik-demo__chip"><span>S</span>Slack</span><div className="ubik-watch__prompt">Create the brief →</div><div className="ubik-watch__result">Artifact ready</div></>}
          {active === "inbox" && <><div className="ubik-watch__mail"><b>Buyer reply</b><span>Promise date changed</span></div><div className="ubik-watch__result">Reply · Assign · Wait</div></>}
          {active === "tasks" && <><div className="ubik-watch__meter"><span>Open 7</span><span>Waiting 12</span><span>Closed 4</span></div><div className="ubik-watch__result">Receipt attached</div></>}
          {active === "workflows" && <div className="ubik-demo__flow"><div><span>01</span><b>Input</b></div><div><span>02</span><b>Check</b></div><div><span>03</span><b>Alert</b></div><div><span>04</span><b>Decide</b></div></div>}
          {active === "memory" && <><div className="ubik-watch__sources"><span>Email</span><span>ERP</span><span>Decision</span></div><div className="ubik-watch__result">One memory thread</div></>}
          {active === "finetuning" && <><div className="ubik-watch__sources"><span>Approved</span><span>Edited</span><span>Rejected</span></div><div className="ubik-watch__result">Run evaluation → Release</div></>}
        </div>
      </div>
    </section>
  );
};
