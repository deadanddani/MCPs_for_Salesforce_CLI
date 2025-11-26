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
        throw new Error("Test execution failed.");
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