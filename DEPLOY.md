# Deploying Clarus to Render

Render hosts your app online for free. The big win: the **AI agents get a
permanent public URL**, so you can drop the cloudflare tunnel entirely — UiPath
just points at the Render URL forever.

This repo includes a **`render.yaml`** blueprint that sets everything up
automatically.

---

## What gets deployed

| Service | What | URL you'll get |
|---------|------|----------------|
| **clarus-agents** | The FastAPI AI agents | `https://clarus-agents.onrender.com` |
| **clarus-console** | The React dashboard | `https://clarus-console.onrender.com` |

---

## Steps

### 1. Make sure the code is on GitHub
It already is: https://github.com/Dharan-K/Project-Clarus
(If you change anything, `git push` again so Render gets the latest.)

### 2. Create a Render account
Go to **https://render.com** → **Get Started** → sign in with **GitHub**.

### 3. Deploy with the blueprint
1. In the Render dashboard, click **New +** → **Blueprint**.
2. Connect / pick your **Project-Clarus** repo.
3. Render reads `render.yaml` and shows the two services. Click **Apply**.

### 4. Add your secret key
Render will ask for the value of **`OPENROUTER_API_KEY`** (it's marked secret in
the blueprint). Paste your OpenRouter key (`sk-or-v1-...`). Without it, the agents
can't call the AI.

### 5. Wait for the build
First deploy takes a few minutes. When done, each service shows a green **Live**
badge and its URL.

### 6. Point UiPath at the permanent URL
In UiPath Studio → your process → the **"Call AI agents"** box → set the URL to:
```
https://clarus-agents.onrender.com/demo
```
That's it — **no tunnel, no re-pasting**. It stays the same every time. 🎉

---

## Important: the free tier "sleeps"

Render's free services **go to sleep after ~15 minutes of no traffic**. The next
request wakes them, which takes **~50 seconds** (a "cold start").

**Before a demo, wake the agents first:** open
`https://clarus-agents.onrender.com/health` in your browser and wait for
`{"status":"ok"}`. Then run your UiPath process — it'll respond fast.

> If a UiPath call ever times out, it's almost always the service waking up.
> Hit `/health` once, then retry.

---

## Quick checklist

- [ ] Code pushed to GitHub
- [ ] Render account created (via GitHub)
- [ ] New → Blueprint → Project-Clarus → Apply
- [ ] `OPENROUTER_API_KEY` secret added
- [ ] Both services show **Live**
- [ ] `/health` returns ok
- [ ] UiPath "Call AI agents" URL = `https://clarus-agents.onrender.com/demo`
