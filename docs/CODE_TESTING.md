# 🧪 Code Testing Guide

This guide explains how to run and write unit tests for the codebase.

## Running Tests

The project uses **Vitest** as the testing framework.

### Run all tests

```bash
npm test
```

### Run tests in watch mode

This will re-run tests automatically when files change:

```bash
npm test -- --watch
```

### Run tests for a specific tool

```bash
npm test -- GetObjectsContext
```

### Run tests for a specific file

```bash
npm test -- src/tools/ListOrgs/ListOrgs.test.ts
```

### Run tests with coverage

```bash
npm test -- --coverage
```

## Test Structure

Tests are organized alongside the code they test:

```
src/
├── tools/
│   ├── ListOrgs/
│   │   ├── ListOrgs.ts          # Implementation
│   │   └── ListOrgs.test.ts     # Unit tests
│   ├── QueryRecords/
│   │   ├── QueryRecords.ts
│   │   └── QueryRecords.test.ts
│   └── ...
├── helpers/
│   ├── OrgService.ts
│   └── (tests could be added here)
└── ...
```

## Writing Tests

### Test File Naming Convention

- Test files should be named: `[ComponentName].test.ts`
- Place test files in the same directory as the component being tested

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('MyFunction', () => {
  it('should do something specific', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    const result = myFunction(null);
    expect(result).toBeNull();
  });
});
```

### Testing MCP Tools

Each tool has its own test file that typically tests:

1. **Input validation** - Zod schemas work correctly
2. **Success cases** - Tool returns expected output
3. **Error cases** - Tool handles errors gracefully
4. **Edge cases** - Boundary conditions and special inputs

Example from a tool test:

```typescript
describe('ListOrgs Tool', () => {
  it('should return list of authenticated orgs', async () => {
    const result = await ListOrgsTool.execute({});
    expect(result).toHaveProperty('status');
    expect(result.status).toBe('success');
  });

  it('should handle CLI errors', async () => {
    // Mock SF CLI failure
    // Assert error handling
  });
});
```

## Best Practices

### 1. Test in Isolation
- Mock external dependencies (SF CLI, file system, etc.)
- Don't make real API calls in unit tests

### 2. Test Edge Cases
- Empty inputs
- Invalid inputs
- Null/undefined values
- Large datasets

### 3. Descriptive Test Names
- Use "should" statements
- Make it clear what's being tested

```typescript
// Good
it('should return error when alias is not found', () => {});

// Bad
it('test error', () => {});
```

### 4. Keep Tests Fast
- Unit tests should run in milliseconds
- Mock slow operations (network, file I/O)

### 5. Test One Thing at a Time
- Each test should verify one specific behavior
- Split complex scenarios into multiple tests

## Continuous Integration

Tests run automatically on GitHub Actions when you push code. See `.github/workflows/runTests.yml` for the CI configuration.

## Debugging Tests

### Run a single test with debug output

```bash
npm test -- --reporter=verbose QueryRecords
```

### Use Vitest UI

For a visual interface to run and debug tests:

```bash
npm test -- --ui
```

This opens a browser-based UI where you can:
- See all tests organized by file
- Run individual tests
- View detailed failure messages
- See code coverage

## Test Coverage

Check what parts of the code are tested:

```bash
npm test -- --coverage
```

This generates a coverage report showing:
- Percentage of lines covered
- Which files need more tests
- Untested code paths

Coverage reports are generated in the `coverage/` directory (ignored by git).

## Next Steps

- 🧪 See [MCP_TOOLS_TESTING.md](./MCP_TOOLS_TESTING.md) to test the MCP tools interactively
- 📖 See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the codebase organization
- 🛠️ Check existing test files in `src/tools/*/` for examples

