import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";

export const OpenOrgPage: Tool = {
  name: "Open_Org_Page",
  description: "This tool Will open the org page requested by the user",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias of the org to execute the command"
      ),
    sourceFile: z
      .string()
      .describe(
        "THIS IS NOT MANDATORY, This is the source file that will be open, only when the user explicitly request to open a source in specific will be filled, it should have this format 'force-app/main/default/{type}/{name} so for example if the user request to open the org to see the a specific file that is a flexipage it should be 'force-app/main/default/flexipages/{flexipageName}.flexipage-meta.xml and only it can be ApexPage, FlexiPage, Flow, or Agents'"
      ),
    isPrivate: z
      .boolean()
      .describe(
        "This will be set to true only if the user explicitly request for the page to open on private mode"
      ),
  },
  execute: getLimits,
  annotations: {
    title: "Open org page",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getLimits({
  alias,
  sourceFile,
  isPrivate,
}: {
  alias: string;
  sourceFile: string | null;
  isPrivate: boolean;
}) {
  let resultMessage: string | null = null;
  try {
    resultMessage = executeOpenCommand(alias, sourceFile, isPrivate);
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

function getDefaultErrorMessage(error: any): string {
  return `Error opening org page: ${
    error.stdout || error
  }. Please check if the org alias is correct.`;
}

function executeOpenCommand(
  alias: string,
  sourceFile: string | null,
  isPrivate: boolean
): string {
  let command: string = `sf org open --target-org ${alias}`;
  if (sourceFile != null && sourceFile != "") {
    command += ` --source-file ${sourceFile}`;
  }
  if (isPrivate) {
    command += ` --private`;
  }
  return executeSync(command);
}
