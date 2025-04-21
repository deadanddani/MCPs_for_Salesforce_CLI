import os from "os";
import { execSync } from "child_process";

const defaultPort = 1717; // Default port for SF commands

export function killExistingProcesses() {
  try {
    if (os.platform() === "win32") {
      // Windows - using PowerShell for better process handling
      const cmd = `Get-NetTCPConnection -LocalPort ${defaultPort} -State Listen | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }`;
      execSync(cmd, { shell: 'powershell.exe' });
    } else {
      // Linux/macOS
      const cmd = `lsof -i :${defaultPort} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
      execSync(cmd);
    }
  } catch (error) {
    // Silently fail if no processes are found or if there's an error
    // This is expected behavior as there might not be any processes to kill
    console.debug('No processes found on port', defaultPort);
  }
}
