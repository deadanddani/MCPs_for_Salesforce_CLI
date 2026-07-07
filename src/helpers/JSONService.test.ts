import { expect, test } from "vitest";
import { cleanJSONResult } from "./JSONService.js";

test("cleanJSONResult keeps a plain JSON message untouched", () => {
    const jsonMessage = `{"status": 0, "result": {"alias": "testDev"}}`;

    const result = cleanJSONResult(jsonMessage);

    expect(JSON.parse(result)).toEqual({ status: 0, result: { alias: "testDev" } });
});

test("cleanJSONResult removes warning messages around the JSON", () => {
    const jsonMessage = ` ›   Warning: @salesforce/cli update available from 2.130.9 to 2.140.6.\n{"status": 0, "result": {"alias": "testDev"}}\ntrailing noise`;

    const result = cleanJSONResult(jsonMessage);

    expect(JSON.parse(result)).toEqual({ status: 0, result: { alias: "testDev" } });
});

test("cleanJSONResult removes ANSI color codes added when FORCE_COLOR is set", () => {
    // Real shape of `sf ... --json` output when the MCP host sets FORCE_COLOR
    const jsonMessage = `\x1b[97m{\x1b[39m\n  \x1b[94m"status"\x1b[39m: \x1b[34m0\x1b[39m\x1b[32m,\x1b[39m\n  \x1b[94m"result"\x1b[39m: \x1b[97m{\x1b[39m \x1b[94m"alias"\x1b[39m: \x1b[92m"testDev"\x1b[39m \x1b[97m}\x1b[39m\n\x1b[97m}\x1b[39m`;

    const result = cleanJSONResult(jsonMessage);

    expect(JSON.parse(result)).toEqual({ status: 0, result: { alias: "testDev" } });
});
