# AI-Assisted Web UI Starter

A comprehensive starter project that integrates **Model Context Protocol (MCP) servers** for AI-driven development. This project demonstrates how to build web applications with intelligent AI assistance, automated component generation, and real-time code analysis.

## 🚀 Features

- **🤖 MCP Server Integration**: Full Model Context Protocol implementation for AI-driven development
- **🔧 AI-Powered Component Generation**: Automatically generate UI components with intelligent assistance
- **📊 Real-time Code Analysis**: Get instant feedback and suggestions for code improvements
- **🏗️ Context-Aware Development**: Maintain project context for better AI assistance
- **🎨 Modern Web UI**: Clean, responsive interface built with vanilla JavaScript
- **⚡ Hot Development**: Fast development workflow with live reloading

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Integration**: Model Context Protocol (MCP) SDK
- **Development**: Modern ES6+ features, responsive design

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yosef-Ali/AI-Assisted-Web-UI-Starter.git
   cd AI-Assisted-Web-UI-Starter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 Quick Start

### Starting the Web Application
```bash
npm start          # Start the web server
npm run dev        # Start with hot reload (development)
```

### Starting the MCP Server
```bash
npm run mcp:start  # Start the MCP server for AI integration
```

### Building the Project
```bash
npm run build      # Build CSS and JavaScript assets
```

## 🧩 MCP Integration

### Available Tools

The MCP server provides several AI-driven development tools:

1. **Component Generation** (`generate_component`):
   - Automatically create UI components
   - Supports buttons, cards, forms, and custom components
   - AI-powered prop and styling suggestions

2. **Code Analysis** (`analyze_code`):
   - Real-time code quality analysis
   - Best practice suggestions
   - Performance optimization tips

3. **Project Context** (`get_project_context`):
   - Maintain awareness of project structure
   - Contextual development assistance
   - Intelligent feature suggestions

### Configuration

MCP server configuration is managed through `mcp.config.json`:

```json
{
  "mcpServers": {
    "ai-web-ui-starter": {
      "command": "node",
      "args": ["src/mcp/server.js"]
    }
  },
  "tools": {
    "generate_component": { "enabled": true },
    "analyze_code": { "enabled": true },
    "get_project_context": { "enabled": true }
  }
}
```

## 📁 Project Structure

```
AI-Assisted-Web-UI-Starter/
├── src/
│   ├── server.js              # Main web server
│   └── mcp/
│       └── server.js          # MCP server implementation
├── public/
│   ├── index.html            # Main HTML file
│   ├── css/
│   │   └── styles.css        # Styling
│   └── js/
│       └── main.js           # Frontend JavaScript
├── mcp.config.json           # MCP configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🎨 Usage Examples

### Generate a Button Component
```javascript
// The MCP server can generate components like this:
function SampleButton(props) {
  return `
    <button class="btn ${props.variant || 'primary'}" 
            onclick="${props.onClick || ''}">
      ${props.text || 'Sample'}
    </button>
  `;
}
```

### Code Analysis Example
The AI can analyze your code and provide suggestions:
- ✨ Use `const`/`let` instead of `var`
- ✨ Use `===` for strict equality
- ✨ Consider modern ES6+ syntax
- 💡 Use arrow functions for conciseness

## 🌐 API Endpoints

- `GET /` - Main web application
- `GET /api/mcp/status` - MCP server status and capabilities

## 🔧 Development

### Adding New MCP Tools

1. **Define the tool** in `src/mcp/server.js`:
   ```javascript
   {
     name: 'your_tool_name',
     description: 'Tool description',
     inputSchema: { /* JSON schema */ }
   }
   ```

2. **Implement the handler**:
   ```javascript
   async yourToolName(args) {
     // Tool implementation
     return { content: [{ type: 'text', text: 'Result' }] };
   }
   ```

3. **Update the configuration** in `mcp.config.json`

### Customizing the UI

- **Styles**: Edit `public/css/styles.css`
- **Layout**: Modify `public/index.html`
- **Functionality**: Update `public/js/main.js`

## 🚦 Testing

Currently, the project includes basic functionality testing. Run:

```bash
npm test  # Run available tests
```

## 📈 Roadmap

- [ ] Advanced AI model integration
- [ ] More component templates
- [ ] Real-time collaboration features
- [ ] Plugin system for custom tools
- [ ] Enhanced code analysis
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the AI integration framework
- The open-source community for inspiration and tools

---

**Ready to build AI-assisted web applications?** 🚀

Start by running `npm install && npm run dev` and explore the MCP-powered development experience!
