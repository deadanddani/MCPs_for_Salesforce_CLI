import { execSync } from "child_process";

export function executeSync(command: string): string {
  return execSync(command, {
    encoding: "utf-8",
  });
}
