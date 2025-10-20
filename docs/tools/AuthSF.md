# Auth_Salesforce_Instance

Description
- Initiates the web login flow to authenticate an org in Salesforce CLI and assign it an alias.

Inputs
- alias (string): alias to assign to the org.
- instanceUrl (string): instance URL (for example `https://login.salesforce.com`, `https://test.salesforce.com` or a custom domain URL).

What it does
- Runs `sf org login web --alias <alias> --set-default --instance-url <instanceUrl>` after checking CLI installation and killing existing processes.

Example
```
npx tsx src/index.ts --tool Auth_Salesforce_Instance --input '{"alias":"myOrg","instanceUrl":"https://login.salesforce.com"}'
```

Notes
- Recommended only when the user explicitly requests to authenticate a new org.
