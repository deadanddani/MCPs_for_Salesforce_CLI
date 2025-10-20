# Query_Records

Description
- Executes a SOQL query against the target org and returns results in JSON or text format.

Inputs
- alias (string): target org alias.
- query (string): SOQL to execute. Use `LIMIT` when appropriate.

What it does
- Calls `sf data query --target-org <alias> --query "<query>" --json` and returns the response.

Example
```
npx tsx src/index.ts --tool Query_Records --input '{"alias":"myOrg","query":"SELECT Id, Name FROM Account LIMIT 10"}'
```

Notes
- If the query fails due to a non-existent object or field, the tool returns a message advising to refresh the context using `Get_Objects_Context` and `Get_Object_Schema`.
