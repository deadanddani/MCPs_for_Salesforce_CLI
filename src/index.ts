import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "testmcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
    'fetch_weather',
    'Tool to fetch the weather of a city',
    {
        city: z.string().describe("City name"),
    },
    async ({city}) => {
        //codigo que se ejecuta
        return {
            content: [
                {
                    type: "text",
                    text: `Fetching weather for ${city} its sunny`,
                },
            ]
        }
        
    }
)

const transport = new StdioServerTransport();
await server.connect(transport);