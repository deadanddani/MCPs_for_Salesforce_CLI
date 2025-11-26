import { vi, expect, test, beforeEach } from "vitest";
import { authSF } from "./AuthSF.js";

// --- MOCKS ---
vi.mock("../../helpers/CommandExecuter.js", () => ({
    executeSync: vi.fn(),
}));

vi.mock("../../helpers/CliChecker.js", () => ({
    checkCliInstallation: vi.fn(),
}));

vi.mock("../../helpers/killExistingProcesses.js", () => ({
    killExistingProcesses: vi.fn(),
}));

import { executeSync } from "../../helpers/CommandExecuter.js";
import { checkCliInstallation } from "../../helpers/CliChecker.js";
import { killExistingProcesses } from "../../helpers/killExistingProcesses.js";

const mockedExecuteSync = vi.mocked(executeSync);
const mockedCheckCliInstallation = vi.mocked(checkCliInstallation);
const mockedKillExistingProcesses = vi.mocked(killExistingProcesses);

beforeEach(() => {
    mockedExecuteSync.mockReset();
    mockedCheckCliInstallation.mockReset();
    mockedKillExistingProcesses.mockReset();
});

// --- TESTS ---
test('AuthSF returns the mocked command response', () => {
    const testResponse = `
         ›   Warning: @salesforce/cli update available from 2.110.22 to 2.113.6.
        Successfully authorized test@test.com.test with org ID 00D000000000000000}
    `;

    mockedExecuteSync.mockReturnValue(testResponse);
    
    const result = authSF.execute({ alias: 'testDev', query: 'https://test.sanbbox.my.salesforce.com' });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Successfully authorized');
});


test("AuthSF cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = authSF.execute({ alias: 'testDev', query: 'https://test.sanbbox.my.salesforce.com' });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});


