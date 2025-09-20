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

2. **Initialize Spec Kit** (if not already done):
   ```bash
   uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot
   ```

3. Configure your AI client to use the MCP servers in `mcp.json`

4. Open your AI client in this directory

5. Verify MCP connections by asking your AI:
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

## 🛠️ Spec-Driven Development with GitHub Spec Kit

This project includes **GitHub Spec Kit** ([github/spec-kit](https://github.com/github/spec-kit)) for structured, specification-driven development. Spec Kit provides AI-powered tools to create detailed specifications before implementation.

### Spec Kit Commands

Use these slash commands with your AI assistant:

| Command | Purpose | Description |
|---------|---------|-------------|
| `/constitution` | Project Principles | Establish governing principles and development guidelines |
| `/specify` | Feature Specs | Create detailed specifications from natural language descriptions |
| `/plan` | Technical Plans | Generate implementation plans with tech stack choices |
| `/tasks` | Task Breakdown | Create actionable task lists from implementation plans |
| `/implement` | Code Generation | Execute all tasks to build features according to the plan |

### Example Spec Kit Workflow

1. **Define Principles**: `/constitution Create a modern web app with React, TypeScript, and focus on accessibility`
2. **Specify Feature**: `/specify Build a user dashboard with data visualization and real-time updates`
3. **Create Plan**: `/plan Use Next.js 15, Shadcn UI components, and TanStack Query for data fetching`
4. **Break Down Tasks**: `/tasks` (automatically generates implementation tasks)
5. **Implement**: `/implement` (AI builds the complete feature)

### Integration with MCP

Spec Kit works seamlessly with our MCP servers:
- **Shadcn MCP** handles UI component installation during implementation
- **Playwright MCP** provides automated testing for implemented features
- **Spec Kit** manages the overall development workflow and specifications

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

This project combines **Spec-Driven Development** with **MCP-powered implementation**:

### Complete Development Workflow

1. **Establish Principles**: `/constitution Define project standards and guidelines`
2. **Specify Features**: `/specify Describe what you want to build in natural language`
3. **Create Technical Plan**: `/plan Choose your tech stack and architecture`
4. **Generate Tasks**: `/tasks Break down implementation into actionable steps`
5. **Implement with MCP**: `/implement Use Shadcn and Playwright MCP for execution`
6. **Test & Verify**: Use Playwright MCP for automated testing

### Enhanced AI Commands

**Spec Kit Commands:**
- `/constitution` - Set project principles and coding standards
- `/specify` - Create detailed feature specifications
- `/plan` - Generate technical implementation plans
- `/tasks` - Break down work into manageable tasks
- `/implement` - Execute the complete implementation

**MCP Integration:**
- Shadcn MCP handles UI component installation
- Playwright MCP provides automated testing
- Combined workflow ensures quality and consistency

### Example Complete Workflow

```bash
# 1. Set project principles
/constitution Build a modern SaaS dashboard with React, TypeScript, and focus on user experience

# 2. Define the feature
/specify Create a user analytics dashboard with charts, metrics, and real-time data

# 3. Choose tech stack
/plan Use Next.js 15, Shadcn UI, TanStack Query, and Recharts for visualization

# 4. Generate implementation tasks
/tasks

# 5. Execute with MCP integration
/implement
```

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
├── .specify/               # Spec Kit configuration
│   ├── scripts/           # Bash scripts for spec operations
│   ├── templates/         # Spec templates
│   └── memory/            # Project memory and context
├── .github/
│   └── prompts/           # AI prompt templates for slash commands
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