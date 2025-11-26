import { vi, expect, test, beforeEach } from "vitest";
import { ListOrgs } from "./ListOrgs.js";

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
test("ListOrgs returns the mocked authorised org", () => {
  const testResponse = '{"status":0,"result":{"other":[],"sandboxes":[{"accessToken":"testToken","instanceUrl":"https://test.sandbox.my.salesforce.com","orgId":"00D000000000000000","username":"test@test.com.Develop","loginUrl":"https://test.salesforce.com/","clientId":"PlatformCLI","isDevHub":false,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"12/11/2025, 15:03:03","isScratch":false,"isSandbox":true,"tracksSource":true,"alias":"Develop","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:29:30.449Z","connectedStatus":"Connected"}],"nonScratchOrgs":[{"accessToken":"testToken","instanceUrl":"https://test.sandbox.my.salesforce.com","orgId":"00D000000000000000","username":"test@test.com.Develop","loginUrl":"https://test.salesforce.com/","clientId":"PlatformCLI","isDevHub":false,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"12/11/2025, 15:03:03","isScratch":false,"isSandbox":true,"tracksSource":true,"alias":"Develop","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:29:30.449Z","connectedStatus":"Connected"},{"accessToken":"testToken","instanceUrl":"https://test.my.salesforce.com","orgId":"00D000000000000001","username":"test@test.com","loginUrl":"https://login.salesforce.com/","clientId":"PlatformCLI","isDevHub":true,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"11/24/2025, 12:00:30 PM","name":"Test Org","instanceName":"Test Instance","namespacePrefix":null,"isSandbox":false,"isScratch":false,"trailExpirationDate":null,"tracksSource":false,"alias":"PROD","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:01:07.691Z","connectedStatus":"Connected"}]}}';

  mockedExecuteSync.mockReturnValue(testResponse);

  const result = ListOrgs.execute();

  expect(result).toBeDefined();
  expect(result.content[0].text).toContain('00D000000000000000');
});

test("ListOrgs cli not installed", () => {
    mockedCheckCliInstallation.mockImplementation(() => {
        throw new Error("Salesforce CLI is not installed.");
    });

    const result = ListOrgs.execute();

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('Salesforce CLI is not installed.');
});
