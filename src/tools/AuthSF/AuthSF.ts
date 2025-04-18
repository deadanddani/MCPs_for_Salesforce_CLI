import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { execSync } from "child_process";
import { checkCliInstallation } from "../../helpers/CliChecker.js";

export const authSF: Tool = {
  name: "Auth_Salesforce_Instance",
  description:
    "Tool to authenticate to Salesforce Instance so the rest of the tools can be executed",
  inputSchema: {
    Alias: z
      .string()
      .describe(
        "Alias to be used to execute the following task this can be any name"
      ),
    instanceUrl: z
      .string()
      .describe(
        "Salesforce Instance URL We can have 3 options and we need the user to specify witch it can be production then the value you should pass is 'https://login.salesforce.com', beta then the value you should pass is 'https://test.salesforce.com' or custom if it is custom the user need to share a url like this https://mydomain.salesforce.com must not have anything else after the .com"
      ),
  },
  execute: authSFLogic,
};

function authSFLogic({
  Alias,
  instanceUrl,
}: {
  Alias: string;
  instanceUrl: string;
}) {
  let message;
  try {
    let message2 = Auth(Alias, instanceUrl);
    message = `Authenticated to Salesforce Instance with alias ${Alias} and instance URL ${instanceUrl} and message ${message2}`;
  } catch (error) {
    message = `Authenticated to Salesforce Failed with the error: ${error}`;
  }

  return {
    content: [
      {
        type: "text",
        text: `Authenticated to Salesforce Instance with alias ${Alias} and instance URL ${instanceUrl}`,
      },
    ],
  };
}

function Auth(Alias: string, instanceUrl: string) {
  checkCliInstallation();

  return execSync(
    `sf org login web --alias ${Alias} --set-default --instance-url ${instanceUrl}`
  );
}
