import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";

export const QueryRecords: Tool = {
  name: "Query_Records",
  description:
    "This tool is used when the user request some information about specific " +
    "records but first you need to call the tools Get_Objects_Context and " +
    "Get_Object_Schema to build the query, if you are not sure of some " +
    "information like object custom object names or fields execute first those tools, " +
    "so for example if the user request account with contact info first get all the objects context " +
    "then the account schema then contact schema and the execute this. " +
    "represent the result on a table format",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias of the org to execute the command"
      ),
    query: z
      .string()
      .describe(
        "With the user request, and the information extracted from the tool refresh object context of the affected objects, build a SOQL query to retrive the data, always select a limit depening on the esxpected number of object or user request by default put 200, if you are not sure about a field or object name ask the user to request to refresh the context, if the query is complex try to filter as much as posible and process the date on the result with the IA"
      ),
  },
  execute: getRecords,
  annotations: {
    title: "Query records and display the information",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getRecords({ alias, query }: { alias: string; query: string }) {
  let resultMessage;
  try {
    resultMessage = executeSync(
      `sf data query --target-org ${alias} --query "${query}" --json`
    );
  } catch (error: any) {
    const errorstring = error.stdout;
    if (
      errorstring.includes("sObject type") ||
      errorstring.includes("No such column")
    ) {
      resultMessage = `The query failed because the object or field does not exist, please ask the user to request to refresh the context`;
    } else {
      resultMessage = getMessage(error) ?? getDefaultErrorMessage(error);
    }
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
