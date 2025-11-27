# 🖱️ Cursor Configuration Guide

This guide explains how to configure the Salesforce CLI MCP in Cursor for AI-assisted development.

## What is Cursor MCP Integration?

Cursor can connect to Model Context Protocol (MCP) servers to extend the AI's capabilities with custom tools. This integration allows the AI in Cursor to:

- Query Salesforce data
- Inspect org schemas
- Deploy metadata
- Run tests
- And more!

## Configuration Steps

### 1. Build the Project

First, make sure the project is built:

```bash
npm run build
```

This creates the compiled output in the `build/` directory.

### 2. Find Cursor's MCP Configuration

The configuration file location depends on your operating system:

- **macOS/Linux:** `~/.cursor/mcp.json` or `~/.config/cursor/mcp.json`
- **Windows:** `%APPDATA%\Cursor\mcp.json`

If the file doesn't exist, create it.

### 3. Add the MCP Configuration

Add the following entry to the `mcp-tools` section of the configuration file:

```json
{
  "mcpServers": {
    "mcp-salesforce-cli": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/build/index.js"]
    }
  }
}
```

**Important:** Replace `/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/` with the actual absolute path to your project directory.

#### Example for macOS/Linux:
```json
{
  "mcpServers": {
    "mcp-salesforce-cli": {
      "command": "node",
      "args": ["/Users/yourname/Documents/MCPs_for_Salesforce_CLI/build/index.js"]
    }
  }
}
```

#### Example for Windows:
```json
{
  "mcpServers": {
    "mcp-salesforce-cli": {
      "command": "node",
      "args": ["C:\\Users\\yourname\\Documents\\MCPs_for_Salesforce_CLI\\build\\index.js"]
    }
  }
}
```

### 4. Alternative: Development Mode (TypeScript)

If you're actively developing and want to use TypeScript directly without building:

```json
{
  "mcpServers": {
    "mcp-salesforce-cli": {
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/src/index.ts"]
    }
  }
}
```

This is useful for:
- Quick iteration during development
- Testing changes without rebuilding
- Debugging TypeScript source directly

### 5. Restart Cursor

After adding the configuration:
1. Save the `mcp.json` file
2. Restart Cursor completely
3. The MCP should now be available to the AI

## Verify the Integration

To verify that Cursor has loaded the MCP:

1. Open Cursor
2. Start a chat with the AI
3. Ask the AI to list your Salesforce orgs
4. The AI should use the `List_Orgs` tool automatically

Example prompt:
```
"Show me all my authenticated Salesforce orgs"
```

If the integration is working, you'll see the AI using the MCP tools to fetch the information.

## Using the MCP in Cursor

Once configured, you can ask the AI to:

### Query Data
```
"Get me the last 10 accounts from my production org"
```

### Inspect Schemas
```
"What fields does the Contact object have in my sandbox?"
```

### Check Org Limits
```
"Show me the API limits for my org"
```

### Deploy Changes
```
"Deploy the MyClass.cls file to my dev org"
```

### Run Tests
```
"Run all tests in the AccountTriggerTest class"
```

The AI will automatically use the appropriate MCP tools to fulfill your requests.

## Troubleshooting

### MCP Not Loading

**Check the logs:**
- Cursor may show errors in the developer console
- Open with: `Cmd+Opt+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)

**Common issues:**
1. **Wrong path:** Verify the absolute path in your config
2. **Build not found:** Run `npm run build` to create the `build/` directory
3. **Node not in PATH:** Ensure Node.js is accessible from the command line

### Permission Issues (macOS/Linux)

If you get permission errors, ensure the build file is executable:

```bash
chmod +x /path/to/MCPs_for_Salesforce_CLI/build/index.js
```

### MCP Crashes or Errors

1. Test the MCP independently using the [MCP tools testing guide](./MCP_TOOLS_TESTING.md)
2. Check that Salesforce CLI is installed: `sf --version`
3. Verify your `.env` configuration
4. Review Cursor's console for error messages

## Next Steps

- 📚 **[Tools Documentation](./tools/)** - Learn what each tool can do
- 🧪 **[MCP_TOOLS_TESTING.md](./MCP_TOOLS_TESTING.md)** - Test the MCP locally
- 💡 Experiment with different prompts to discover what the AI can do!

---

[← Back to README](../README.md)

