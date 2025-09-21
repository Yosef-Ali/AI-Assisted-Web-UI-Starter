# 🚀 AI-Assisted Web UI Starter - Quick Setup Guide

## Prerequisites
Make sure you have the following installed:
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git

## Setup Instructions

### 1. Run the Bootstrap Script
Open your terminal and run:

```bash
cd ~
./bootstrap.sh my-figbox-app
```

This will:
- Create a new Next.js app with TypeScript and Tailwind CSS
- Install and configure Shadcn UI
- Set up MCP servers for AI integration
- Create starter files and project structure

### 2. Navigate to Your Project
```bash
cd my-figbox-app
```

### 3. Start the Development Server
```bash
npm run dev
```

Your app will be running at: http://localhost:3000

## AI Integration Setup

### For Claude Desktop
The bootstrap script already configured the MCP servers. To verify:
1. Open Claude Desktop in your project folder
2. Type `/mcp` to see connected servers
3. You should see both `shadcn` and `playwright` servers

### For VS Code/Cursor
If using VS Code or Cursor, run:
```bash
npx shadcn@latest mcp init --client vscode
# or
npx shadcn@latest mcp init --client cursor
```

## Common Commands

### Install UI Components
Ask your AI assistant:
- "Show me all available components in the shadcn registry"
- "Install the button, card, and dialog components"
- "Add a data-table component to the project"

### Visual Testing with Playwright
Ask your AI assistant:
- "Open http://localhost:3000 and take a screenshot"
- "Test the site at mobile (375px), tablet (768px), and desktop (1280px) widths"
- "Check for console errors and network issues"

### Spec-Driven Development
Use these commands with your AI:
- `/specify` - Create or update the product spec
- `/plan` - Generate technical plan and architecture
- `/tasks` - Break down work into tasks

## Project Structure
```
my-figbox-app/
├── app/                 # Next.js app directory
├── components/          # UI components
├── lib/                 # Utility functions
├── public/              # Static assets
├── spec.md             # Product specification
├── plan.mmd            # Technical plan (Mermaid)
├── research.md         # Technical decisions
├── tasks.md            # Task breakdown
├── claude.md           # AI operation guide
└── .mcp.json           # MCP server configuration
```

## Troubleshooting

### If npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

### If MCP servers don't connect
1. Check `.mcp.json` exists in your project
2. Restart your AI client
3. Make sure you're in the project directory

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Next Steps
1. Start building your UI with Shadcn components
2. Use the AI assistant to iterate quickly
3. Test continuously with Playwright MCP
4. Commit your changes regularly

## Testing Overview

### Unit / Service Tests (Jest)
Run the fast TypeScript service + route unit tests:
```bash
npm test
```
Watch mode during development:
```bash
npm run test:watch
```

### End-to-End API Tests (Playwright)
These spin up the Next.js dev server (port 3000) and hit real API routes.
```bash
npm run test:e2e
```
In CI or headless environments:
```bash
npm run test:e2e:ci
```
Notes:
- GET /api/projects currently returns a service error (500) without Supabase env vars; the e2e test accommodates this until a mock or local DB is configured.
- Supply Supabase keys to exercise full success path:
```bash
export NEXT_PUBLIC_SUPABASE_URL=... \
	NEXT_PUBLIC_SUPABASE_ANON_KEY=...
npm run test:e2e
```

### Adding More E2E Tests
Create additional specs in `tests/e2e/*.spec.ts` importing from `@playwright/test`. Use the shared `baseURL` for route calls. Prefer API request fixtures (`request`) over full browser contexts until UI flows are ready.


Happy coding! 🎉