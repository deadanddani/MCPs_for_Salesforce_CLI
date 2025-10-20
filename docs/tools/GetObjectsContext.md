# Get_Objects_Context

Description
- Returns the list of objects (standard and custom) available in a Salesforce organization.

Inputs
- alias (string): alias of the org configured in Salesforce CLI.

What it does
- Calls `sf sobject list --sobject standard|custom --target-org <alias> --json` and returns a JSON with `standardObjects` and `customObjects`.

Usage example
```
# from the project CLI
npx tsx src/index.ts --tool Get_Objects_Context --input '{"alias":"myOrg"}'
```

Notes
- This is a read-only tool and can be used before `Get_Object_Schema` or `Query_Records` to obtain correct object names.
