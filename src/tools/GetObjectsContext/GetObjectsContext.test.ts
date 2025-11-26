import { vi, expect, test, beforeEach } from "vitest";
import { GetObjectsContext } from "./GetObjectsContext.js";

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
    mockedExecuteSync.mockReturnValueOnce(`
        > Warning: @salesforce/cli update available.
        {"result": ["StandarObject1", "StandarObject2"]}
        this is a test`
    );
    mockedExecuteSync.mockReturnValueOnce(`
        > Warning: @salesforce/cli update available.
        {"result": ["CustomObject1", "CustomObject2"]}
        this is a test`
    );

    const result = GetObjectsContext.execute({ alias: 'test'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('"standardObjects":');
    expect(result.content[0].text).toContain('"StandarObject1"');
    expect(result.content[0].text).toContain('"CustomObject1"');
});

test("GetObjectSchema cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = GetObjectsContext.execute({ alias: 'test'});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});
