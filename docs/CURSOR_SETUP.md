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

### 1. Find Cursor's MCP Configuration

The configuration file location depends on your operating system:

- **macOS/Linux:** `~/.cursor/mcp.json` or `~/.config/cursor/mcp.json`
- **Windows:** `%APPDATA%\Cursor\mcp.json`

If the file doesn't exist, create it.


### 2. Add the MCP Configuration

Add the following entry to the `mcp-tools` section of the configuration file. This runs the compiled server, so make sure you have run `npm run build` first (see the [Setup Guide](./SETUP.md)):

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

#### Alternative: run from source (development mode)

If you are actively developing the MCP itself, you can run the TypeScript source directly instead:

```json
{
  "mcpServers": {
    "mcp-salesforce-cli": {
      "command": "npx",
      "args": ["-y", "tsx", "/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/src/index.ts"]
    }
  }
}
```

> ⚠️ **Warning:** In this mode the server executes whatever is checked out in the repository. If you switch to an older git branch, the server silently runs old code — including bugs already fixed on `master`. Prefer the compiled `build/index.js` config unless you are working on the MCP source.

### 3. Restart Cursor

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
2. **Node not in PATH:** Ensure Node.js is accessible from the command line

### Permission Issues (macOS/Linux)

If you get permission errors, try running the command manually in your terminal to accept any npx prompts, or ensure you have permissions to run node/npx.


### Environment Issues

If you see errors related to environment variables, you can optionally create a `.env` file for advanced configuration (like blocking checks), but it is **not required** for basic usage.


### MCP Crashes or Errors

1. Test the MCP independently using the [MCP tools testing guide](./MCP_TOOLS_TESTING.md)
2. Check that Salesforce CLI is installed: `sf --version`
3. Verify your `.env` configuration
4. Review Cursor's console for error messages

### A Fixed Bug Comes Back / Changes Don't Apply

The client only loads the server code when it starts, so:

1. **After updating the code** (`git pull`), re-run `npm run build` and restart the client (or reconnect the MCP server) to pick up the changes.
2. **If you run from source with `tsx`** (development mode), remember the server executes the currently checked-out branch. If an already-fixed error reappears (e.g. `SyntaxError: Expected property name or '}' in JSON`), check which branch the repo is on (`git branch --show-current`) and whether it contains master (`git merge-base --is-ancestor origin/master HEAD && echo yes || echo no`). Merge or rebase master into your branch, then restart the server.

---

[← Back to README](../README.md)

