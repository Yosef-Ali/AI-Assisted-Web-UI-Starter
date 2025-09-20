/**
 * AI-Assisted Web UI Starter - Main JavaScript
 * Handles MCP server communication and UI interactions
 */

class MCPClient {
  constructor() {
    this.mcpStatus = document.getElementById('mcp-status');
    this.output = document.getElementById('output');
    this.codeInput = document.getElementById('code-input');
    
    this.initializeEventListeners();
    this.checkMCPStatus();
  }

  initializeEventListeners() {
    // Demo buttons
    document.getElementById('generate-btn').addEventListener('click', () => {
      this.generateComponent();
    });

    document.getElementById('analyze-btn').addEventListener('click', () => {
      this.analyzeCurrentCode();
    });

    document.getElementById('context-btn').addEventListener('click', () => {
      this.getProjectContext();
    });

    // Code analysis button
    document.getElementById('analyze-code-btn').addEventListener('click', () => {
      this.analyzeUserCode();
    });
  }

  async checkMCPStatus() {
    try {
      const response = await fetch('/api/mcp/status');
      const data = await response.json();
      
      this.updateStatus('connected', `MCP: ${data.status}`);
      this.logOutput('🤖 MCP Server Status:', data);
    } catch (error) {
      this.updateStatus('error', 'MCP: Connection Failed');
      this.logOutput('❌ MCP Connection Error:', error.message);
    }
  }

  updateStatus(type, message) {
    this.mcpStatus.textContent = message;
    this.mcpStatus.className = `status-indicator ${type}`;
  }

  logOutput(title, content) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${title}\n${typeof content === 'object' ? JSON.stringify(content, null, 2) : content}\n\n`;
    
    this.output.textContent += logEntry;
    this.output.scrollTop = this.output.scrollHeight;
  }

  async generateComponent() {
    this.logOutput('🔧 Generating component...', '');
    
    try {
      // Simulate MCP tool call for component generation
      const componentData = {
        name: 'Sample',
        type: 'button',
        props: { variant: 'primary', text: 'Click me' }
      };

      const result = await this.simulateMCPCall('generate_component', componentData);
      this.logOutput('✅ Component Generated:', result);
    } catch (error) {
      this.logOutput('❌ Component Generation Failed:', error.message);
    }
  }

  async analyzeCurrentCode() {
    this.logOutput('📊 Analyzing sample code...', '');
    
    try {
      const sampleCode = `function greetUser(name) {
  var message = "Hello, " + name + "!";
  if (name == "admin") {
    return "Welcome admin";
  }
  return message;
}`;

      const result = await this.simulateMCPCall('analyze_code', {
        code: sampleCode,
        language: 'javascript'
      });
      
      this.logOutput('✅ Code Analysis Complete:', result);
    } catch (error) {
      this.logOutput('❌ Code Analysis Failed:', error.message);
    }
  }

  async analyzeUserCode() {
    const code = this.codeInput.value.trim();
    
    if (!code) {
      this.logOutput('⚠️ Warning:', 'Please enter some code to analyze');
      return;
    }

    this.logOutput('📊 Analyzing your code...', '');
    
    try {
      const result = await this.simulateMCPCall('analyze_code', {
        code: code,
        language: 'javascript'
      });
      
      this.logOutput('✅ Your Code Analysis:', result);
    } catch (error) {
      this.logOutput('❌ Code Analysis Failed:', error.message);
    }
  }

  async getProjectContext() {
    this.logOutput('🔄 Getting project context...', '');
    
    try {
      const result = await this.simulateMCPCall('get_project_context', {});
      this.logOutput('✅ Project Context:', result);
    } catch (error) {
      this.logOutput('❌ Context Retrieval Failed:', error.message);
    }
  }

  // Simulate MCP tool calls (in a real implementation, this would communicate with the MCP server)
  async simulateMCPCall(toolName, args) {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (toolName) {
          case 'generate_component':
            resolve(this.mockGenerateComponent(args));
            break;
          case 'analyze_code':
            resolve(this.mockAnalyzeCode(args));
            break;
          case 'get_project_context':
            resolve(this.mockGetProjectContext(args));
            break;
          default:
            resolve({ error: 'Unknown tool' });
        }
      }, 1000);
    });
  }

  mockGenerateComponent(args) {
    const { name, type, props } = args;
    return {
      tool: 'generate_component',
      result: `Generated ${type} component: ${name}`,
      code: `function ${name}${type.charAt(0).toUpperCase() + type.slice(1)}(props) {
  return \`
    <${type} class="btn \${props.variant || 'primary'}" 
           onclick="\${props.onClick || ''}">
      \${props.text || '${name}'}
    </${type}>
  \`;
}`,
      props: props
    };
  }

  mockAnalyzeCode(args) {
    const { code, language } = args;
    const suggestions = [];
    
    if (code.includes('var ')) {
      suggestions.push('✨ Consider using const/let instead of var for better scoping');
    }
    if (code.includes('==') && !code.includes('===')) {
      suggestions.push('✨ Consider using === for strict equality comparison');
    }
    if (!code.includes('const') && !code.includes('let')) {
      suggestions.push('✨ Consider using modern ES6+ syntax');
    }
    if (code.includes('function') && !code.includes('=>')) {
      suggestions.push('💡 You could use arrow functions for more concise syntax');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✅ Code looks good! No immediate suggestions.');
    }
    
    return {
      tool: 'analyze_code',
      language: language || 'javascript',
      suggestions: suggestions,
      codeQuality: suggestions.length <= 1 ? 'Good' : suggestions.length <= 3 ? 'Fair' : 'Needs Improvement'
    };
  }

  mockGetProjectContext(args) {
    return {
      tool: 'get_project_context',
      context: {
        projectName: 'AI-Assisted Web UI Starter',
        framework: 'Vanilla JS with MCP integration',
        mcpVersion: '1.0.0',
        features: [
          'MCP Server integration',
          'AI-driven development',
          'Component generation',
          'Code analysis',
          'Context management'
        ],
        structure: {
          src: ['server.js', 'mcp/server.js'],
          public: ['index.html', 'css/styles.css', 'js/main.js'],
          config: ['package.json']
        },
        capabilities: [
          'Real-time AI assistance',
          'Component scaffolding',
          'Code quality analysis',
          'Project context awareness'
        ]
      }
    };
  }
}

// Initialize the MCP client when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const mcpClient = new MCPClient();
  console.log('🚀 AI-Assisted Web UI Starter initialized');
  console.log('📡 MCP Client ready for AI-driven development');
});

// Add some utility functions for enhanced functionality
function formatCode(code) {
  // Simple code formatting (in a real implementation, use a proper formatter)
  return code
    .replace(/;/g, ';\n')
    .replace(/{/g, '{\n  ')
    .replace(/}/g, '\n}')
    .replace(/\n\s*\n/g, '\n');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('📋 Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MCPClient, formatCode, copyToClipboard };
}