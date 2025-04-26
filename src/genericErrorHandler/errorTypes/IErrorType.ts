import { CommandError } from "../../entities/CommandError";

export interface IErrorType {
  isThisErrorType(): boolean;
  getErrorMessage(): string;
}