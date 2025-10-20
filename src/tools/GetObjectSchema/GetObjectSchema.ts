import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";

export const GetObjectSchema: Tool = {
  name: "Get_Object_Schema",
  description:
    "This tool is used when we are missing some object field,configuration or schema " +
    "This may be used as request from the user, after a get_Object_Context or before a query Records, " +
    "to match the fields requested by the user and know who to filter",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias of the org to execute the command"
      ),
    objectName: z
      .string()
      .describe(
        "name of the object witch we need the fields, configuration or schema, must be getted from the get_Object_Context"
      ),
  },
  execute: getSchema,
  annotations: {
    title:
      "Search for the full schema of the org so the IA chat can use it later",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getSchema({
  alias,
  objectName,
}: {
  alias: string;
  objectName: string;
}) {
  let resultMessage;
  try {
    resultMessage = getObjectSchema(alias, objectName);
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

function getObjectSchema(alias: string, objectName: string): string {
  return executeSync(
    `sf sobject describe --sobject ${objectName} --target-org ${alias}`
  );
}

function getDefaultErrorMessage(error: any): string {
  return `Error during the command execution: ${
    error.stdout || error
  }. let the user know why it failed.`;
}
