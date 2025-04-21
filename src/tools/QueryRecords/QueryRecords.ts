import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const QueryRecords: Tool = {
  name: "Query_Records",
  description:
    "This tool is used when the user request some information about specific records, if you are not sure of some information like object custom object names or fields ask the user to request to refresh the context, if the query return many records display only the number and ask the user to filter a bit",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias to be used to execute the following task this can be any name"
      ),
    query: z
      .string()
      .describe(
        "With the user request build a SOQL query to retrive the data, always select a limit depening on the esxpected number of object or user request by default put 200, if you are not sure about a field or object name ask the user to request to refresh the context, if the query is complex try to filter as much as posible and process the date on the result with the IA"
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
      `sf data query --target-org ${alias} --query "${query}"`
    );
  } catch (error: any) {
    const errorstring = error.tostring();
    if (
      errorstring.includes("sObject type") ||
      errorstring.includes("No such column")
    ) {
      resultMessage = `The query failed because the object or field does not exist, please ask the user to request to refresh the context`;
    } else {
      resultMessage = `Error during the command execution ${errorstring} let the user know why it failed`;
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
