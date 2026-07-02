..<div align="center">

# ◆ Clarus

### Agentic Accounts Payable — orchestrated & governed on the UiPath Platform

*Agents do the routine work. People decide the exceptions. Every dollar is on the audit trail.*

<br/>

![UiPath](https://img.shields.io/badge/UiPath-Maestro-FA4616?style=for-the-badge&logo=uipath&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

<br/>

**UiPath AgentHack 2026 · Track 2 — UiPath Maestro BPMN**

</div>

---

## ✦ Overview

**Clarus** runs the **Invoice-to-Pay** process from end to end. Invoices arrive by
email, EDI, or upload; AI agents extract and validate them; a deterministic 3-way
match checks each invoice against its purchase order and goods receipt; clean,
in-policy invoices are paid straight through; and anything with an exception is
classified, explained, and routed to a human reviewer who approves, rejects, or
escalates.

**UiPath Maestro orchestrates the entire flow** and keeps a human in charge at
every money-moving decision.

> 🟢 **Status:** runs end-to-end on UiPath — Maestro BPMN process → live agent
> call → Action Center human approval → completion.

---

## ✦ The problem

Accounts payable is high-volume, exception-heavy, and expensive. Most invoices are
routine — but the few with **price variances, short deliveries, missing POs, or
duplicates** consume the bulk of an AP team's time, and a missed duplicate or an
over-billed line is real money lost.

Clarus lets agents handle the high-volume work (reading documents, matching,
classifying) so people spend their time only on the exceptions that genuinely need
judgment — with a full audit trail behind every decision.

---

## ✦ How it works

```
  Invoice arrives
        │
        ▼
   ┌─────────┐    ┌────────────────────┐    ┌───────────────┐
   │ Ingest  │──▶ │ Extract & Normalize │──▶ │  3-Way Match  │
   │  (RPA)  │    │      (AI agent)     │    │    (agent)    │
   └─────────┘    └────────────────────┘    └───────┬───────┘
                                                    │
                                ┌─── clean & ≤ $10k ─┤
                                ▼                    ▼  exception / over threshold
                         ┌────────────┐      ┌───────────────────┐
                         │Auto-approve│      │ Exception Triage  │
                         └─────┬──────┘      │      (agent)      │
                               │             └─────────┬─────────┘
                               │                       ▼
                               │              ┌───────────────────┐
                               │              │     AP Review     │
                               │              │  (human-in-loop)  │
                               │              │ approve / reject /│
                               │              │     escalate      │
                               │              └─────────┬─────────┘
                               ▼                        ▼
                         ┌──────────────────────────────────────┐
                         │  Post to ERP (RPA)  →  Paid / Closed  │
                         └──────────────────────────────────────┘
```

Every step writes to the audit log — full lineage from ingestion to payment, with
the human decision recorded for compliance.

---

## ✦ The agent workforce

| Agent / Robot | Type | Responsibility |
|---|---|---|
| **Extraction Agent** | Python coded agent · LLM with structured outputs | Raw document → structured invoice (vendor, line items, totals, PO ref). |
| **Match Agent** | Python coded agent · deterministic | 3-way match across invoice ↔ PO ↔ goods receipt; reproducible for auditors. |
| **Triage Agent** | Python coded agent · LLM reasoning | Classifies the exception (price variance, quantity, duplicate, missing PO) and recommends an action with rationale. |
| **ERP Robot** | UiPath RPA (unattended) | Posts approved invoices to the ERP and schedules payment. |

The match step is intentionally **rule-based, not LLM-based** — a 3-way match is
exact arithmetic and auditors need it reproducible. The reasoning lives in the
downstream Triage Agent, which only runs when an exception is found.

---

## ✦ Tech stack

| Layer | Technology |
|---|---|
| **Orchestration** | UiPath Maestro (BPMN 2.0), Orchestrator, Action Center |
| **Agents** | Python · FastAPI · structured-output LLM via OpenRouter |
| **Console (UI)** | React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion |
| **Integration** | HTTP (Maestro → FastAPI service) |

---

## ✦ Repository structure

```
clarus/
├── src/                       # The Console — React + TypeScript dashboard
│   ├── pages/                 #   landing + console pages (dashboard, queue, …)
│   └── components/            #   UI + console components
├── agents/                    # The AI agents (Python)
│   ├── clarus_agents/         #   extraction · match · triage
│   ├── server.py              #   FastAPI service (the seam UiPath calls)
│   ├── run_demo.py            #   run the full pipeline locally
│   └── sample_data/           #   sample invoice + PO + receipt
├── docs/                      # UiPath build guide + demo script
└── START_HERE.md              # how to run everything (read this first)
```

---

## ✦ Getting started

> 📘 **Full step-by-step guide:** see **[START_HERE.md](START_HERE.md)**.

### 1 · The Console (website)

```bash
npm install
npm run dev
```
Open **http://localhost:5173**. The Console runs on built-in sample data — no
backend required.

### 2 · The agents

```bash
cd agents
pip install -r requirements.txt
cp .env.example .env          # add your OPENROUTER_API_KEY
uvicorn server:app --port 8000
```
Try the pipeline: **http://localhost:8000/demo**

### 3 · On the UiPath Platform

Follow **[docs/UIPATH_BUILD_GUIDE.md](docs/UIPATH_BUILD_GUIDE.md)** to stand up the
Maestro BPMN process, the Orchestrator queue, and the Action Center human task,
then run the flow end to end.

---

## ✦ Key features

- 🧠 **Agentic processing** — extraction, matching, and triage handled by agents.
- ⚖️ **Deterministic 3-way match** — reproducible, auditable arithmetic.
- 🙋 **Human-in-the-loop** — every exception and any invoice over the policy
  threshold pauses for a named human approval before money moves.
- 🔀 **Straight-through processing** — clean, in-policy invoices auto-approve.
- 🛡️ **Governance by design** — least-privilege agents, full audit lineage, every
  decision traceable to who approved it and why.
- 🎛️ **Operations console** — dashboard, invoice queue, invoice detail with the
  agent timeline, process view, and governance.

---

## ✦ License

Released under the [MIT License](LICENSE).
