import { execSync } from "child_process";

export function executeSync(command: string): string {
  return execSync(command, { 
    encoding: "utf-8",
    maxBuffer: 5 * 1024 * 1024 // Increase buffer to 5MB for test executions results
  });
}
