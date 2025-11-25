import { vi, expect, test } from "vitest";
import { ListOrgs } from "./ListOrgs.js";

// --- MOCKS ---
const executeSyncMock = vi.fn();

vi.mock("../helpers/CommandExecuter.js", () => ({
  executeSync: executeSyncMock,
}));

// --- TESTS ---
test("ListOrgs returns the mocked CLI output in content[0].text", () => {
const testResponse = '{"status":0,"result":{"other":[],"sandboxes":[{"accessToken":"testToken","instanceUrl":"https://test.sandbox.my.salesforce.com","orgId":"00D000000000000000","username":"test@test.com.Develop","loginUrl":"https://test.salesforce.com/","clientId":"PlatformCLI","isDevHub":false,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"12/11/2025, 15:03:03","isScratch":false,"isSandbox":true,"tracksSource":true,"alias":"Develop","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:29:30.449Z","connectedStatus":"Connected"}],"nonScratchOrgs":[{"accessToken":"testToken","instanceUrl":"https://test.sandbox.my.salesforce.com","orgId":"00D000000000000000","username":"test@test.com.Develop","loginUrl":"https://test.salesforce.com/","clientId":"PlatformCLI","isDevHub":false,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"12/11/2025, 15:03:03","isScratch":false,"isSandbox":true,"tracksSource":true,"alias":"Develop","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:29:30.449Z","connectedStatus":"Connected"},{"accessToken":"testToken","instanceUrl":"https://test.my.salesforce.com","orgId":"00D000000000000001","username":"test@test.com","loginUrl":"https://login.salesforce.com/","clientId":"PlatformCLI","isDevHub":true,"instanceApiVersion":"65.0","instanceApiVersionLastRetrieved":"11/24/2025, 12:00:30 PM","name":"Test Org","instanceName":"Test Instance","namespacePrefix":null,"isSandbox":false,"isScratch":false,"trailExpirationDate":null,"tracksSource":false,"alias":"PROD","isDefaultDevHubUsername":false,"isDefaultUsername":false,"lastUsed":"2025-11-24T11:01:07.691Z","connectedStatus":"Connected"}]}}';

  executeSyncMock.mockReturnValue(testResponse);

  const result = ListOrgs.execute();

  expect(result).toBeDefined();
  expect(Array.isArray(result.content)).toBe(true);
  expect(result.content[0]).toHaveProperty("text");
});
