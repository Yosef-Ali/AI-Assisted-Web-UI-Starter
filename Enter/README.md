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
