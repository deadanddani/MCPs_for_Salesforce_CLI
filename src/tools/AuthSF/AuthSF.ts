import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { execSync } from "child_process";
import { checkCliInstallation } from "../../helpers/CliChecker.js";
import { killExistingProcesses } from "../../helpers/killExistingProcesses.js";

export const authSF: Tool = {
  name: "Auth_Salesforce_Instance",
  description:
    "Tool to authenticate to Salesforce Instance only execute it when the user explicitly ask for authenticate a new org or if he need to add a new org",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias of the org to execute the command"
      ),
    instanceUrl: z
      .string()
      .describe(
        "Salesforce Instance URL We can have 3 options and we need the user to specify witch it can be production then the value you should pass is 'https://login.salesforce.com', beta then the value you should pass is 'https://test.salesforce.com' or custom if it is custom the user need to share a url like this https://mydomain.salesforce.com must not have anything else after the .com"
      ),
  },
  execute: authSFLogic,
  annotations: {
    title: "Authorize Salesforce Instance",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function authSFLogic({
  alias,
  instanceUrl,
}: {
  alias: string;
  instanceUrl: string;
}) {
  let message;
  try {
    let message2 = Auth(alias, instanceUrl);
    message = `Authenticated to Salesforce Instance with alias ${alias} and instance URL ${instanceUrl} and message ${message2}`;
  } catch (error) {
    message = `Authenticated to Salesforce Failed with the error: ${error}`;
  }

  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}

function Auth(alias: string, instanceUrl: string) {
  checkCliInstallation();
  killExistingProcesses();

  return execSync(
    `sf org login web --alias ${alias} --set-default --instance-url ${instanceUrl}`
  );
}
