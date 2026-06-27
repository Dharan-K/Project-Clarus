# Clarus — 5-minute demo video script

The video is graded on **Completeness of Delivery** and **Presentation**, and it
must *show the solution running on the platform* (not slides). Target **4:45** to
leave headroom under the 5-minute cap. Record at 1080p.

> **Golden rule:** show the running system for at least 60% of the runtime.
> Architecture explanation is fine, but judges want to see it work.

---

### 0:00–0:30 — Hook & problem (talking head or Console landing)

> "Accounts payable is mostly routine — but the few exceptions, the duplicates,
> the short deliveries, eat all the time and cost real money. Clarus is an
> agentic accounts-payable solution that lets agents do the routine work and
> brings a human in only for the exceptions — all orchestrated and governed on
> the UiPath Platform."

Show the **Clarus landing page** (`localhost:5173`) — the "Power AP" hero.

---

### 0:30–1:15 — The architecture (Console → Process Flow)

Open the Console → **Process Flow** page. Walk the BPMN flow left to right:

> "An invoice arrives and an RPA robot ingests it. An extraction agent reads it,
> a match agent runs a 3-way match against the PO and goods receipt, and a
> gateway decides: clean and under policy threshold auto-approves; anything else
> goes to an exception-triage agent and then to a human. UiPath Maestro keeps the
> whole thing coordinated."

Name the actors as you point: **robot, agent, gateway, human, robot**.

---

### 1:15–2:30 — It runs on UiPath (THE platform proof)

Switch to **UiPath Cloud**. This is the most important segment.

1. Show **Maestro** with the `Clarus_InvoiceToPay` BPMN process open.
2. Trigger the **Nimbus** invoice (the one with the $800 price variance).
3. Show the Maestro instance advancing: Extract & Match → gateway → **pause** at
   the human task.
4. Open **Action Center** → show the agent's recommendation in the task →
   click **Approve**.
5. Show the process resume → ERP robot posts → instance ends at **Paid**.
6. Then trigger a **clean** invoice → show it **auto-approve** with no human task.

> "Same process, two paths: the clean one never touches a human; the exception
> paused, showed me the agent's reasoning, took my decision, and finished."

---

### 2:30–3:30 — The agents up close (Console + code)

Show the Console **Invoice Detail** page for the Nimbus invoice: extracted line
items, the 3-way match tiles, and the **Triage Agent recommendation** with its
rationale and confidence. Then cut to the terminal:

```bash
cd agents && python run_demo.py
```

> "Here are the actual agents. Extraction uses an LLM with structured outputs.
> The match is deterministic Python — auditors need it reproducible. Triage uses
> reasoning to weigh the policy and recommend an action. The human still decides."

---

### 3:30–4:45 — Governance & close

Open the Console **Governance** page: human-in-the-loop gates, least-privilege
agents, full audit lineage.

> "Autonomy with accountability — agents move fast, people stay in control of
> every dollar, and every decision is on the audit trail. That's Clarus:
> agentic accounts payable on UiPath."

End on the landing page.

---

## Shot checklist

- [ ] Landing hero
- [ ] Process Flow diagram (Console)
- [ ] **Maestro BPMN process running** (UiPath Cloud)
- [ ] **Action Center human task + approval** (UiPath Cloud)
- [ ] Auto-approve path (contrast)
- [ ] Invoice Detail with triage recommendation (Console)
- [ ] `run_demo.py` terminal output
- [ ] Governance page
