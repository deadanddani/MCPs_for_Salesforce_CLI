# Deploy_Metadata

Description
- Deploys metadata to a Salesforce org using `sf deploy metadata`.

Inputs
- alias (string): target org alias (Developer orgs only).
- projectPath (string): absolute path to the Salesforce project where the deploy should be executed.
- metadataPath (string): absolute path to the single file or folder to deploy (use specific files or small folders; do not deploy the entire project).

What it does
- Validates the org is a Developer org (helper `isDeveloperOrg`) and runs `cd <projectPath> && sf deploy metadata --target-org <alias> --source-dir <metadataPath> --json --ignore-conflicts`.

Example
```
npx tsx src/index.ts --tool Deploy_Metadata --input '{"alias":"devOrg","projectPath":"/path/to/project","metadataPath":"force-app/main/default/classes/MyClass.cls"}'
```

Notes
- Destructive tool: use only in Developer orgs. Do not use in Production or Sandboxes.
