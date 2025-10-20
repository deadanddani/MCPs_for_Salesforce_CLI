# Get_Org_Limits

Description
- Retrieves current org limits and usage (API calls, storage, etc.).

Inputs
- alias (string): target org alias.

What it does
- Executes `sf org list limits --target-org <alias> --json` and computes additional fields (`used`, `usedPercent`, `remainingPercent`).

Example
```
npx tsx src/index.ts --tool Get_Org_Limits --input '{"alias":"myOrg"}'
```

Notes
- Returns a textual summary including JSON of limits. Useful for monitoring org health.
