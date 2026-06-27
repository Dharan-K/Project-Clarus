# START HERE — how to run Clarus

This is the plain-English guide to running everything in this project. Clarus has
**three parts** that work together:

| # | Part | What it is | Where it runs |
|---|------|-----------|---------------|
| 1 | **The Website** (Console) | The dashboard you click around in | Your laptop, browser at `localhost:5173` |
| 2 | **The AI Agents** | The "brain" — reads an invoice, checks it, flags problems | Your laptop, `localhost:8000` |
| 3 | **UiPath Maestro** | The "manager" that runs the process + human approval | UiPath cloud (online) |

You don't always need all three. Pick what you want to do:

- **Just show the website?** → run Part 1 only.
- **Run the agents / a UiPath demo?** → run Parts 2 + 3 (the tunnel connects them).

---

## One-time setup (do this once)

1. **Install Node.js** (for the website): https://nodejs.org → download LTS → install.
2. **Install Python** (for the agents): https://python.org → install, tick "Add to PATH".
3. **Get an OpenRouter API key**: https://openrouter.ai/keys → create one.
4. **Make the env file**: create a file `agents/.env` containing one line:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
5. **Install the website's packages** (run once, from the project folder):
   ```powershell
   npm install
   ```
6. **Install the agents' packages** (run once):
   ```powershell
   cd agents
   pip install -r requirements.txt
   cd ..
   ```

---

## Part 1 — Run the Website (the Console)

From the project folder (`D:\PROJECTS\devpost1`):

```powershell
npm run dev
```

Then open the link it prints (usually **http://localhost:5173**) in your browser.
Press **Ctrl+C** in the terminal to stop it.

> This website runs on its own — it uses built-in sample data, so it works even
> without the agents or UiPath running. Great for screenshots and the demo.

---

## Part 2 — Run the AI Agents

The agents are a small web service. Open a terminal:

```powershell
cd agents
uvicorn server:app --port 8000
```

Test it works: open http://localhost:8000/health → you should see `{"status":"ok"}`.
Run the whole pipeline on the sample invoice: http://localhost:8000/demo

Press **Ctrl+C** to stop it.

---

## Part 3 — Connect the Agents to UiPath (the tunnel)

UiPath runs in the cloud and can't see your laptop directly. The **tunnel** gives
your agents a temporary public web address so UiPath can reach them.

**Keep Part 2 running**, then open a SECOND terminal:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000
```

It prints a public address like `https://something-random.trycloudflare.com`.

> ⚠️ **This address changes every time you restart the tunnel.** Each time you
> demo, copy the NEW address and paste it (with `/demo` on the end) into the
> **"Call AI agents"** box in your UiPath Maestro process.

To run a UiPath demo: in UiPath Studio, open your process and click **Debug** →
it calls your agents → pauses at **AP review** → approve it in **Action Center**.

---

## The "everything for a UiPath demo" checklist

1. Terminal 1: `cd agents` → `uvicorn server:app --port 8000`
2. Terminal 2: `& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000`
3. Copy the new `https://….trycloudflare.com` address.
4. In UiPath Studio → process → "Call AI agents" box → paste address + `/demo`.
5. Click **Debug** in Studio.
6. Go to **Action Center** → open "Review flagged invoice" → **Approve**.
7. Watch the process finish in Studio.

---

## Common problems

| Problem | Fix |
|---------|-----|
| `Port 5173 is in use` | An old website is still running. Close that terminal, or it'll just use 5174 — fine. |
| Agents error: `OPENROUTER_API_KEY is not set` | You're missing `agents/.env` (see setup step 4). |
| UiPath says the AI call failed | The tunnel address changed or isn't running. Restart Part 3 and re-paste the new address into UiPath. |
| `uvicorn` not found | Run `pip install -r requirements.txt` inside the `agents` folder. |
| Free AI model is slow / busy | Normal for free models. Retry, or set `CLARUS_MODEL` in `.env` to another model. |

---

## What each folder is

- `src/` — the website (React). Pages live in `src/pages/`.
- `agents/` — the Python AI agents + the `server.py` web service.
- `docs/` — the UiPath build guide and demo script.
