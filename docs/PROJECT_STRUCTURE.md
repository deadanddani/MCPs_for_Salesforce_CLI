# 🏗️ Project Structure

This document explains the organization and architecture of the Salesforce CLI MCP project.

## Overview

This is a **Model Context Protocol (MCP)** server that exposes Salesforce CLI operations as tools that can be used by AI assistants. The project is built with TypeScript and uses the official MCP SDK.

## Directory Structure

```
MCPs_for_Salesforce_CLI/
├── src/                          # Source code
│   ├── index.ts                  # Entry point - registers MCP server
│   ├── server/                   # MCP server configuration
│   ├── tools/                    # MCP tools (one per Salesforce operation)
│   │   ├── AuthSF/
│   │   ├── ListOrgs/
│   │   ├── GetObjectsContext/
│   │   ├── GetObjectSchema/
│   │   ├── QueryRecords/
│   │   ├── GetOrgLimits/
│   │   ├── OpenOrgPage/
│   │   ├── DeployMetadata/
│   │   ├── RunTests/
│   │   └── toolsRepository.ts    # Registry of all tools
│   ├── helpers/                  # Reusable utilities (CLI checking, command execution, security)
│   └── entities/                 # Core abstractions (Tool interface, error classes)
├── docs/                         # Documentation
│   ├── *.md                      # Setup, testing, and development guides
│   └── tools/                    # Individual tool documentation
├── .github/workflows/            # CI/CD configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vitest configuration
└── .env.example                  # Environment variables template
```

### Key Directories

**`src/tools/`** - Each subdirectory is a self-contained MCP tool with:
- Implementation file (`.ts`)
- Unit tests (`.test.ts`)

**`src/helpers/`** - Shared utilities used across tools:
- CLI installation checks
- Command execution
- Security validation (org type detection, permission checks)
- JSON parsing and error handling

**`src/entities/`** - Core abstractions that define how tools work

**`docs/`** - All documentation for users and developers

## Core Components

### 1. Entry Point (`src/index.ts`)

The main entry point that:
- Initializes the MCP server
- Registers all available tools
- Sets up stdio transport for communication

### 2. MCP Server (`src/server/server.ts`)

Configures the MCP server with:
- Server name and version
- Tool registration
- Request handlers

### 3. Tools (`src/tools/`)

Each tool is a self-contained module that exposes one Salesforce operation.

**Structure:**
```
ToolName/
├── ToolName.ts         # Implementation
└── ToolName.test.ts    # Unit tests
```

**Tool Anatomy:**
```typescript
export const ToolName: Tool = {
  definition: {
    name: "Tool_Name",
    description: "What this tool does",
    inputSchema: zodSchema  // Input validation with Zod
  },
  
  execute: async (input) => {
    // 1. Validate input (Zod handles this)
    // 2. Check permissions (if needed)
    // 3. Execute SF CLI command
    // 4. Parse and return result
  }
};
```

All tools are registered in `toolsRepository.ts`.

### 4. Helpers (`src/helpers/`)

Reusable utility functions shared across tools:

- **CLI validation** - Check Salesforce CLI is installed
- **Command execution** - Run shell commands and capture output
- **Security checks** - Validate org types and permissions for critical operations
- **JSON processing** - Parse and clean SF CLI JSON responses
- **Error handling** - Centralized error management with user-friendly messages

### 5. Entities (`src/entities/`)

Core abstractions that define the system architecture:

- **Tool interface** - Contract that all tools must implement
- **Error classes** - Custom error types for better error handling

## Data Flow

### Tool Execution Flow

```
1. AI Assistant (Cursor) 
   ↓ (sends tool request via MCP)
2. MCP Server (src/server/server.ts)
   ↓ (routes to appropriate tool)
3. Tool (src/tools/ToolName/ToolName.ts)
   ↓ (validates input with Zod)
4. Helper: OrgService.ts (security checks)
   ↓ (checks if operation is allowed)
5. Helper: CliChecker.ts (verify SF CLI)
   ↓ (ensures SF CLI is available)
6. Helper: CommandExecuter.ts
   ↓ (executes: sf command --args)
7. Salesforce CLI
   ↓ (returns JSON result)
8. Helper: JSONService.ts (parse result)
   ↓ (clean and parse JSON)
9. Tool (format response)
   ↓ (return result to MCP)
10. MCP Server
    ↓ (send response to AI)
11. AI Assistant (Cursor)
```

### Security Layer

All critical commands (Deploy, RunTests) go through security checks in the helpers layer:

**Security Flow:**
1. Get org information from SF CLI
2. Detect if org is production (checks if URL contains `.sandbox.my.salesforce.com`)
3. Check `ALLOW_CRITICAL_COMMANDS_TO_PROD` environment variable
4. Check if username is in the blocklist (`DISALLOW_CRITICAL_COMMANDS_TO_USERNAMES`)
5. Allow or deny the operation

**Result:** By default, critical operations only work on sandbox/developer orgs.

## Key Technologies

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Node.js** | Runtime environment |
| **@modelcontextprotocol/sdk** | MCP protocol implementation |
| **Zod** | Input validation and schema definition |
| **Vitest** | Unit testing framework |
| **Salesforce CLI** | Salesforce operations (via shell commands) |
| **dotenv** | Environment variable management |

## Environment Variables

Stored in `.env` file (see `.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `ALLOW_CRITICAL_COMMANDS_TO_PROD` | `false` | Allow deploy/tests on production orgs |
| `DISALLOW_CRITICAL_COMMANDS_TO_USERNAMES` | `""` | Semicolon-separated list of blocked usernames |

## Build Process

```bash
npm run build
```

1. TypeScript compiler (`tsc`) compiles `src/` → `build/`
2. Makes `build/index.js` executable (`chmod 755`)
3. Result: Standalone Node.js executable

## Testing Strategy

### Unit Tests (Vitest)
- Located next to source files: `*.test.ts`
- Test individual functions and tools
- Mock SF CLI responses
- Run with: `npm test`

### Integration Tests (MCP Inspector)
- Test complete tool execution flow
- Use real SF CLI (requires authenticated orgs)
- Interactive web UI
- Run with: `npx @modelcontextprotocol/inspector npx -y tsx src/index.ts`

## Adding a New Tool

1. **Create tool directory:**
   ```bash
   mkdir src/tools/MyNewTool
   ```

2. **Create implementation** (`src/tools/MyNewTool/MyNewTool.ts`):
   ```typescript
   import { z } from 'zod';
   import { Tool } from '../../entities/Tool.js';
   
   const inputSchema = z.object({
     alias: z.string(),
     // ... other inputs
   });
   
   export const MyNewTool: Tool = {
     definition: {
       name: "My_New_Tool",
       description: "What it does",
       inputSchema
     },
     execute: async (input) => {
       const validated = inputSchema.parse(input);
       // Implementation
       return { content: [{ type: "text", text: result }] };
     }
   };
   ```

3. **Create tests** (`src/tools/MyNewTool/MyNewTool.test.ts`):
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { MyNewTool } from './MyNewTool';
   
   describe('MyNewTool', () => {
     it('should work correctly', async () => {
       // Test implementation
     });
   });
   ```

4. **Register tool** in `src/tools/toolsRepository.ts`:
   ```typescript
   import { MyNewTool } from './MyNewTool/MyNewTool.js';
   
   export const tools: Tool[] = [
     // ... existing tools
     MyNewTool
   ];
   ```

5. **Create documentation** (`docs/tools/MyNewTool.md`)

6. **Update README.md** with link to the new tool

## Development Workflow

1. **Make changes** to source code
2. **Run tests:** `npm test`
3. **Test with MCP Inspector:** `npx @modelcontextprotocol/inspector npx -y tsx src/index.ts`
4. **Build:** `npm run build`
5. **Test in Cursor** (if needed)
6. **Commit and push** (tests run automatically in CI)

## Contributing

When contributing:
1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure tests pass: `npm test`
5. Follow TypeScript best practices

## Next Steps

- 📖 See [CODE_TESTING.md](./CODE_TESTING.md) to learn about testing
- 🛠️ See [SETUP.md](./SETUP.md) for setup instructions
- 📚 Check [tools documentation](./tools/) to understand each tool

