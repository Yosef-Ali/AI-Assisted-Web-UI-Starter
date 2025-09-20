/**
 * MCP (Model Context Protocol) Server Implementation
 * Provides AI-driven development capabilities
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

class MCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'ai-web-ui-starter',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupRequestHandlers();
  }

  setupToolHandlers() {
    // Define available tools for AI-driven development
    this.tools = [
      {
        name: 'generate_component',
        description: 'Generate a new UI component with AI assistance',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Component name',
            },
            type: {
              type: 'string',
              description: 'Component type (button, form, card, etc.)',
            },
            props: {
              type: 'object',
              description: 'Component properties',
            },
          },
          required: ['name', 'type'],
        },
      },
      {
        name: 'analyze_code',
        description: 'Analyze code for improvements and suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze',
            },
            language: {
              type: 'string',
              description: 'Programming language',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'get_project_context',
        description: 'Get current project context and structure',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  setupRequestHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_component':
            return await this.generateComponent(args);
          case 'analyze_code':
            return await this.analyzeCode(args);
          case 'get_project_context':
            return await this.getProjectContext(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async generateComponent(args) {
    const { name, type, props = {} } = args;
    
    // Generate component based on type
    const component = this.createComponentTemplate(name, type, props);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${type} component: ${name}`,
        },
        {
          type: 'text',
          text: `Component code:\n\n${component}`,
        },
      ],
    };
  }

  async analyzeCode(args) {
    const { code, language = 'javascript' } = args;
    
    // Basic code analysis (in a real implementation, this would use AI)
    const suggestions = this.analyzeCodePattern(code, language);
    
    return {
      content: [
        {
          type: 'text',
          text: `Code analysis for ${language}:`,
        },
        {
          type: 'text',
          text: suggestions.join('\n'),
        },
      ],
    };
  }

  async getProjectContext(args) {
    const context = {
      projectType: 'AI-Assisted Web UI Starter',
      framework: 'Vanilla JS with MCP integration',
      features: ['MCP Server', 'AI-driven development', 'Component generation'],
      structure: {
        src: ['server.js', 'mcp/server.js', 'components/'],
        public: ['index.html', 'css/', 'js/'],
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: 'Project Context:',
        },
        {
          type: 'text',
          text: JSON.stringify(context, null, 2),
        },
      ],
    };
  }

  createComponentTemplate(name, type, props) {
    const templates = {
      button: `
function ${name}Button(props) {
  return \`
    <button class="btn \${props.variant || 'primary'}" 
            onclick="\${props.onClick || ''}">
      \${props.text || '${name}'}
    </button>
  \`;
}`,
      card: `
function ${name}Card(props) {
  return \`
    <div class="card">
      <div class="card-header">
        <h3>\${props.title || '${name}'}</h3>
      </div>
      <div class="card-body">
        \${props.content || 'Card content'}
      </div>
    </div>
  \`;
}`,
      form: `
function ${name}Form(props) {
  return \`
    <form class="form" onsubmit="\${props.onSubmit || ''}">
      <div class="form-group">
        <label for="${name.toLowerCase()}-input">Input:</label>
        <input type="text" id="${name.toLowerCase()}-input" name="input" />
      </div>
      <button type="submit">Submit</button>
    </form>
  \`;
}`,
    };

    return templates[type] || templates.button;
  }

  analyzeCodePattern(code, language) {
    const suggestions = [];
    
    if (language === 'javascript') {
      if (code.includes('var ')) {
        suggestions.push('✨ Consider using const/let instead of var for better scoping');
      }
      if (code.includes('==')) {
        suggestions.push('✨ Consider using === for strict equality comparison');
      }
      if (!code.includes('const') && !code.includes('let')) {
        suggestions.push('✨ Consider using modern ES6+ syntax');
      }
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✅ Code looks good! No immediate suggestions.');
    }
    
    return suggestions;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🤖 MCP Server started and ready for AI-driven development!');
  }
}

// Start the MCP server if run directly
if (require.main === module) {
  const mcpServer = new MCPServer();
  mcpServer.start().catch(console.error);
}

module.exports = MCPServer;