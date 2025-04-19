import { ZodType, TypeOf } from "zod";

export type Tool = {
  name: string;
  description: string;
  inputSchema: any;
  execute: any;
  annotations: any;
};
