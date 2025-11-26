import { vi, expect, test, beforeEach } from "vitest";
import { QueryRecords } from "./QueryRecords.js";

// --- MOCKS ---
vi.mock("../../helpers/CommandExecuter.js", () => ({
    executeSync: vi.fn(),
}));

vi.mock("../../helpers/CliChecker.js", () => ({
    checkCliInstallation: vi.fn(),
}));

import { executeSync } from "../../helpers/CommandExecuter.js";
import { checkCliInstallation } from "../../helpers/CliChecker.js";

const mockedExecuteSync = vi.mocked(executeSync);
const mockedCheckCliInstallation = vi.mocked(checkCliInstallation);

beforeEach(() => {
    mockedExecuteSync.mockReset();
    mockedCheckCliInstallation.mockReset();
}); 

// --- TEST ---
test("QueryRecords returns parsed records from executeSync response", () => {
    const testResponse = `
      Warning: @salesforce/cli update available.
      {
        "status": 0,
        "result": {
          "records": [
            {
              "attributes": {
                "type": "Account",
                "url": "/services/data/v65.0/sobjects/Account/000000000000000001"
              },
              "Id": "000000000000000001",
              "Name": "testName"
            }
          ],
          "totalSize": 1,
          "done": true
        },
        "warnings": []
      }
  `;

    mockedExecuteSync.mockReturnValue(testResponse);

    const result = QueryRecords.execute({
        alias: "testDev",
        query: "SELECT Id, Name FROM Account LIMIT 1",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('testName');
});

test("QueryRecords cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = QueryRecords.execute({
        alias: "testDev",
        query: "SELECT Id, Name FROM Account LIMIT 1",
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});

test("QueryRecords handles 'sObject type' error gracefully", () => {
    const errorResponse = {
        stdout: "Error: sObject type 'CustomObject__c' is not supported."
    };

    mockedExecuteSync.mockImplementation(() => {
        throw errorResponse;
    });

    const result = QueryRecords.execute({
        alias: "testDev",
        query: "SELECT Id FROM CustomObject__c"
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(
        "The query failed because the object or field does not exist, please ask the user to request to refresh the context"
    );
});
