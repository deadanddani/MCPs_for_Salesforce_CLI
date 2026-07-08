# 🧑‍💻 VS Code Configuration Guide

This guide explains how to configure the Salesforce CLI MCP in Visual Studio Code using GitHub Copilot.

## 📋 Prerequisites

- **Visual Studio Code**: Latest version.
- **GitHub Copilot Extension**: Make sure the GitHub Copilot extension is installed and active.
- **Node.js**: Installed and accessible in your terminal.

## ⚙️ Configuration Steps

### 1. Locate or Create `mcp.json`

Create a `.vscode/mcp.json` file in the root of your workspace.


### 2. Add the MCP Configuration

Add your server configuration to the JSON file. This runs the compiled server, so make sure you have run `npm run build` first (see the [Setup Guide](./SETUP.md)):

```json
{
  "mcpServers": {
    "salesforce-cli": {
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
    "salesforce-cli": {
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
    "salesforce-cli": {
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
    "salesforce-cli": {
      "command": "npx",
      "args": ["-y", "tsx", "/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/src/index.ts"]
    }
  }
}
```

> ⚠️ **Warning:** In this mode the server executes whatever is checked out in the repository. If you switch to an older git branch, the server silently runs old code — including bugs already fixed on `master`. Prefer the compiled `build/index.js` config unless you are working on the MCP source.

### 3. Restart VS Code

1. Save the configuration file.
2. Restart Visual Studio Code to ensure the Copilot extension loads the new MCP settings.

## ✅ Verify the Integration

1. Open the **GitHub Copilot Chat** view.
2. Ask a question related to your Salesforce orgs, for example:
   > "List my authenticated Salesforce orgs"
3. You should see Copilot accessing the `salesforce-cli` tool to retrieve the information.

## 🔧 Troubleshooting

- **Check Output**: Look at the "GitHub Copilot" output channel in VS Code for any connection errors.
- **Path Issues**: Ensure the path to `build/index.js` (or `src/index.ts`) is absolute and correct.
- **Permissions**: Ensure you have permissions to run `node`/`npx`.
- **A fixed bug comes back / changes don't apply**: The client only loads the server code when it starts. After updating the code (`git pull`), re-run `npm run build` and restart the client (or reconnect the MCP server). If you run from source with `tsx` (development mode), the server executes the currently checked-out branch — if an already-fixed error reappears, check which branch the repo is on (`git branch --show-current`) and merge master into it, then restart the server.

---

[← Back to README](../README.md)
