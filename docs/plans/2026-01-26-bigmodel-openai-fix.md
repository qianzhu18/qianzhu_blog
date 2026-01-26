# BigModel OpenAI Compatibility Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure BigModel Coding API (OpenAI-compatible) uses GLM-4.7 correctly, and remove “free quota” messaging from server error payloads.

**Architecture:** Keep provider selection in `pages/api/ai/chat.js` but ensure ZAI key + BigModel base URL uses `ZAI_MODEL` (fallback GLM-4.7). Update error mapping for insufficient quota to a neutral message. Validate with focused Jest tests and a local API curl check.

**Tech Stack:** Next.js 14, Node 20+, Jest.

### Task 1: Tests for model selection + quota message

**Files:**
- Modify: `__tests__/pages/api/ai/chat-rate-limit.test.js`
- Create: `__tests__/pages/api/ai/chat-model-selection.test.js`

**Step 1: Write failing test for insufficient quota message**

```js
it('does not mention free quota in insufficient balance message', async () => {
  process.env.ZAI_API_KEY = 'test-zai-key'
  process.env.ZAI_API_BASE_URL = 'https://api.z.ai/api/anthropic'
  global.fetch.mockResolvedValue({ ok: false, status: 402, text: async () => 'quota' })
  // expect user_message not to contain '免费额度'
})
```

**Step 2: Write failing test for BigModel model selection**

```js
process.env.ZAI_API_KEY = 'test-zai-key'
process.env.ZAI_API_BASE_URL = 'https://open.bigmodel.cn/api/coding/paas/v4'
process.env.ZAI_MODEL = 'GLM-4.7'
// mock OpenAI client and assert create() uses model GLM-4.7
```

**Step 3: Run tests to verify they fail**

Run: `npm test -- __tests__/pages/api/ai/chat-rate-limit.test.js __tests__/pages/api/ai/chat-model-selection.test.js`
Expected: FAIL (quota message still references free quota; model selection ignores ZAI_MODEL).

**Step 4: Commit tests**

```bash
git add __tests__/pages/api/ai/chat-rate-limit.test.js __tests__/pages/api/ai/chat-model-selection.test.js
git commit -m "test: cover BigModel model selection and quota messaging"
```

### Task 2: Implement provider model selection + neutral quota message

**Files:**
- Modify: `pages/api/ai/chat.js`

**Step 1: Update insufficient balance message**

```js
return { status: 402, error_code: 'INSUFFICIENT_QUOTA', user_message: '服务暂时不可用，请稍后再试。' }
```

**Step 2: Ensure ZAI key uses ZAI_MODEL for OpenAI-compatible base URL**

```js
const defaultModel = usingAnthropic
  ? (process.env.ZAI_MODEL || process.env.AI_MODEL || 'GLM-4.7-FlashX')
  : (zaiKey ? (process.env.ZAI_MODEL || process.env.AI_MODEL || 'GLM-4.7') : ...)
```

**Step 3: Run tests to verify they pass**

Run: `npm test -- __tests__/pages/api/ai/chat-rate-limit.test.js __tests__/pages/api/ai/chat-model-selection.test.js`
Expected: PASS.

**Step 4: Commit**

```bash
git add pages/api/ai/chat.js
git commit -m "fix: use GLM-4.7 with BigModel and neutral quota messaging"
```

### Task 3: Local env + runtime verification

**Files:**
- Modify: `.env.local` (worktree only, untracked)

**Step 1: Ensure ZAI_MODEL is set**

```
ZAI_MODEL=GLM-4.7
```

**Step 2: Restart dev server**

Run: `npm run dev:3001`

**Step 3: Verify with curl**

Run: `curl -s -X POST http://localhost:3001/api/ai/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"ping"}],"stream":false}'`
Expected: 200 with reply.
