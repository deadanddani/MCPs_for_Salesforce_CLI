import { spawnSync } from "child_process";

export function executeSync(command: string): string {
  const result = spawnSync(command, {
    encoding: "utf-8",
    maxBuffer: 5 * 1024 * 1024,
    shell: true,
    stdio: 'pipe'
  });
  
  if(result.status !== 0) {
    throw new Error(`Command failed with status ${result.status} and message: ${result.stderr}`);
  }

  return result.stdout ? result.stdout : result.stderr;
}
