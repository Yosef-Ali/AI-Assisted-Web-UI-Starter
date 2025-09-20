# AI-Assisted-Web-UI-Starter - MCP-Driven Development

This project uses Model Context Protocol (MCP) servers for AI-driven development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AI client with MCP support (Claude Desktop, Claude Code, Cursor, etc.)

### Setup
1. Install MCP dependencies:
   ```bash
   npm install
   ```

2. Configure your AI client to use the MCP servers in `mcp.json`

3. Open your AI client in this directory

4. Verify MCP connections by asking your AI:
   "Check if all MCP servers are connected"

### Available MCP Servers

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

#### Vercel MCP for Next.js (Template)
- **Repository**: [vercel-labs/mcp-for-next.js](https://github.com/vercel-labs/mcp-for-next.js)
- **Purpose**: Template for building custom MCP servers in Next.js
- **Use Case**: Create project-specific MCP tools and integrations
- **Deployment**: Can be deployed to Vercel with Fluid Compute
- **Features**: HTTP and SSE transport support, Redis integration

## 🛠️ Advanced MCP Development

### Using Vercel MCP Template

For custom MCP server development, you can use the [Vercel MCP for Next.js](https://github.com/vercel-labs/mcp-for-next.js) template:

1. **Clone the template**:
   ```bash
   npx create-next-app@latest my-mcp-server --example https://github.com/vercel-labs/mcp-for-next.js
   ```

2. **Customize your MCP tools** in `app/[transport]/route.ts`

3. **Deploy to Vercel** with Fluid Compute enabled

4. **Add to your mcp.json**:
   ```json
   {
     "mcpServers": {
       "custom-nextjs": {
         "command": "npx",
         "args": ["your-custom-mcp-server"]
       }
     }
   }
   ```

This allows you to create project-specific MCP tools for your development workflow.

## 📚 Documentation

- `AI_SETUP_INSTRUCTIONS.md` - Complete setup guide for AI
- `ai-prompts.md` - Ready-to-use AI prompts
- `mcp-workflow.md` - Development workflow with MCPs
- `spec-template.md` - Product specification template

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

```
AI-Assisted-Web-UI-Starter/
├── mcp.json                 # MCP server configuration
├── AI_SETUP_INSTRUCTIONS.md # AI setup guide
├── ai-prompts.md           # Prompt library
├── mcp-workflow.md         # Workflow guide
├── spec-template.md        # Specification template
└── README.md              # This file
```

After AI completes setup, you'll also have:
```
├── app/                   # Next.js App Router
├── components/            # React components
├── lib/                   # Utilities
├── public/               # Static assets
└── ...                   # Other Next.js files
```

### Custom MCP Servers
You can extend this setup by adding custom MCP servers using the [Vercel MCP template](https://github.com/vercel-labs/mcp-for-next.js) for project-specific tools and integrations.

## 🎯 Next Steps

1. Open your AI client in this directory
2. Follow the instructions in `AI_SETUP_INSTRUCTIONS.md`
3. Use prompts from `ai-prompts.md` to build features
4. Let AI handle the implementation details!

---

Built with ❤️ using MCP-driven development