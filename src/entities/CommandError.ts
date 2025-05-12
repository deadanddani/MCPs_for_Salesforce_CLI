export type CommandError = {
  name: string;
  message: string;
  exitCode: number;
  actions: string[];
  context: string;
  stack: string;
  cause: string | undefined;
  warnings: string[];
  code: string;
  status: number;
  commandName: string;
};
