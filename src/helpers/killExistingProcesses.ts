import os from 'os';
import { execSync } from "child_process";

const defaultPort = 1717; // Default port for SF commands

export function killExistingProcesses {
  if (os.platform() === 'win32') {
    // Windows
    const cmd = `for /f "tokens=5" %a in ('netstat -aon ^| find ":${defaultPort}" ^| find "LISTENING"') do taskkill /PID %a /F`;
    execSync(cmd);
  } else {
    // Linux/macOS
    const cmd = `lsof -i :${defaultPort} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
    execSync(cmd);
  }
}