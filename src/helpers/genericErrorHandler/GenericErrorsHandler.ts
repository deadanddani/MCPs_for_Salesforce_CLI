import type { CommandError } from "../entities/CommandError";
import { IErrorType } from "./errorTypes/IErrorType";
import { AliasError } from "./errorTypes/AliasError";

const errorTypes: Array<new (error: CommandError) => IErrorType> = [AliasError];

export function getMessage(errorUnformated: any): string | null {
  const error: CommandError | null = formatError(errorUnformated);

  if (error == null) {
    return null;
  }

  for (const errorType of errorTypes) {
    const errorTypeInstance = new errorType(error);

    if (errorTypeInstance.isThisErrorType()) {
      return errorTypeInstance.getErrorMessage();
    }
  }

  return null;
}

function formatError(error: any): CommandError | null {
  if (!isCommandError(error)) {
    return null;
  }

  const errorMessage = JSON.parse(error.stdout);

  const commandError: CommandError = {
    name: errorMessage.name,
    message: errorMessage.message,
    exitCode: errorMessage.exitCode,
    actions: errorMessage.actions,
    context: errorMessage.context,
    stack: errorMessage.stack,
    cause: errorMessage.cause,
    warnings: errorMessage.warnings,
    code: errorMessage.code,
    status: errorMessage.status,
    commandName: errorMessage.commandName,
  };

  return commandError;
}

function isCommandError(error: any) {
  return error.stdout != null;
}
