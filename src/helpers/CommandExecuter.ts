import { execSync } from "child_process";

export function executeSync(command: string): string {
  try {
    return execSync(command, { 
      encoding: "utf-8",
      maxBuffer: 5 * 1024 * 1024 // Increase buffer to 5MB for test executions results
    });
  } catch (err: any) {
    // err may contain stdout/stderr as Buffer or string; normalize both
    const stdout = err && (err.stdout ?? (err.output && err.output[1]));
    const stderr = err && (err.stderr ?? (err.output && err.output[2]));

    const toStr = (v: any) => {
      if (v === undefined || v === null) return "";
      if (Buffer.isBuffer(v)) return v.toString("utf-8");
      if (typeof v === "string") return v;
      try {
        return String(v);
      } catch {
        return "";
      }
    };

    const out = toStr(stdout);
    const errOut = toStr(stderr);
    const message = err && err.message ? String(err.message) : "";

    // Prefer stdout (where sf --json writes) and include stderr and the error message
    const combined = [out, errOut, message].filter(Boolean).join("\n");
    return combined;
  }
}
