import { spawnSync } from "child_process";

export function executeSync(command: string): string {
  // IMPORTANT: This project uses MCP stdio transport; never write debug logs to stdout.
  // If you need logs, write to stderr (console.error).
  const result = spawnSync(command, {
    shell: true,
    encoding: "utf-8",
    maxBuffer: 5 * 1024 * 1024, // Increase buffer to 5MB for large outputs (e.g., test results)
    env: process.env,
  });

  const stdout = (result.stdout ?? "").toString();
  const stderr = (result.stderr ?? "").toString();

  // Non-zero exit => throw with context so GenericErrorsHandler can format it.
  if (result.status !== 0) {
    const err = new Error(
      stderr || stdout || `Command failed with status ${result.status}`
    );
    (err as any).stdout = stdout;
    (err as any).stderr = stderr;
    (err as any).status = result.status;
    (err as any).command = command;
    throw err;
  }

  // Some CLIs may emit JSON to stderr; prefer stdout but fall back to stderr.
  return stdout.trim() !== "" ? stdout : stderr;
}
