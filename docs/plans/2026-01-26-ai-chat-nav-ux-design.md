# AI Chat + Nav UX Design

**Goal:** Remove visible quota prompts from the AI chat UI, only notify on actual request failure (rate limit), and fix the white-on-white top nav submenu button text by scoping a high-priority color override.

**Architecture:** Keep the AI chat UX changes scoped to `components/Ai/AiChatDrawer.js` and error classification in the API route; avoid global UI changes. For the nav fix, add a dedicated class on submenu buttons in `themes/qianqian/components/MenuItem.js` and override text color in `themes/qianqian/style.js` with `!important` so it wins over the global `button` rule.

**Data Flow:**
- AI chat requests flow from the drawer to `/api/ai/chat`. The UI no longer tracks or displays local “free quota” state. Only when a request fails (e.g., HTTP 429 or “rate limit” message) does the API return a structured error payload, which the UI shows as the assistant’s response.
- Provider selection defaults to ZAI (Anthropic compatible) when available; OpenRouter is only a fallback. Custom API settings, if provided, still override defaults.

**Error Handling:**
- Add explicit rate-limit classification in the API route. Map 429 or error text containing “rate limit/too many requests” to `RATE_LIMIT` with a short user message. No preemptive UI prompts.

**Testing:**
- Unit test for nav submenu button to include the new class.
- UI test to ensure the AI drawer no longer renders “免费剩余”.
- API test to ensure 429/rate-limit errors return `RATE_LIMIT` and a 429 status.

**Risks / Non-goals:**
- No change to global button styling. Only scoped overrides for nav submenu buttons.
- No rate limiting in the client; only report real failures from the server.
