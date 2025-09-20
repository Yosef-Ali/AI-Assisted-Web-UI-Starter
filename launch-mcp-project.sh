#!/usr/bin/env bash

# Color codes for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║     ${GREEN}🚀 MCP-Driven Next.js + Shadcn Project Launcher${BLUE}       ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js first: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detected"
echo ""

# Get project name
read -p "Enter project name (or press Enter for 'figbox-app'): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-figbox-app}

echo ""
echo -e "${YELLOW}Creating MCP-enabled project: ${GREEN}$PROJECT_NAME${NC}"
echo ""

# Run the bootstrap script
if [ -f "./mcp-bootstrap.sh" ]; then
    ./mcp-bootstrap.sh "$PROJECT_NAME"
else
    echo -e "${RED}Error: mcp-bootstrap.sh not found!${NC}"
    echo "Make sure mcp-bootstrap.sh is in the current directory"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    Setup Complete! 🎉                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. ${YELLOW}cd $PROJECT_NAME${NC}"
echo -e "  2. ${YELLOW}npm install${NC}"
echo -e "  3. Open your AI client (Claude/Cursor)"
echo -e "  4. Say: ${GREEN}\"Initialize the Next.js project with Shadcn UI\"${NC}"
echo ""
echo -e "${BLUE}Example AI prompts to get started:${NC}"
echo -e "  • \"Create a Next.js app with TypeScript and Tailwind\""
echo -e "  • \"Add Shadcn components for a complete UI system\""
echo -e "  • \"Build a landing page with hero, features, and footer\""
echo -e "  • \"Test the app at different screen sizes\""
echo ""
echo -e "${GREEN}Happy coding with MCP! 🚀${NC}"