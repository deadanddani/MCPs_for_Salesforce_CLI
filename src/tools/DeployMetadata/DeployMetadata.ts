import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";
import { isDeveloperOrg } from "../../helpers/OrgService.js";

export const DeployMetadata: Tool = {
  name: "Deploy_Metadata",
  description: "Deploy the changes using Salesforce CLI USE ONLY ON DEVELOPER ORGS.",
  inputSchema: {
    alias: z.string().describe("Alias of the org to execute the command USE ONLY ON DEVELOPER ORGS."),
    projectPath: z.string().describe("Full Path of the Salesforce proyect where the deploy should be executed."),
    metadataPath: z.string().describe("Full Path of the single file or single folder to deploy, use always especific files or small folders never use full poryect path, big folder or package.xml files."),
  },
  execute: deployMetadata,
  annotations: {
    title: "Deploy metadata to Salesforce",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function deployMetadata({ alias,projectPath , metadataPath }: { alias: string; projectPath: string; metadataPath: string }) {
  let resultMessage;
  try {
    if( !isDeveloperOrg(alias) ){
      throw new Error("DeployMetadata tool can only be used on Developer orgs, not on Sandboxes or Production orgs.");
    }

    resultMessage = executeSync(`cd ${projectPath} && sf deploy metadata --target-org ${alias} --source-dir ${metadataPath} --json --ignore-conflicts`);
  } catch (error: any) {
    resultMessage = getMessage(error) ?? getDefaultErrorMessage(error);
  }
  return {
    content: [
      {
        type: "text",
        text: resultMessage,
      },
    ],
  };
}
function getDefaultErrorMessage(error: any): any {
  return `Error during the command execution: ${
    error.stdout || error
  }. let the user know why it failed.`;
}

