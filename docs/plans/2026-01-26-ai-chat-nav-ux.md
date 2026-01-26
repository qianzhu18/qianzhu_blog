# AI Chat + Nav UX Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove visible quota prompts from the AI chat UI, only notify on real rate-limit failures, and fix nav submenu white-on-white text via scoped class override.

**Architecture:** Add a dedicated class to submenu buttons, override its color in the theme styles; remove quota UI/state from the AI drawer; add rate-limit classification in `/api/ai/chat` with ZAI-first provider selection.

**Tech Stack:** Next.js 14, React 18, Jest + RTL, Tailwind utilities with theme global CSS.

### Task 1: Nav submenu button class + test

**Files:**
- Modify: `__tests__/themes/qianqian/MenuItem.test.js`
- Modify: `themes/qianqian/components/MenuItem.js`
- Modify: `themes/qianqian/style.js`

**Step 1: Write the failing test**

```js
it('adds qianqian-nav-button class for top-level submenu buttons', () => {
  render(<MenuItem link={{ name: 'Menu', subMenus: [{ name: 'Child', href: '/child' }] }} depth={0} />)
  const btn = screen.getByRole('button', { name: /menu/i })
  expect(btn.className).toContain('qianqian-nav-button')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/themes/qianqian/MenuItem.test.js`
Expected: FAIL because class does not exist yet.

**Step 3: Write minimal implementation**

```js
// MenuItem.js: add qianqian-nav-button to submenu button className
```

**Step 4: Add style override**

```css
#theme-qianqian .qianqian-nav-button { color: var(--dewx-text) !important; }
```

**Step 5: Run test to verify it passes**

Run: `npm test -- __tests__/themes/qianqian/MenuItem.test.js`
Expected: PASS.

**Step 6: Commit**

```bash
git add __tests__/themes/qianqian/MenuItem.test.js themes/qianqian/components/MenuItem.js themes/qianqian/style.js
git commit -m "fix: correct qianqian nav submenu text color"
```

### Task 2: Remove quota UI from AI drawer

**Files:**
- Create: `__tests__/components/AiChatDrawer.test.js`
- Modify: `components/Ai/AiChatDrawer.js`

**Step 1: Write the failing test**

```js
render(<AiChatDrawer />)
expect(screen.queryByText(/免费剩余/)).toBeNull()
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/components/AiChatDrawer.test.js`
Expected: FAIL because quota label is currently rendered.

**Step 3: Write minimal implementation**

```js
// Remove quota state, labels, and UI blocks that mention free quota
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/components/AiChatDrawer.test.js`
Expected: PASS.

**Step 5: Commit**

```bash
git add __tests__/components/AiChatDrawer.test.js components/Ai/AiChatDrawer.js
git commit -m "feat: remove AI chat quota prompts"
```

### Task 3: Rate-limit error classification + ZAI-first default

**Files:**
- Create: `__tests__/pages/api/ai/chat-rate-limit.test.js`
- Modify: `pages/api/ai/chat.js`

**Step 1: Write the failing test**

```js
// Mock fetch to return 429 or 'rate limit' text; expect RATE_LIMIT and 429
```

**Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/pages/api/ai/chat-rate-limit.test.js`
Expected: FAIL (currently returns AI_ERROR).

**Step 3: Write minimal implementation**

```js
// Add rate-limit detection to getErrorPayload
// Prefer ZAI provider over OpenRouter when both keys exist
```

**Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/pages/api/ai/chat-rate-limit.test.js`
Expected: PASS.

**Step 5: Commit**

```bash
git add __tests__/pages/api/ai/chat-rate-limit.test.js pages/api/ai/chat.js
git commit -m "fix: classify AI rate limits and prefer ZAI"
```

### Task 4: Final verification

**Files:**
- (none)

**Step 1: Run focused tests**

Run: `npm test -- __tests__/themes/qianqian/MenuItem.test.js __tests__/components/AiChatDrawer.test.js __tests__/pages/api/ai/chat-rate-limit.test.js`
Expected: PASS.

**Step 2: Commit (if needed)**

```bash
git status -sb
```

**Step 3: Restart dev server on 3001**

Run: `npm run dev:3001`
Expected: Server running on http://localhost:3001
