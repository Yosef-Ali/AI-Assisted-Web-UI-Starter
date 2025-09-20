# 🚀 MCP-Driven Next.js + Shadcn Setup Guide

## What is MCP (Model Context Protocol)?

MCP allows AI assistants to directly interact with development tools through standardized servers. Instead of copy-pasting code, your AI can:
- **Create** entire Next.js projects
- **Install** UI components automatically  
- **Test** your app visually in a browser
- **Modify** files and configurations directly

## Available MCP Servers

### 1. Next.js MCP Server (@vercel-labs/mcp-server-nextjs)
Provides tools for:
- Creating Next.js projects with custom configurations
- Managing routes and pages
- Setting up API endpoints
- Running dev server and builds
- Installing npm packages

### 2. Shadcn MCP Server (@shadcn/mcp)
Provides tools for:
- Initializing shadcn/ui in your project
- Installing individual components
- Updating component versions
- Managing component dependencies
- Listing available components

### 3. Playwright MCP Server (@playwright/mcp)
Provides tools for:
- Browser automation
- Taking screenshots
- Clicking elements
- Filling forms
- Running JavaScript in browser
- Testing at different viewport sizes
## 🎯 Quick Start

### Step 1: Run the Bootstrap Script
```bash
cd ~
./mcp-bootstrap.sh my-awesome-app
```

This creates a minimal project folder with MCP configuration files.

### Step 2: Navigate to Project
```bash
cd my-awesome-app
npm install
```

### Step 3: Configure Your AI Client

#### For Claude Desktop
1. Open Claude Desktop settings
2. Go to Developer → Edit Config
3. Add the MCP servers from your project's `mcp.json`

#### For Claude Code  
The MCP servers should auto-detect from `mcp.json` in your project.

#### For Cursor/VS Code
1. Install the MCP extension
2. It will read `mcp.json` automatically

### Step 4: Start AI-Driven Development
Open your AI client in the project folder and say:
```
"Initialize a Next.js project using the Next.js MCP server with TypeScript, Tailwind CSS, and App Router. Then use Shadcn MCP to set up a modern UI system."
```
## 📝 Example AI Conversations

### Complete Project Setup
**You:** 
"I need a modern web app with authentication. Use the Next.js MCP to create the project with TypeScript and Tailwind. Then use Shadcn MCP to add a complete UI system including forms, buttons, cards, and navigation. Finally, set up login and register pages."

**AI will:**
1. Use Next.js MCP to initialize the project
2. Use Shadcn MCP to install components
3. Create the page structure
4. Set up authentication routes

### Adding Features
**You:**
"Add a dashboard with a sidebar navigation, data table for users, and charts for analytics. Use Shadcn MCP to get all the necessary components."

**AI will:**
1. Use Shadcn MCP to install sidebar, data-table, chart components
2. Create dashboard layout
3. Set up routing with Next.js MCP
4. Test with Playwright MCP

### Visual Testing
**You:**
"Use Playwright MCP to test the app. Navigate to all pages, take screenshots at mobile (375px), tablet (768px), and desktop (1440px) sizes. Check for console errors."

**AI will:**
1. Start the dev server
2. Use Playwright to navigate
3. Capture screenshots
4. Report any issues
## 🏗️ Project Structure After Setup

```
my-awesome-app/
├── mcp.json                    # MCP server configuration
├── AI_SETUP_INSTRUCTIONS.md    # Detailed AI instructions
├── ai-prompts.md              # Ready-to-use prompts
├── mcp-workflow.md            # Development workflow
├── spec-template.md           # Project specification
├── package.json               # MCP dependencies
└── README.md                  # Project documentation

After AI initialization:
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   └── ui/                   # Shadcn components
├── lib/                      # Utilities
│   └── utils.ts             # Helper functions
├── public/                   # Static assets
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── components.json          # Shadcn config
```

## 🔧 MCP Server Commands Reference

### Next.js MCP Commands
- `create_project` - Initialize new Next.js app
- `install_package` - Add npm packages
- `create_page` - Add new pages/routes
- `create_api` - Add API routes
- `run_dev` - Start development server
- `run_build` - Build for production
### Shadcn MCP Commands
- `init` - Initialize shadcn/ui
- `add [component]` - Install component
- `list` - Show available components
- `diff` - Check for updates
- `update` - Update components

### Playwright MCP Commands
- `navigate(url)` - Go to URL
- `screenshot()` - Capture screenshot
- `click(selector)` - Click element
- `fill(selector, text)` - Fill input
- `waitFor(selector)` - Wait for element
- `evaluate(js)` - Run JavaScript

## 💡 Pro Tips

### 1. Let AI Handle Dependencies
Don't manually install packages. Ask AI:
"Install React Hook Form and Zod for form validation using Next.js MCP"

### 2. Batch Component Installation
Instead of one at a time:
"Use Shadcn MCP to install all components needed for a complete admin dashboard: sidebar, data-table, charts, cards, badges, avatars, and dropdowns"

### 3. Continuous Testing
After each feature:
"Use Playwright MCP to verify the new feature works on mobile and desktop"

### 4. Iterative Development
Be conversational:
"The button colors don't match our brand. Make them blue-600 on hover"
## 🎨 Example Full-Stack Features

### E-commerce Product Page
```
"Create a product page with:
1. Use Next.js MCP to create /products/[id] route
2. Use Shadcn MCP to add: carousel for images, tabs for details/reviews, button for add to cart, rating component
3. Create API route for fetching product data
4. Use Playwright MCP to test the purchase flow"
```

### User Dashboard
```
"Build a user dashboard:
1. Use Shadcn MCP for: sidebar navigation, avatar menu, data tables, stats cards
2. Create /dashboard route structure with Next.js MCP
3. Add API routes for user data
4. Test responsive layout with Playwright at all sizes"
```

### Blog System
```
"Set up a blog:
1. Create /blog and /blog/[slug] routes with Next.js MCP
2. Use Shadcn MCP for: article cards, pagination, tags, search
3. Add MDX support for content
4. Create admin interface for posting"
```

## ⚡ Advantages of MCP-Driven Development

1. **Speed**: Build features in minutes, not hours
2. **Consistency**: AI uses the same patterns throughout
3. **Best Practices**: Components come pre-configured correctly
4. **Testing**: Automated visual testing included
5. **Iteration**: Make changes with natural language

## 🚨 Troubleshooting

### MCP Servers Not Connecting
1. Ensure `mcp.json` is in project root
2. Restart your AI client
3. Check npm packages are installed

### Commands Not Working
1. Verify with: "List all available MCP tools"
2. Check server status: "Are the MCP servers connected?"
3. Try explicit server naming: "Use the Shadcn MCP server to..."

### Build Errors
Let AI debug: "The build is failing. Use Next.js MCP to check the error and fix it"

## 📚 Resources

- [Next.js MCP Documentation](https://github.com/vercel-labs/mcp-for-next.js)
- [Shadcn MCP Documentation](https://www.shadcn.io/mcp/claude-code)
- [Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp)
- [MCP Protocol Spec](https://modelcontextprotocol.io)

## 🎯 Ready to Start?

1. Run: `./mcp-bootstrap.sh my-app`
2. Open your AI client
3. Start building with natural language!

The future of development is conversational. Welcome to MCP-driven development! 🚀