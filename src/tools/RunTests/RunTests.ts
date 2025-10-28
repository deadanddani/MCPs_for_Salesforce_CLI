import type { Tool } from "../../entities/Tool.js";
import { z } from "zod";
import { executeSync } from "../../helpers/CommandExecuter.js";
import { cleanJSONResult } from "../../helpers/JSONService.js";
import { getMessage } from "../../genericErrorHandler/GenericErrorsHandler.js";
import { isDeveloperOrg } from "../../helpers/OrgService.js";

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
    if( !isDeveloperOrg(alias) ){
      throw new Error("DeployMetadata tool can only be used on Developer orgs, not on Sandboxes or Production orgs.");
    }

    const classes = testClasses.join(",");
    resultMessage = executeSync(`sf apex run test --target-org ${alias} --class-names ${classes} --json --wait 30 --code-coverage`);
    if(resultMessage.length > 4000) {
      resultMessage = cleanJSONResult(resultMessage);
      let result = JSON.parse(resultMessage);
      result.result.coverage.coverage = result.result.coverage.coverage.filter((item: { name: string; }) =>
        classesToCover.includes(item.name)
      );
      resultMessage = 'Show a summary of the coverage percentage. this is the result:' + JSON.stringify(result);
    }
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
function getDefaultErrorMessage(error: any): any {
  return `Error during the command execution: ${
    error.stdout || error
  }. let the user know why it failed.`;
}

