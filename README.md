## 📦 Dependencies

These are the dependencies required for the project to run and develop properly:

### 🔧 Main dependencies (`dependencies`)

| Package                     | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | Official SDK for the ModelContext protocol, useful for specific integrations |
| `@salesforce/cli`           | Salesforce CLI, required to run `sf` commands programmatically               |
| `zod`                       | Library for validation and schema definition in TypeScript                   |

### 🛠️ Development dependencies (`devDependencies`)

| Package       | Description                                        |
| ------------- | -------------------------------------------------- |
| `typescript`  | TypeScript language support                        |
| `@types/node` | Type definitions for using Node.js with TypeScript |

---

💡 **Note:** To install all dependencies, run:

```bash
npm install
```

## Run for testing

To run the application in test mode (without publishing a package), you can use the Model Context Protocol inspector and run the TypeScript entrypoint directly with `tsx`:

```
npx @modelcontextprotocol/inspector npx -y tsx src/index.ts
```

This will start the inspector and load your local MCP using the `src/index.ts` file.

## Configure Cursor (mcp-tools)

If you want to add this MCP to Cursor for local development/debugging, add the following entry in the `mcp-tools` section of Cursor's configuration (adjust the path to `src/index.ts` on your machine):

```
"mcp-salesforce-cli": {
  "command": "npx",
  "args": ["tsx", "/Users/danielvadillorand/Documents/Proyects/MCPs_for_Salesforce_CLI/src/index.ts"]
}
```

Replace the path in `args` with the absolute path to your local `src/index.ts`.

## Tool documentation

Each tool in the MCP has its own documentation file in `docs/tools/` (one file per tool) to avoid overloading this README. Check the files there to see what each tool does, its inputs and usage examples.

