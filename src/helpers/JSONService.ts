export function cleanJSONResult(jsonMessage:string): string {
    //remove ANSI escape codes (colors) that the CLI adds when FORCE_COLOR is set
    jsonMessage = jsonMessage.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
    //remove the warning messages at the start of the json
    jsonMessage = jsonMessage.replace(/^[^{]*({.*)$/s, '$1');
    jsonMessage = jsonMessage.replace(/(.*\})[^}]*$/s, '$1');
    return jsonMessage;
}