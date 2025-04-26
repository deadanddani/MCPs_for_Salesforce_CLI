
import { CommandError } from '../../entities/CommandError';
import { IErrorType } from './IErrorType';

export class AliasError implements IErrorType {
  error: CommandError;
  
  constructor(error: CommandError) {
    this.error = error;
  }

  getErrorMessage(): string {
    return 'test';
  }

  isThisErrorType(): boolean {
    return this.error.code === 'NamedOrgNotFoundError';
  }
}