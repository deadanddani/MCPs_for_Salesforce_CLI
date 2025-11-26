import { vi, expect, test, beforeEach } from "vitest";
import { GetObjectSchema } from "./GetObjectSchema.js";

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

// --- TESTS ---
test('Get object schema success', () => {
    mockedExecuteSync.mockReturnValue(`{"status": 0}`);


    const result = GetObjectSchema.execute({ alias: 'test', objectName: 'Account'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain(`{"status": 0}`);
});

test("GetObjectSchema cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = GetObjectSchema.execute({ alias: 'test', objectName: 'Account'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});
