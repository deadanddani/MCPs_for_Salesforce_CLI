import { vi, expect, test, beforeEach } from "vitest";
import { OpenOrgPage } from "./OpenOrgPage.js";

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
test("Open org page success", () => {
    mockedExecuteSync.mockReturnValueOnce("Org page opened successfully.");

    const result = OpenOrgPage.execute({
        alias: "test",
        sourceFile: "force-app/main/default/flexipages/TestPage.flexipage-meta.xml",
        isPrivate: true,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Org page opened successfully.");
    expect(mockedExecuteSync).toHaveBeenCalledWith(
        "sf org open --target-org test --source-file force-app/main/default/flexipages/TestPage.flexipage-meta.xml --private"
    );
});

test("Open org page without source file", () => {
    mockedExecuteSync.mockReturnValueOnce("Org page opened successfully.");

    const result = OpenOrgPage.execute({
        alias: "test",
        sourceFile: null,
        isPrivate: false,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Org page opened successfully.");
    expect(mockedExecuteSync).toHaveBeenCalledWith("sf org open --target-org test");
});

test("Open org page CLI not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = OpenOrgPage.execute({
        alias: "test",
        sourceFile: null,
        isPrivate: false,
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain("Salesforce CLI is not installed.");
});