import type { Tool } from "../../entities/Tool.js";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const ListOrgs: Tool = {
  name: "List_Orgs",
  description:
    "This tool is used When the user request which orgs or alias he has authenticated or when a tool fail because the org name is not configured, the idea is to show it to the user on a friendly way with a list, plase diferenciate between expired and non expired orgs and add any usefull information like the default org feel free to add any extra information that you have from the result json and the user requested",
  inputSchema: {},
  execute: getOrgList,
  annotations: {
    title: "Get Org List and Org Information",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getOrgList() {
  let resultMessage;
  try {
    resultMessage = executeSync("sf org list --all --json");
  } catch (error) {
    resultMessage = `Error during the command execution ${error} let the user know why it failed`;
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
