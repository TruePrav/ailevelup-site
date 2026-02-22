# ailevelup.ca

> "Chat with your new 24/7 team now"

AI agents demo site for ailevelup.ca — lets prospects chat live with Scout (customer support), Ledger (reconciliation), and Aria (content) before buying.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## Deploy

**Frontend → Vercel**
1. Push to GitHub
2. Connect repo to Vercel
3. Add `ANTHROPIC_API_KEY` in Vercel environment variables

**Chat API** runs as a Next.js edge function — no separate backend needed for the demo.
When you're ready to plug in the real LangChain agents (Scout/Ledger/Alfred), swap `app/api/chat/route.ts` to call your Python server instead.

## Customization

### Add real robot-human images
In `components/AgentCard.tsx`, find the `AgentAvatar` component and replace the gradient div with:
```tsx
<img src="/images/scout-avatar.jpg" alt="Scout" className="w-full h-full object-cover rounded-full" />
```
Midjourney prompt: `"AI assistant with human features, professional headshot, dark background, photorealistic, business casual, robot"`

### Add an agent
Edit `lib/agents.ts` — add a new entry to `AGENTS` array with the agent's system prompt and opening message.

### Connect real LangChain agents
Replace the Anthropic call in `app/api/chat/route.ts` with a fetch to your `play-agent-network` server:
```ts
const res = await fetch(`${process.env.AGENT_SERVER_URL}/chat`, {
  method: "POST",
  body: JSON.stringify({ agentId, messages }),
});
```

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Anthropic SDK (claude-haiku-4-5 — fast + cheap for demos)
- TypeScript
- Edge runtime for streaming

## File Structure
```
app/
  page.tsx          — homepage
  layout.tsx        — root layout + metadata
  globals.css       — base styles
  api/chat/
    route.ts        — streaming chat API
components/
  AgentCard.tsx     — agent card with live chat
lib/
  agents.ts         — agent configs, prompts, personalities
```
