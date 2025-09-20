# 🤖 AI-Driven Setup Instructions

## MCP Servers Available
You now have access to two powerful MCP servers:
1. **Shadcn MCP** - For installing and managing UI components  
2. **Playwright MCP** - For browser automation and testing

## Setup Steps for AI Assistant

### Phase 1: UI Framework Setup
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

### Phase 2: Project Architecture
Ask your AI assistant to:
```
Create the following structure using file operations:
1. /app layout with navigation
2. /components folder organization
3. /lib utilities setup
4. Environment configuration
5. TypeScript configuration optimization
```

### Phase 3: Development Tools
Ask your AI assistant to:
```
Using Playwright MCP and file operations:
1. Set up Playwright testing configuration
2. Create smoke tests
3. Add development scripts to package.json
4. Configure debugging setup
```

## Available MCP Commands

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
"Set up a Next.js project with Shadcn UI components and Playwright testing. Initialize shadcn/ui with a modern theme and install essential components like button, card, and form elements. Set up Playwright for automated testing."

### Component Installation
"Using Shadcn MCP, show me all available components, then install a complete form system including form, input, select, checkbox, radio-group, and form validation."

### Visual Testing Setup
"Use Playwright MCP to navigate to http://localhost:3000, take screenshots at mobile (375px), tablet (768px), and desktop (1280px) widths. Check for console errors and verify all navigation links work."

## Verification Commands

After setup, ask your AI to verify:
1. "Check if all MCP servers are connected properly"
2. "List all installed shadcn components"
3. "Show the current project configuration"
4. "Take a screenshot of the running development server"