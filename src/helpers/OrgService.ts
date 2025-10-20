import { executeSync } from "./CommandExecuter";
import { cleanJSONResult } from "./JSONService";

export function isDeveloperOrg(orgAlias: string): boolean {
  try {
    const orgInfo:OrgData = getOrgInfo(orgAlias);
    return orgInfo.instanceUrl.includes(".sandbox.my.salesforce.com") && 
      !orgInfo.username.endsWith(".uat") &&
      !orgInfo.username.endsWith(".develop");
    
  } catch (error) {
    throw error;
  }
}

export function isSandBox(orgAlias: string): boolean {
  try {
    const orgInfo:OrgData = getOrgInfo(orgAlias);
    return orgInfo.instanceUrl.includes(".sandbox.my.salesforce.com");
  } catch (error) {
    throw error;
  }
}

export function getOrgInfo(orgAlias: string): OrgData {
  let result: OrgResponse;
  try {
    let resultMessage: string = executeSync(`sf org display --target-org ${orgAlias} --json`);
    cleanJSONResult(resultMessage);
    result = JSON.parse(resultMessage);
  } catch (error) {
    throw error;
  }
  return result.result;
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
