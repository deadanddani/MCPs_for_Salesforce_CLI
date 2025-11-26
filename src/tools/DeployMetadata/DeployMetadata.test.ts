import { vi, expect, test, beforeEach } from "vitest";
import { DeployMetadata } from "./DeployMetadata.js";

// --- MOCKS ---
vi.mock("../../helpers/CommandExecuter.js", () => ({
    executeSync: vi.fn(),
}));

vi.mock("../../helpers/CliChecker.js", () => ({
    checkCliInstallation: vi.fn(),
}));

vi.mock("../../helpers/OrgService.js", () => ({
    areCriticalCommandsAllowed: vi.fn(),
}));


import { executeSync } from "../../helpers/CommandExecuter.js";
import { checkCliInstallation } from "../../helpers/CliChecker.js";
import { areCriticalCommandsAllowed } from "../../helpers/OrgService.js";

const mockedExecuteSync = vi.mocked(executeSync);
const mockedCheckCliInstallation = vi.mocked(checkCliInstallation);
const mockedAreCriticalCommandsAllowed = vi.mocked(areCriticalCommandsAllowed);

beforeEach(() => {
    mockedExecuteSync.mockReset();
    mockedCheckCliInstallation.mockReset();
    mockedAreCriticalCommandsAllowed.mockReset();
});

// --- TESTS ---
test('Deploy Metadata to PROD org', () => {
    mockedAreCriticalCommandsAllowed.mockReturnValue(false);

    const result = DeployMetadata.execute({ alias: 'testPROD', projectPath: 'C:/testProject/', metadataPath: 'C:/testProject/force-app/main/default/classes/TestClass.cls' });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(`DeployMetadata is disabled as is consider a critical command for this enviroment/Alias`);
});

test('Deploy Metadata to Developer org', () => {
    const testResponse = `
    {
        "status": 0,
        "result": {
            "checkOnly": false,
            "completedDate": "2025-11-26T19:18:35.000Z",
            "createdBy": "000000000000000",
            "createdByName": "testName",
            "createdDate": "2025-11-26T19:18:25.000Z",
            "details": {
            "componentSuccesses": [
                {
                "changed": false,
                "componentType": "ApexClass",
                "created": false,
                "createdDate": "2025-11-26T19:18:34.000Z",
                "deleted": false,
                "fileName": "classes/testClass.cls",
                "fullName": "TestClass",
                "id": "000000000000000",
                "success": true
                },
                {
                "changed": true,
                "componentType": "",
                "created": false,
                "createdDate": "2025-11-26T19:18:35.000Z",
                "deleted": false,
                "fileName": "package.xml",
                "fullName": "package.xml",
                "success": true
                }
            ],
            "runTestResult": {
                "numFailures": 0,
                "numTestsRun": 0,
                "totalTime": 0,
                "codeCoverage": [],
                "codeCoverageWarnings": [],
                "failures": [],
                "flowCoverage": [],
                "flowCoverageWarnings": [],
                "successes": []
            },
            "componentFailures": []
            },
            "done": true,
            "id": "000000000000000",
            "ignoreWarnings": false,
            "lastModifiedDate": "2025-11-26T19:18:35.000Z",
            "numberComponentErrors": 0,
            "numberComponentsDeployed": 1,
            "numberComponentsTotal": 1,
            "numberFiles": "4",
            "numberTestErrors": 0,
            "numberTestsCompleted": 0,
            "numberTestsTotal": 0,
            "rollbackOnError": true,
            "runTestsEnabled": false,
            "startDate": "2025-11-26T19:18:26.000Z",
            "status": "Succeeded",
            "success": true,
            "zipSize": 1845,
            "files": [
            {
                "fullName": "TestClass",
                "type": "ApexClass",
                "state": "Unchanged",
                "filePath": "/Users/TestClass.cls"
            },
            {
                "fullName": "TestClass",
                "type": "ApexClass",
                "state": "Unchanged",
                "filePath": "/Users/TestClass.cls"
            },
            ],
            "zipFileCount": 3,
            "deployUrl": "https://test.salesforce.com/00D000000000000000/deployRequest/000000000000000"
        },
        "warnings": []
    }`;

    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedExecuteSync.mockReturnValue(testResponse);

    const result = DeployMetadata.execute({ alias: 'testDev', projectPath: 'C:/testProject/', metadataPath: 'C:/testProject/force-app/main/default/classes/TestClass.cls' });

    expect(result).toBeDefined();
});

test("DeployMetadata cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = DeployMetadata.execute({ alias: 'testPROD', projectPath: 'C:/testProject/', metadataPath: 'C:/testProject/force-app/main/default/classes/TestClass.cls' });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});
