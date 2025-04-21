import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";

interface LimitValue {
  Max: number;
  Remaining: number;
  Used?: number;
}

interface OrgLimits {
  [key: string]: LimitValue;
}

export const GetOrgLimits: Tool = {
  name: "Get_Org_Limits",
  description:
    "This tool retrieves the current limits of a Salesforce org, including API calls, storage, and other important metrics",
  inputSchema: {
    alias: z
      .string()
      .describe(
        "Alias to be used to execute the following task this can be any name"
      ),
  },
  execute: getLimits,
  annotations: {
    title: "Get current org limits and usage",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
};

function getLimits({ alias }: { alias: string }) {
  let resultMessage;
  try {
    resultMessage = getOrgLimits(alias);
  } catch (error: any) {
    resultMessage = `Error retrieving org limits: ${error.message || error.toString()}. Please check if the org alias is correct and you have the necessary permissions.`;
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

function getOrgLimits(alias: string): string {
  return executeSync(
    `sf limits:api:display --target-org ${alias} --json`
  );
}
