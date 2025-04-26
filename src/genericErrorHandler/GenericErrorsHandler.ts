import { CommandError } from "../entities/CommandError";
import { IErrorType } from "./errorTypes/IErrorType";
import { AliasError } from "./errorTypes/AliasError";

const errorTypes: Array<new (error: CommandError) => IErrorType> = [
  AliasError
];

export function getMessage(errorJSON: string): string|null {
  const error: CommandError = JSON.parse(errorJSON);

  for (const errorType of errorTypes) {
    const errorTypeInstance = new errorType(error);

    if (errorTypeInstance.isThisErrorType()) {
      return errorTypeInstance.getErrorMessage();
    }
  }

  return null;
}