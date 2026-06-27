# UiPath build guide — Clarus Invoice-to-Pay

This is the step-by-step to stand up the Clarus solution on **your** UiPath
Automation Cloud tenant (org `dharancloud`). The coded agents and the Console UI
are already built in this repo; this guide wires them together through Maestro so
the solution actually *runs on the platform* — which is the hackathon's core
requirement.

> **Time:** ~2–3 hours for a first-timer. Do it in the order below; each section
> ends with a checkpoint you can verify before moving on.

> **Note on labels:** UiPath ships UI updates frequently, so a button may be
> named slightly differently than written here. The *concepts* (process, task,
> gateway, robot, action) are stable — match on those.

---

## 0. Prerequisites checkpoint

- [ ] You can log into `cloud.uipath.com` and see **Studio, Agents, Maestro, Orchestrator** (you confirmed this).
- [ ] The coded agents run locally: `cd agents && python run_demo.py` prints an extract → match → triage result.
- [ ] You have an **OpenRouter API key** in `agents/.env` (`OPENROUTER_API_KEY=...`).

---

## 1. Make the agents reachable from UiPath

Maestro calls the agents over HTTP. For the demo you have two options:

**Option A — quickest (local + tunnel).** Run the FastAPI service and expose it:

```bash
cd agents
uvicorn server:app --port 8000
# in another terminal, tunnel it so UiPath Cloud can reach it:
npx localtunnel --port 8000      # or: ngrok http 8000
```

Copy the public URL it prints (e.g. `https://clarus-xyz.loca.lt`). Test it:
`GET <public-url>/health` should return `{"status":"ok"}`.

**Option B — UiPath-native (no external host).** Rebuild the three agents inside
**Agent Builder** using the same system prompts from `agents/clarus_agents/*.py`,
and the Match step as a coded/RPA activity. Heavier, but everything lives on the
platform. Start with Option A for the demo; mention Option B as the production
path.

**Checkpoint:** `<public-url>/health` returns ok from a browser.

---

## 2. Create the Orchestrator pieces

In **Orchestrator** (DefaultTenant):

1. **Queue** `Clarus_Invoices` — holds incoming invoices (Automation → Queues → Add).
2. **Storage bucket** `clarus-docs` (optional) — for invoice files.
3. Confirm you have an **unattended robot / machine** available (Tenant → Machines). The Community tenant includes one.

**Checkpoint:** the `Clarus_Invoices` queue exists and is empty.

---

## 3. Build the ingestion robot (RPA)

In **Studio Web** (or Studio Desktop), create a small automation `Clarus.Ingest`:

1. Trigger: read a sample invoice (use `agents/sample_data/invoice_nimbus.txt`,
   or a Gmail/Outlook **Get Emails** activity if you want a live mailbox demo).
2. Add a **queue item** to `Clarus_Invoices` with the invoice text as the item
   payload (fields: `document`, and optionally `po`/`receipt` references).
3. Publish to Orchestrator.

**Checkpoint:** running `Clarus.Ingest` drops one item into `Clarus_Invoices`.

---

## 4. Build the Maestro BPMN process

Open **Maestro → New process** (`Clarus_InvoiceToPay`). Lay out this flow with
BPMN nodes:

1. **Start event** — "Invoice received" (trigger: new `Clarus_Invoices` queue item).
2. **Service task — Extract & Match**: an **API Workflow** / HTTP Request to
   `POST <public-url>/process` with body:
   ```json
   { "document": "<queue item document>",
     "purchase_order": { "po_number": "PO-77310", "total": 18250, "quantity": 13 },
     "goods_receipt": { "received_quantity": 13, "ordered_quantity": 13 } }
   ```
   Store the JSON response in a process variable `result`.
3. **Exclusive gateway — "Clean & in policy?"**: branch on `result.route`.
   - `auto_approve` → go to step 6 (Post to ERP).
   - `human_review` → continue to step 4.
4. **User task (Action Center) — "AP review"**: present `result.invoice`,
   `result.match`, and `result.triage.recommendation` to the reviewer with three
   outcomes: **Approve / Reject / Escalate**. (Create an Action Center **app task**
   or form; map the agent's recommendation into the task so the human sees it.)
5. **Gateway on the human's choice**:
   - Approve → step 6.
   - Reject → **End event** "Rejected" (trigger a notification robot, optional).
   - Escalate → a second review task / **End event** "Escalated to Finance".
6. **Service task — Post to ERP (RPA)**: invoke an unattended robot
   `Clarus.PostToERP` (a stub that logs "posted to ERP, payment scheduled" is
   fine for the demo).
7. **End event** — "Paid / Closed".

Publish the process.

**Checkpoint:** the BPMN diagram shows start → extract/match → gateway → human
task → ERP → end, with reject/escalate branches.

---

## 5. Run it end to end

1. Trigger `Clarus.Ingest` (or add a queue item manually) using the **Nimbus**
   sample — it has a deliberate **$800 price variance** (premium support not on the
   PO), so it will route to **human review**.
2. Watch the Maestro instance advance through Extract & Match, hit the gateway,
   and **pause at the AP review task**.
3. Open the task in **Action Center**: you'll see the agent's recommendation
   ("approve with PO amendment — matches the signed MSA addendum"). Click
   **Approve**.
4. The process resumes, the ERP robot posts, and the instance ends at "Paid".
5. Try a **clean** invoice (edit the sample so the total matches the PO and is
   under $10k) — it should **auto-approve** with no human task. That contrast is
   the money shot for the demo.

**Checkpoint:** one invoice went straight-through; one paused for you, took your
decision, and completed. Both are visible in the Maestro run history.

---

## 6. (Optional) Point the Console at real data

The Clarus Console (`/app`) currently runs on mock data so it always demos
cleanly. To show live data, replace the array in `src/data/invoices.ts` with a
fetch from Orchestrator's Maestro/queue APIs. Keep the mock as a fallback so the
demo never depends on a live tenant during recording.

---

## What to capture for the submission

- A screen recording of section 5 (both the straight-through and the
  human-in-the-loop paths) — this is the core of the **demo video**.
- Screenshots of the Maestro BPMN diagram, the Action Center task, and the
  Orchestrator run history — for the **Devpost project page**.

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the 5-minute video structure.
