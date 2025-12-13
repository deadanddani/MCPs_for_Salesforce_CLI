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

Add your server configuration to the JSON file:

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

**Important:** Replace `/ABSOLUTE/PATH/TO/MCPs_for_Salesforce_CLI/` with the actual absolute path to your project directory.

#### Example for macOS/Linux:
```json
{
  "mcpServers": {
    "salesforce-cli": {
      "command": "npx",
      "args": ["-y", "tsx", "/Users/yourname/Documents/MCPs_for_Salesforce_CLI/src/index.ts"]
    }
  }
}
```

#### Example for Windows:
```json
{
  "mcpServers": {
    "salesforce-cli": {
      "command": "npx",
      "args": ["-y", "tsx", "C:\\Users\\yourname\\Documents\\MCPs_for_Salesforce_CLI\\src\\index.ts"]
    }
  }
}
```

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
- **Path Issues**: Ensure the path to `src/index.ts` is absolute and correct.
- **Permissions**: Ensure you have permissions to run `npx`.

---

[← Back to README](../README.md)
