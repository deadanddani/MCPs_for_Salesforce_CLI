# List_Orgs

Description
- Lists the orgs authenticated in the Salesforce CLI and returns useful info (alias, status, default, expiration).

Inputs
- None.

What it does
- Executes `sf org list --all --json` and returns the result as text/JSON.

Example
```
npx tsx src/index.ts --tool List_Orgs --input '{}'
```

Notes
- Shows information useful to identify valid aliases before calling other tools.
