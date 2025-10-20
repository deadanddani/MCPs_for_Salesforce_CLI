# Run_Tests

Description
- Runs Apex test classes in the target org and returns results and code coverage.

Inputs
- alias (string): target org alias.
- testClasses (string[]): list of test class names to run.
- classesToCover (string[]): list of classes whose coverage results should be included in the summary.

What it does
- Validates the org is a Developer org and executes `sf apex run test --target-org <alias> --class-names <list> --json --wait 30 --code-coverage`.
- If the output is very large, it cleans the JSON and returns a summary with coverage filtered by `classesToCover`.

Example
```
npx tsx src/index.ts --tool Run_Tests --input '{"alias":"devOrg","testClasses":["MyTest"],"classesToCover":["MyClass"]}'
```

Notes
- Intended for Developer orgs.
