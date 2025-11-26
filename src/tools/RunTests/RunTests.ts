import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { cleanJSONResult } from "../../helpers/JSONService.js";
import { getMessage } from "../../helpers/genericErrorHandler/GenericErrorsHandler.js";
import { areCriticalCommandsAllowed } from "../../helpers/OrgService.js";
import { checkCliInstallation } from "../../helpers/CliChecker.js";

export const RunTests: Tool = {
  name: "Run_Tests",
  description: "Ejecuta tests en Salesforce usando el Salesforce CLI y retorna los resultados.",
  inputSchema: {
    alias: z.string().describe("Target organization's alias."),
    testClasses: z.array(z.string()).describe("List of test class names to run."),
    classesToCover: z.array(z.string()).describe("List of test class names to cover, add always the classes that the tests provided cover, this will be the only coverage information returned the rest will be skiped."),
  },
  execute: runTests,
  annotations: {
  title: "Run tests in Salesforce",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

function runTests({ alias, testClasses, classesToCover }: { alias: string; testClasses: string[]; classesToCover: string[] }) {
  let resultMessage;
  try {
    checkCliInstallation();
    if(!areCriticalCommandsAllowed(alias) ){
      return {
        content: [
          {
            type: "text",
            text: `Running tests is disabled as is consider a critical command for this enviroment/Alias, because is production or a custom user rule tell him to check it on the MCP configuration on the .env file.`,
          },
        ],
      };
    }

    const classes = testClasses.join(",");
    resultMessage = executeSync(`sf apex run test --target-org ${alias} --class-names ${classes} --json --wait 30 --code-coverage`);
    resultMessage = reduceCoverageData(resultMessage, classesToCover);
  } catch (error: any) {
    resultMessage = getMessage(error);
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

function reduceCoverageData(resultMessage: string, classesToCover: string[]): any {
  resultMessage = cleanJSONResult(resultMessage);
  let result = JSON.parse(resultMessage);
  result.result.coverage.coverage = result.result.coverage.coverage.filter((item: { name: string; }) =>
    classesToCover.includes(item.name)
  );
  return JSON.stringify(result);
}

