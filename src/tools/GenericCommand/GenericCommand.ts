import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

export const GenericCommand: Tool = {
  name: "Generic_command_execute",
  description:
    "This tool is used when no other one can be used to achive something the idea is to find a command of the SF cli that can be used to solve the question of the user, IMPORTANT we want to solve a custion only not do any chage on the or so avoid command that change stuff on the org",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias to be used to execute the following task this can be any name"
      ),
    command: z
      .string()
      .describe(
        "The user will request something, and we will try to find a command that can be used to solve the question of the user, IMPORTANT we want to solve a question we need to search the command from the Salesforce CLI documentation, alway select a org alisias and use the one requested by the user"
      ),
  },
  execute: ExecuteGenericCommand,
  annotations: {
    title: "Execute IA Generated Command",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function ExecuteGenericCommand({ command }: { command: string }) {
  let resultMessage;
  try {
    resultMessage = executeSync(command);
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
