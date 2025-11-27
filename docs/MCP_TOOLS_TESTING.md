# 🧪 MCP Tools Testing Guide

This guide explains how to test the MCP tools interactively and verify they work correctly with your Salesforce orgs.

## Test with MCP Inspector

The MCP Inspector is the recommended way to test your MCP tools without publishing the package or configuring it in Cursor.

### Start the Inspector

Run the following command from the project root:

```bash
npx @modelcontextprotocol/inspector npx -y tsx src/index.ts
```

This will:
1. Start the MCP Inspector interface
2. Load your local MCP using the `src/index.ts` entrypoint
3. Open a web interface where you can interact with your MCP

### Using the Inspector

Once the inspector is running:

1. **View Available Tools** - You'll see a list of all available tools
2. **Test Tool Calls** - Click on any tool to see its schema and test it
3. **View Responses** - See the JSON responses from each tool call
4. **Debug Issues** - Check logs and error messages in real-time

### Example: Testing List_Orgs

1. Start the inspector (command above)
2. Find `List_Orgs` in the tools list
3. Click "Execute" (no inputs required)
4. View the list of authenticated orgs in the response

### Example: Testing Query_Records

1. Start the inspector
2. Find `Query_Records` in the tools list
3. Provide the required inputs:
   ```json
   {
     "alias": "myOrg",
     "query": "SELECT Id, Name FROM Account LIMIT 5"
   }
   ```
4. Click "Execute" and view the query results

### Example: Testing Get_Object_Schema

1. Start the inspector
2. Find `Get_Object_Schema` in the tools list
3. Provide the required inputs:
   ```json
   {
     "alias": "myOrg",
     "objectName": "Account"
   }
   ```
4. View the object schema with all fields and metadata

## Manual Testing via CLI

You can also test individual tools directly from the command line:

### Example: List authenticated orgs
```bash
npx tsx src/index.ts --tool List_Orgs --input '{}'
```

### Example: Get objects context
```bash
npx tsx src/index.ts --tool Get_Objects_Context --input '{"alias":"myOrg"}'
```

### Example: Query records
```bash
npx tsx src/index.ts --tool Query_Records --input '{"alias":"myOrg","query":"SELECT Id, Name FROM Account LIMIT 5"}'
```

## Debugging Tips

### Enable Debug Logging
Set environment variable for more verbose output:
```bash
DEBUG=* npx @modelcontextprotocol/inspector npx -y tsx src/index.ts
```

### Common Issues

**Issue: "Salesforce CLI not found"**
- Solution: Make sure `sf` is installed and in your PATH
- Verify with: `sf --version`

**Issue: "Org alias not found"**
- Solution: List your orgs with `sf org list` to see available aliases
- Or use the `List_Orgs` tool

**Issue: "SOQL query error"**
- Solution: Test your query directly with `sf data query --query "YOUR_QUERY" --target-org ALIAS`

**Issue: "Critical commands not allowed"**
- Solution: Check your `.env` configuration (see [SETUP.md](./SETUP.md))
- Make sure you're using a sandbox/developer org

## Next Steps

- 🧪 **[CODE_TESTING.md](./CODE_TESTING.md)** - Run unit tests for the codebase
- 🖱️ **[CURSOR_SETUP.md](./CURSOR_SETUP.md)** - Use the MCP in Cursor
- 📚 **[Tools Documentation](./tools/)** - Detailed documentation for each tool

---

[← Back to README](../README.md)

