import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";

export const RefreshObjectsContext: Tool = {
  name: "Refresh_Objects_Context",
  description:
    "This tool is used when we are missing some custom or standar Object name ar the user request information related to object but not fields, this will return the full list of objects, that must be later use for future comands",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias to be used to execute the following task this can be any name"
      ),
  },
  execute: getContext,
  annotations: {
    title:
      "Search for the full schema of the org so the IA chat can use it later",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getContext({ alias }: { alias: string }) {
  let resultMessage;
  try {
    resultMessage = getObjectNames(alias);
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
  return `Error during the command execution: ${
    error.stdout || error
  }. let the user know why it failed.`;
}

function getObjectNames(alias: string): string {
  let resultObject: toolResult = {} as toolResult;
  resultObject.standardObjects = getObjects(alias, "standard");
  resultObject.customObjects = getObjects(alias, "custom");
  return JSON.stringify(resultObject);
}

function getObjects(alias: string, type: string): string[] {
  let stringResult: string = executeSync(
    `sf sobject list --sobject ${type} --target-org ${alias} --json`
  );
  let resultObject: SfSObjectListResponse = JSON.parse(stringResult);
  return resultObject.result;
}

type SfSObjectListResponse = {
  status: number;
  result: string[];
  warnings?: string[];
};

type toolResult = {
  standardObjects: string[];
  customObjects: string[];
};
