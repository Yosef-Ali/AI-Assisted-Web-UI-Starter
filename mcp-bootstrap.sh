#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-figbox-app}"

echo "🚀 Starting MCP-driven project setup for: $PROJECT_NAME"
echo ""
echo "This script will:"
echo "1. Create a minimal project folder"
echo "2. Set up MCP configuration"
echo "3. Guide you to use AI for the rest"
echo ""

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create MCP configuration file
cat > mcp.json <<'JSON'
{
  "mcpServers": {
    "nextjs": {
      "command": "npx",
      "args": ["-y", "@vercel-labs/mcp-server-nextjs"]
    },
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@shadcn/mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
JSON

# Create AI instructions file
cat > AI_SETUP_INSTRUCTIONS.md <<'MD'
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
MD
# Create spec-driven development templates
cat > spec-template.md <<'MD'
# Product Specification

## Project: $PROJECT_NAME

### Overview
[AI will fill: One paragraph describing the application and its core value proposition]

### Target Users
[AI will identify: Primary and secondary user personas]

### Core Features
[AI will define: 3-5 must-have features for MVP]

### Technical Requirements
- Framework: Next.js 15 with App Router
- UI: Shadcn/ui components
- Styling: Tailwind CSS
- Testing: Playwright
- Type Safety: TypeScript

### Success Metrics
[AI will define: How we measure if the project succeeds]

### Out of Scope
[AI will define: What we explicitly won't build in v1]
MD

cat > mcp-workflow.md <<'MD'
# MCP-Driven Development Workflow

## Development Cycle

### 1. Specification Phase
- Use AI to analyze requirements
- Generate spec.md from business needs
- Define acceptance criteria

### 2. Planning Phase  
- Use Next.js MCP to scaffold project structure
- Use Shadcn MCP to identify needed components
- Create technical architecture

### 3. Implementation Phase
- Use Next.js MCP for routing and API setup
- Use Shadcn MCP to add UI components
- Use Playwright MCP for continuous testing

### 4. Verification Phase
- Use Playwright MCP for visual regression
- Test at multiple breakpoints
- Verify accessibility

## MCP Tool Usage Patterns

### For Feature Development
1. Next.js MCP: Create route/page
2. Shadcn MCP: Add required components
3. Next.js MCP: Implement API routes
4. Playwright MCP: Test the feature

### For UI Updates
1. Shadcn MCP: List available components
2. Shadcn MCP: Install components
3. File operations: Customize components
4. Playwright MCP: Visual verification

### For Testing
1. Playwright MCP: Navigate to page
2. Playwright MCP: Interact with elements
3. Playwright MCP: Capture screenshots
4. Playwright MCP: Check console/network
MD
# Create package.json for MCP dependencies
cat > package.json <<'JSON'
{
  "name": "$PROJECT_NAME",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "mcp:setup": "echo 'MCP servers configured - use your AI client to proceed'",
    "mcp:verify": "echo 'Ask your AI to verify MCP connections'"
  },
  "devDependencies": {
    "@vercel-labs/mcp-server-nextjs": "latest",
    "@shadcn/mcp": "latest",
    "@playwright/mcp": "latest"
  }
}
JSON

# Create AI prompt library
cat > ai-prompts.md <<'MD'
# AI Prompt Library for MCP Development

## Initial Setup
\`\`\`
Using the MCP servers available:
1. Create a Next.js project with TypeScript and Tailwind
2. Initialize Shadcn UI with a New York style and slate color
3. Install essential components (button, card, form, navigation)
4. Set up a basic layout with header and footer
5. Verify everything works with Playwright
\`\`\`

## Component Installation
\`\`\`
Using Shadcn MCP:
- List all available components
- Show me components related to [forms/navigation/data display]
- Install [component-name] and its dependencies
- Update all components to latest versions
\`\`\`

## Page Creation
\`\`\`
Using Next.js MCP:
- Create a new page at /dashboard
- Set up API route at /api/users
- Add middleware for authentication
- Configure environment variables
\`\`\`

## Testing
\`\`\`
Using Playwright MCP:
- Navigate to http://localhost:3000
- Take screenshots at all breakpoints
- Test form submission on /contact
- Check for accessibility issues
- Verify mobile menu functionality
\`\`\`

## Full Feature Implementation
\`\`\`
I need a user authentication system:
1. Use Next.js MCP to create /login and /register pages
2. Use Shadcn MCP to add form, input, button, card components
3. Use Next.js MCP to create /api/auth routes
4. Use Playwright MCP to test the login flow
5. Add proper error handling and loading states
\`\`\`
MD
# Create README
cat > README.md <<'MD'
# $PROJECT_NAME - MCP-Driven Development

This project uses Model Context Protocol (MCP) servers for AI-driven development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AI client with MCP support (Claude Desktop, Claude Code, Cursor, etc.)

### Setup
1. Install MCP dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure your AI client to use the MCP servers in \`mcp.json\`

3. Open your AI client in this directory

4. Verify MCP connections by asking your AI:
   "Check if all MCP servers are connected"

### Available MCP Servers

#### Next.js MCP (@vercel-labs/mcp-server-nextjs)
- Project initialization
- Route management  
- API development
- Build optimization

#### Shadcn MCP (@shadcn/mcp)
- Component installation
- UI system setup
- Theme configuration
- Component updates

#### Playwright MCP (@playwright/mcp)
- Browser automation
- Visual testing
- E2E testing
- Accessibility checks

## 📚 Documentation

- \`AI_SETUP_INSTRUCTIONS.md\` - Complete setup guide for AI
- \`ai-prompts.md\` - Ready-to-use AI prompts
- \`mcp-workflow.md\` - Development workflow with MCPs
- \`spec-template.md\` - Product specification template

## 🤖 AI-First Development

This project is designed for AI-driven development. Instead of manual coding:

1. **Describe** what you want to build
2. **Let AI** use MCP tools to implement it
3. **Verify** with Playwright MCP
4. **Iterate** quickly with natural language

### Example AI Commands

"Create a landing page with hero section, features grid, and contact form"

"Add user authentication with login and registration pages"

"Set up a dashboard with data tables and charts"

"Test the entire application at mobile, tablet, and desktop sizes"

## 🛠️ Development Workflow

1. **Specify**: Define what to build in natural language
2. **Implement**: AI uses MCP servers to create it
3. **Test**: Automated testing with Playwright MCP
4. **Iterate**: Refine with conversational feedback

## 📦 Project Structure

\`\`\`
$PROJECT_NAME/
├── mcp.json                 # MCP server configuration
├── AI_SETUP_INSTRUCTIONS.md # AI setup guide
├── ai-prompts.md           # Prompt library
├── mcp-workflow.md         # Workflow guide
├── spec-template.md        # Specification template
└── README.md              # This file
\`\`\`

After AI completes setup, you'll also have:
\`\`\`
├── app/                   # Next.js App Router
├── components/            # React components
├── lib/                   # Utilities
├── public/               # Static assets
└── ...                   # Other Next.js files
\`\`\`

## 🎯 Next Steps

1. Open your AI client in this directory
2. Follow the instructions in \`AI_SETUP_INSTRUCTIONS.md\`
3. Use prompts from \`ai-prompts.md\` to build features
4. Let AI handle the implementation details!

---

Built with ❤️ using MCP-driven development
MD

echo ""
echo "✅ MCP Bootstrap Complete!"
echo ""
echo "📁 Project created: $PROJECT_NAME"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. npm install"
echo "3. Open your AI client (Claude Desktop/Claude Code/Cursor)"
echo "4. Follow instructions in AI_SETUP_INSTRUCTIONS.md"
echo ""
echo "Your AI assistant will handle the rest using MCP servers!"
echo ""