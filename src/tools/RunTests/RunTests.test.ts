import { vi, expect, test, beforeEach } from "vitest";
import { RunTests } from "./RunTests.js";

// --- MOCKS ---
vi.mock("../../helpers/CommandExecuter.js", () => ({
    executeSync: vi.fn(),
}));

vi.mock("../../helpers/OrgService.js", () => ({
    areCriticalCommandsAllowed: vi.fn(),
}));

vi.mock("../../helpers/JSONService.js", () => ({
    cleanJSONResult: vi.fn(),
}));

vi.mock("../../helpers/CliChecker.js", () => ({
    checkCliInstallation: vi.fn(),
}));

import { executeSync } from "../../helpers/CommandExecuter.js";
import { areCriticalCommandsAllowed } from "../../helpers/OrgService.js";
import { cleanJSONResult } from "../../helpers/JSONService.js";
import { checkCliInstallation } from "../../helpers/CliChecker.js";

const mockedExecuteSync = vi.mocked(executeSync);
const mockedAreCriticalCommandsAllowed = vi.mocked(areCriticalCommandsAllowed);
const mockedCleanJSONResult = vi.mocked(cleanJSONResult);
const mockedCheckCliInstallation = vi.mocked(checkCliInstallation);

beforeEach(() => {
    mockedExecuteSync.mockReset();
    mockedAreCriticalCommandsAllowed.mockReset();
    mockedCleanJSONResult.mockReset();
    mockedCheckCliInstallation.mockReset();
});

// --- TESTS ---
test("Run tests successfully", () => {
    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedCheckCliInstallation.mockImplementation(() => {});
    mockedExecuteSync.mockReturnValueOnce(`{
        "result": {
            "coverage": {
                "coverage": [
                    { "name": "TestClass1", "coverage": 90 },
                    { "name": "TestClass2", "coverage": 80 }
                ]
            }
        }
    }`);
    mockedCleanJSONResult.mockImplementation((input) => input);

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["TestClass1", "TestClass2"],
        returnCoverage: true,
        classesToCover: ["TestClass1"]
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("TestClass1");
    expect(result.content[0].text).not.toContain("TestClass2");
});

test("Run tests disabled for critical environments", () => {
    mockedAreCriticalCommandsAllowed.mockReturnValue(false);
    mockedCheckCliInstallation.mockImplementation(() => {});

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["TestClass1", "TestClass2"],
        classesToCover: ["TestClass1"]
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Running tests is disabled as is consider a critical command");
});

test("Handle error during test execution", () => {
    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedCheckCliInstallation.mockImplementation(() => {});
    mockedExecuteSync.mockImplementation(() => {
        const error: any = new Error("Test execution failed.");
        error.stdout = "";
        error.stderr = "Test execution failed.";
        error.status = 1;
        throw error;
    });

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["TestClass1", "TestClass2"],
        classesToCover: ["TestClass1"]
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Test execution failed.");
});

test("Handle CLI not installed", () => {
    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["TestClass1", "TestClass2"],
        classesToCover: ["TestClass1"]
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Salesforce CLI is not installed.");
});

test("Handle test failure with status 100 without coverage", () => {
    const testFailureResult = JSON.stringify({
        status: 100,
        result: {
            summary: {
                outcome: "Failed",
                testsRan: 1,
                passing: 0,
                failing: 1
            },
            tests: [{
                FullName: "PaymentWebhookTest.testFailure",
                Outcome: "Fail",
                Message: "System.AssertException: Assertion Failed",
                StackTrace: "Class.PaymentWebhookTest.testFailure: line 10, column 1"
            }]
        }
    });

    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedCheckCliInstallation.mockImplementation(() => {});
    mockedCleanJSONResult.mockImplementation((input) => input);
    mockedExecuteSync.mockImplementation(() => {
        const error: any = new Error("Command failed with status 100");
        error.stdout = testFailureResult;
        error.stderr = "Warning: @salesforce/cli update available from 2.119.8 to 2.121.7.";
        error.status = 100;
        throw error;
    });

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["PaymentWebhookTest"],
        returnCoverage: false,
        classesToCover: []
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("PaymentWebhookTest.testFailure");
    expect(result.content[0].text).toContain("Assertion Failed");
});

test("Handle test failure with status 100 with coverage", () => {
    const testFailureResult = JSON.stringify({
        status: 100,
        result: {
            summary: {
                outcome: "Failed",
                testsRan: 1,
                passing: 0,
                failing: 1
            },
            tests: [{
                FullName: "PaymentWebhookTest.testFailure",
                Outcome: "Fail",
                Message: "System.AssertException: Assertion Failed"
            }],
            coverage: {
                coverage: [
                    { name: "PaymentWebhook", coveredPercent: 75 },
                    { name: "OtherClass", coveredPercent: 50 }
                ]
            }
        }
    });

    mockedAreCriticalCommandsAllowed.mockReturnValue(true);
    mockedCheckCliInstallation.mockImplementation(() => {});
    mockedCleanJSONResult.mockImplementation((input) => input);
    mockedExecuteSync.mockImplementation(() => {
        const error: any = new Error("Command failed with status 100");
        error.stdout = testFailureResult;
        error.stderr = "Warning: @salesforce/cli update available.";
        error.status = 100;
        throw error;
    });

    const result = RunTests.execute({
        alias: "test",
        testClasses: ["PaymentWebhookTest"],
        returnCoverage: true,
        classesToCover: ["PaymentWebhook"]
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("PaymentWebhook");
    expect(result.content[0].text).not.toContain("OtherClass");
});