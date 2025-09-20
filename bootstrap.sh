#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-figbox-app}"

# 1) Create a Next.js + TS + Tailwind app
npx create-next-app@latest "$PROJECT_NAME" \
  --ts --tailwind --eslint --app --use-npm --import-alias "@/*"

cd "$PROJECT_NAME"

# 2) Add Shadcn UI (CLI) and a couple of starter components
npx shadcn@latest init -y || npx shadcn@latest init
npx shadcn@latest add button card input

# 3) Minimal components.json with registries (default shadcn + room for more)
cat > components.json <<'JSON'
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/r/{name}.json"
  }
}
JSON
# 4) Enable Shadcn MCP (official init) + Playwright

# 4a) **Enable Shadcn MCP** using the official init (you can switch `--client` to `cursor` or `vscode`):
npx shadcn@latest mcp init --client claude

# (Fallback/manual) If you prefer a project-local config, drop this into **.mcp.json**:
cat > .mcp.json <<'JSON'
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
JSON

# 4b) **Verify connection** in your AI client:
# - Run `/mcp` and confirm you see **shadcn** with tools available (browse/search/install).
# - Try prompts like: 
#   - "Show me all available components in the shadcn registry" 
#   - "Add the button, dialog, and card components to my project"
# 5) Playwright test deps (optional but handy for non‑MCP e2e too)
npm i -D @playwright/test
cat > playwright.config.ts <<'TS'
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } }
  ]
});
TS
mkdir -p tests
cat > tests/smoke.spec.ts <<'TS'
import { test, expect } from '@playwright/test';

test('homepage has Next link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Learn' })).toBeVisible();
});
TS
# 6) Agent ops guide (claude.md) with visual dev/testing playbooks
cat > claude.md <<'MD'
# Claude Code Ops Guide

## Commands you should expose
- `/specify` – create or update **spec.md** from business intent.
- `/plan`    – create **plan.mmd** + **research.md** (stack + rationale).
- `/tasks`   – derive **tasks.md** (MVP first).

## Visual development & testing
When you change frontend code, do this automatically using **Playwright MCP**:
1. Navigate to affected routes.
2. Compare against the **Design Principles** (below) and acceptance criteria in spec.md.
3. Capture screenshots for each change.
4. Report console errors and network failures.
5. Regress at widths: **375**, **768**, **1280**.
### Useful MCP prompts
- "Use *playwright* MCP to open the dev server at http://localhost:3000 and screenshot the Dashboard."
- "Resize to 375px width and verify the sidebar collapses into a sheet trigger."
- "List console messages and network errors for this page."

## Design Principles
- **Spacing:** 8px scale; section paddings 24–40px; card gaps 16px.
- **Type:** Use Tailwind defaults; clamp headings; never <14px body.
- **Color:** Start with neutral base; primary at 600 for action; WCAG AA.
- **Borders/Shadows:** 1px borders; soft shadows only on interactive containers.
- **States:** Hover, focus-visible rings, disabled and loading must be implemented.

## Specialized sub‑agents (roles)
- **Shadcn Requirements Analyzer:** Produce `requirements.mmd` from spec/tasks.
- **Shadcn Component Researcher:** Propose components/registries + install steps.
- **Shadcn Implementation Builder:** Implement UI referencing research+requirements.
- **Design Review Agent:** Full responsive/accessibility pass with Playwright MCP.
MD
# 7) Spec Kit artifacts (placeholders)
cat > spec.md <<'MD'
# Product Spec

## Summary
> One‑paragraph description of the app and the user value.

## Goals & Non‑Goals
- Goals: ...
- Non‑Goals: ...

## User Scenarios
- New customer ...
- Subscriber ...
- Admin ...

## Acceptance Criteria
- Feature A ...
- Feature B ...

## Need Clarification
- [ ] Question 1
- [ ] Question 2
MD
cat > plan.mmd <<'MD'
\`\`\`mermaid
flowchart TD
  A[App Shell (Next.js)] --> B[Auth]
  A --> C[Feature Modules]
  A --> D[Design System (shadcn/ui)]
  B --> E[DB/API]
  C --> E
\`\`\`
MD

cat > research.md <<'MD'
# Technical Research & Decisions

## Stack
* Framework: Next.js (App Router, TS)
* UI: shadcn/ui via MCP
* Testing/Verification: Playwright MCP (+ @playwright/test optional)

## Rationale & Alternatives
* Why this stack ...
* Alternatives considered ...

## Data Model (initial)
* User, Session, ...

## Risks
* ...
MD
cat > tasks.md <<'MD'
# Task List (MVP first)

1. Project setup & CI
2. Auth scaffolding
3. Home shell + navigation (shadcn/ui)
4. Feature X (mock data)
5. API routes for X
6. State management (server components + hooks)
7. Responsive review (Playwright MCP)
8. Accessibility pass
MD

# 8) Example page using shadcn components
mkdir -p app/\(marketing\)
cat > app/\(marketing\)/page.tsx <<'TSX'
export default function Page() {
  return (
    <main className="container mx-auto max-w-5xl p-8 space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">You now have Spec Kit + Shadcn MCP + Playwright MCP wired up.</p>
      </section>
    </main>
  );
}
TSX
# 9) Friendly README
cat > README.md <<'MD'
# ${PROJECT_NAME}

A spec‑driven Next.js app with Shadcn MCP and Playwright MCP.

## Dev

\`\`\`bash
npm run dev
\`\`\`

Open your AI client and:

* \`/specify\` – draft or update **spec.md**
* \`/plan\` – create **plan.mmd** + **research.md**
* \`/tasks\` – generate **tasks.md**
* \`/mcp\` – verify **shadcn** and **playwright** are connected

## Visual verification via MCP

Ask your agent to use Playwright MCP to:

* Navigate to pages, capture screenshots, list console errors/network requests
* Resize to 375/768/1280 and verify layout
* Validate acceptance criteria from the spec
MD

# 10) Initial git commit
git init && git add . && git commit -m "chore: bootstrap Spec Kit + Shadcn MCP + Playwright MCP"

echo ""
echo "✔ ${PROJECT_NAME} is ready. Run: cd ${PROJECT_NAME} && npm run dev"