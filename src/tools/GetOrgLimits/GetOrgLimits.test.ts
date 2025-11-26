import { vi, expect, test, beforeEach } from "vitest";
import { GetOrgLimits } from "./GetOrgLimits.js";

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
test('Get org limits success', () => {
    mockedExecuteSync.mockReturnValueOnce(`
        > Warning: @salesforce/cli update available.
        {"result": [
            {"max": 10000, "remaining": 8000},
            {"max": 5000, "remaining": 2000}
        ]}
        this is a test`
    );

    const result = GetOrgLimits.execute({ alias: 'test'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Limits for test org:');
    expect(result.content[0].text).toContain('"max":10000');
    expect(result.content[0].text).toContain('"remaining":8000');
    expect(result.content[0].text).toContain('"remainingPercent":"80%"');
    expect(result.content[0].text).toContain('"used":2000');
    expect(result.content[0].text).toContain('"usedPercent":"20%"');
});

test("GetOrgLimits cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = GetOrgLimits.execute({ alias: 'test'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});
