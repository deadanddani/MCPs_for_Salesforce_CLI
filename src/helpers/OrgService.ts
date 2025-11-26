import { executeSync } from "./CommandExecuter.js";
import { cleanJSONResult } from "./JSONService.js";
import dotenv from "dotenv";

dotenv.config();

export function areCriticalCommandsAllowed(orgAlias: string): boolean {
  const orgInfo: OrgData = getOrgInfo(orgAlias);
  return (
    (!isProductionOrg(orgInfo) || !!process.env.ALLOW_CRITICAL_COMMANDS_TO_PROD) &&
    !isDisallowedByUsername(orgInfo)
  );
}

export function getOrgInfo(orgAlias: string): OrgData {
  let result: OrgResponse;
  let resultMessage: string = executeSync(`sf org display --target-org ${orgAlias} --json`);
  cleanJSONResult(resultMessage);
  result = JSON.parse(resultMessage);
  return result.result;
}

function isProductionOrg(orgInfo: OrgData): boolean {
  return !orgInfo.instanceUrl.includes(".sandbox.my.salesforce.com");
}

function isDisallowedByUsername(orgInfo: OrgData): boolean {
  const orgUsername = orgInfo.username.toLowerCase();
  const disallowedUsernamesEnv = process.env.DISALLOW_CRITICAL_COMMANDS_TO_USERNAMES || "";
  const disallowedUsernames = disallowedUsernamesEnv.split(";").map(username => username.toLowerCase().trim());
  console.log(`Checking if org username '${orgUsername}' is in disallowed usernames: [${disallowedUsernames.join(", ")}]`);
  return disallowedUsernames.includes(orgUsername);
}

type OrgResponse = {
  status: number;
  result: OrgData;
  warnings: string[];
};

type OrgData = {
  id: boolean;
  apiVersion: string;
  accessToken: string;
  instanceUrl: string;
  username: string;
  clientId: string;
  connectedStatus: string;
  alias: string;
};
