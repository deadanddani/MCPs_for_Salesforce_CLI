export function cleanJSONResult(jsonMessage:string): string {
    //remove the warning messages at the start of the json
    jsonMessage = jsonMessage.replace(/^[^{]*({.*)$/s, '$1');
    jsonMessage = jsonMessage.replace(/(.*\})[^}]*$/s, '$1');
    return jsonMessage;
}