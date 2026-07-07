import { vi, expect, test, beforeEach } from "vitest";

// --- MOCKS ---
vi.mock("child_process", () => ({
    spawnSync: vi.fn(),
}));

import { spawnSync } from "child_process";
import { executeSync } from "./CommandExecuter.js";

const mockedSpawnSync = vi.mocked(spawnSync);

beforeEach(() => {
    mockedSpawnSync.mockReset();
});

// --- TESTS ---
test("executeSync returns the stdout of a successful command", () => {
    mockedSpawnSync.mockReturnValue({ status: 0, stdout: '{"status": 0}', stderr: "" } as any);

    const result = executeSync("sf org display --json");

    expect(result).toBe('{"status": 0}');
});

test("executeSync disables CLI colors so JSON output stays parseable", () => {
    mockedSpawnSync.mockReturnValue({ status: 0, stdout: "{}", stderr: "" } as any);

    executeSync("sf org display --json");

    const options: any = mockedSpawnSync.mock.calls[0][1];
    expect(options.env.FORCE_COLOR).toBe("0");
    expect(options.env.NO_COLOR).toBe("1");
});

test("executeSync throws with stdout attached when the command fails", () => {
    mockedSpawnSync.mockReturnValue({ status: 1, stdout: '{"status": 1}', stderr: "boom" } as any);

    try {
        executeSync("sf org display --json");
        expect.unreachable("executeSync should have thrown");
    } catch (error: any) {
        expect(error.status).toBe(1);
        expect(error.stdout).toBe('{"status": 1}');
        expect(error.stderr).toBe("boom");
    }
});
