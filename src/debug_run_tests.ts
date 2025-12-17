import { RunTests } from "./tools/RunTests/RunTests.js";

// Method to debug the RunTests tool can be executed with npx tsx src/debug_run_tests.ts
async function debug() {
    console.log("Starting Debug Session for RunTests...");

    const testInput = {
        alias: "DevVadillo", // Replace with your target Org Alias
        testClasses: ["PaymentWebhookTest"], // Replace with actual test class names
        classesToCover: ["PaymentWebhook"], // Replace with actual class names to check coverage for
    };

    try {
        console.log("Executing RunTests with input:", testInput);
        const result = await RunTests.execute(testInput);
        console.log("Execution Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error during execution:", error);
    }
}

debug();
