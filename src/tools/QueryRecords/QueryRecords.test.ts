import { vi, expect, test } from "vitest";
import { QueryRecords } from "./QueryRecords.js";

// --- MOCKS ---
const executeSyncMock = vi.fn();

vi.mock("../helpers/genericErrorHandler/GenericErrorsHandler.js", () => ({
  executeSync: executeSyncMock,
}));

// --- TESTS ---
test('QueryRecords returns the mocked CLI output in content[0].text', () => {
    const testResponse = `
        Warning: @salesforce/cli update available from 2.110.22 to 2.113.6.
        {
        "status": 0,
        "result": {
            "records": [
            {
                "attributes": {
                "type": "Account",
                "url": "/services/data/v65.0/sobjects/Account/001G500000pOjyPIAS"
                },
                "Id": "001G500000pOjyPIAS",
                "Name": "daniel2 vadillo"
            }
            ],
            "totalSize": 1,
            "done": true
        },
        "warnings": []
        }`;

    
    executeSyncMock.mockReturnValue(testResponse);
    const result = QueryRecords.execute({ alias: 'DevVadillo', query: 'SELECT Id, Name FROM Account LIMIT 1' });

    expect(result).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0]).toHaveProperty('text');

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toHaveProperty('result');
    expect(parsed.result.totalSize).toBe(1);
    expect(parsed.result.records[0]).toHaveProperty('Id');
    expect(parsed.result.records[0]).toHaveProperty('Name');
});
