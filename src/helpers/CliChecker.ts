import which from "which";

export function checkCliInstallation() {
  try {
    which.sync("sf");
  } catch (err) {
    throw new Error(
      "Comand SF not found plase install it on the Terminal befor running the tool, you can do it with the command 'npm install @salesforce/cli'"
    );
  }
}
