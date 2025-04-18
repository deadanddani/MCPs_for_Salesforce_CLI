import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "../tools/toolsRepository";
import type { Tool } from "../entities/Tool.ts";

export const createServer = () => {
  const server = new McpServer({
    name: "testmcp",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  tools.forEach((tool: Tool) => {
    server.tool(tool.name, tool.description, tool.inputSchema, tool.execute);
  });

  return server;
};
