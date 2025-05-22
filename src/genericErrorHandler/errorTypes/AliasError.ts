import { CommandError } from "../../entities/CommandError";
import { IErrorType } from "./IErrorType";
import { executeSync } from "../../helpers/CommandExecuter.js";

type AliasResult = {
  alias: string;
  value: string;
};

export class AliasError implements IErrorType {
  error: CommandError;

  constructor(error: CommandError) {
    this.error = error;
  }

  getErrorMessage(): string {
    const commandResult: string = executeSync("sf alias list --json ");
    const aliases: AliasResult[] = JSON.parse(commandResult).result;

    if (aliases.length === 0) {
      return "No aliases found. Please ask the user the log firswt an alias using the Auth tool.";
    }

    let resultMessage: string =
      "The alias provided is not valid, choose one by context and rerun the failed tool, alias list: \n";

    aliases.forEach((aliasObject) => {
      resultMessage += ` Alias: ${aliasObject.alias},  URL: ${aliasObject.value} \n`;
    });

    return resultMessage;
  }

  isThisErrorType(): boolean {
    return this.error.code === "NamedOrgNotFoundError";
  }
}
