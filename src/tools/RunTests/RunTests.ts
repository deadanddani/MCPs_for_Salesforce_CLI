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
    returnCoverage: z.boolean().describe("Whether to return code coverage information or not, by default does not return coverage unless the user specify it or there is an error and you need to know the lines affected"),
    classesToCover: z.array(z.string()).describe("If returnCoverage is true, this list specifies which classes to include in the coverage report."),
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

function runTests({ alias, testClasses, returnCoverage, classesToCover }: { alias: string; testClasses: string[]; returnCoverage: boolean; classesToCover: string[] }) {
  let resultMessage;
  try {
    checkCliInstallation();
    if (!areCriticalCommandsAllowed(alias)) {
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
    let command = `sf apex run test --target-org ${alias} --class-names ${classes} --json --wait 30`;
    if (returnCoverage) {
      command += " --code-coverage";
    }
    resultMessage = executeSync(command);
    console.error("Raw command output:", resultMessage);
    if (returnCoverage) {
      resultMessage = reduceCoverageData(resultMessage, classesToCover);
    }
  } catch (error: any) {
    console.error("Error executing tests:", error);
    const stdout = error?.stdout;
    if (typeof stdout === "string" && isTestExecutionError(stdout)) {
      if (returnCoverage) {
        resultMessage = reduceCoverageData(stdout, classesToCover);
      } else {
        resultMessage = cleanJSONResult(stdout);
      }
    } else {
      resultMessage = getMessage(error);
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

function reduceCoverageData(resultMessage: string, classesToCover: string[]): any {
  resultMessage = cleanJSONResult(resultMessage);
  let result = JSON.parse(resultMessage);

  // Only filter coverage data if it exists
  if (result?.result?.coverage?.coverage) {
    result.result.coverage.coverage = result.result.coverage.coverage.filter((item: { name: string; }) =>
      classesToCover.includes(item.name)
    );
  }

  return JSON.stringify(result);
}

function isTestExecutionError(error: string): boolean {
  if (typeof error !== "string") return false;
  const errorMessage = cleanJSONResult(error);
  const errorMessageReduced = errorMessage.slice(0, 100);

  const match = errorMessageReduced.match(/"status"\s*:\s*100/);
  return !!match;
}

