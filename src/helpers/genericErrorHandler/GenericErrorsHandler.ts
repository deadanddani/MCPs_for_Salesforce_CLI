import type { CommandError } from "../../entities/CommandError.js";
import { IErrorType } from "./errorTypes/IErrorType.js";
import { AliasError } from "./errorTypes/AliasError.js";

const errorTypes: Array<new (error: CommandError) => IErrorType> = [AliasError];

export function getMessage(errorUnformated: any): string | null {
  const error: CommandError | null = formatError(errorUnformated);

  if (error == null) {
    return getDefaultErrorMessage(errorUnformated);
  }

  for (const errorType of errorTypes) {
    const errorTypeInstance = new errorType(error);

    if (errorTypeInstance.isThisErrorType()) {
      return errorTypeInstance.getErrorMessage();
    }
  }

  return getDefaultErrorMessage(errorUnformated);
}

function formatError(error: any): CommandError | null {
  if (!isCommandError(error)) {
    return null;
  }

  try {
    const errorMessage = JSON.parse(error.stdout);
  } catch {
    // Not a JSON error message
    return null;
  }

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

function getDefaultErrorMessage(error: any): string {
  return `Error during the tool execution: ${
    error.stdout || error
  }. try to fix it or let the user know why it failed.`;
}
