# 🤖 AI-Driven Setup Instructions

## MCP Servers Available
You now have access to three powerful MCP servers:
1. **Next.js MCP** - For creating and managing Next.js projects
2. **Shadcn MCP** - For installing and managing UI components  
3. **Playwright MCP** - For browser automation and testing

## Setup Steps for AI Assistant

### Phase 1: Project Initialization
Ask your AI assistant to:
```
Using the Next.js MCP server:
1. Initialize a new Next.js project with:
   - TypeScript enabled
   - Tailwind CSS
   - App Router
   - ESLint
   - src/ directory: No
   - Import alias: @/*

2. Install essential dependencies
3. Set up the project structure
```

### Phase 2: UI Framework Setup
Ask your AI assistant to:
```
Using the Shadcn MCP server:
1. Initialize shadcn/ui in the project
2. Install these starter components:
   - button
   - card
   - input
   - dialog
   - dropdown-menu
   - navigation-menu
   - sheet
   - toast
3. Set up the component registry
```

### Phase 3: Project Architecture
Ask your AI assistant to:
```
Create the following structure using MCP tools:
1. /app layout with navigation
2. /components folder organization
3. /lib utilities setup
4. Environment configuration
5. TypeScript configuration optimization
```

### Phase 4: Development Tools
Ask your AI assistant to:
```
Using Playwright MCP and file operations:
1. Set up Playwright testing configuration
2. Create smoke tests
3. Add development scripts to package.json
4. Configure debugging setup
```

## Available MCP Commands

### Next.js MCP Tools
- `create_nextjs_project` - Initialize a new Next.js app
- `run_nextjs_command` - Execute Next.js CLI commands
- `install_package` - Add npm packages
- `analyze_build` - Analyze bundle size
- `dev_server` - Manage development server

### Shadcn MCP Tools  
- `init` - Initialize shadcn/ui
- `add` - Add components
- `diff` - Check for updates
- `update` - Update components
- `list` - List available components

### Playwright MCP Tools
- `navigate` - Navigate to URL
- `screenshot` - Capture screenshots
- `click` - Click elements
- `fill` - Fill form fields
- `evaluate` - Execute JavaScript

## Example Prompts for Your AI

### Complete Project Setup
"Set up a new Next.js project using the Next.js MCP. Initialize it with TypeScript, Tailwind, and App Router. Then use Shadcn MCP to add a modern UI system with button, card, and navigation components. Finally, use Playwright MCP to verify the development server is running correctly."

### Component Installation
"Using Shadcn MCP, show me all available components, then install a complete form system including form, input, select, checkbox, radio-group, and form validation."

### Visual Testing Setup
"Use Playwright MCP to navigate to http://localhost:3000, take screenshots at mobile (375px), tablet (768px), and desktop (1280px) widths. Check for console errors and verify all navigation links work."

## Verification Commands

After setup, ask your AI to verify:
1. "Check if all MCP servers are connected properly"
2. "List all installed shadcn components"
3. "Show the current Next.js project configuration"
4. "Take a screenshot of the running development server"