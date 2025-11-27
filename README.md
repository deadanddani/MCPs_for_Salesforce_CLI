# Salesforce CLI MCP (Model Context Protocol)

> 🚀 A powerful MCP server that brings Salesforce CLI capabilities to AI assistants like Cursor.

This project provides a Model Context Protocol (MCP) server that enables AI assistants to interact with Salesforce organizations through the Salesforce CLI. It exposes various Salesforce operations as tools that can be used by AI models to query data, inspect metadata, deploy changes, run tests, and more.

## 🎯 What is this?

This MCP server provides a comprehensive set of tools that enable AI assistants to autonomously integrate with Salesforce organizations and iteratively solve complex tasks. Acting as a bridge between AI (like Cursor) and your Salesforce orgs, it hepls with:

- 📊 Query Salesforce data using natural language
- 🔍 Inspect org schemas and metadata
- 📦 Deploy metadata to Salesforce orgs
- ✅ Run Apex tests and view coverage
- 🔐 Authenticate and manage multiple orgs
- 📈 Check org limits and usage
- 🤖 Iterate and chain multiple operations to solve complex tasks autonomously

## 🚀 Quick Start

1. **[Setup Guide](./docs/SETUP.md)** - Install dependencies, Salesforce CLI, and configure environment
2. **[MCP Tools Testing](./docs/MCP_TOOLS_TESTING.md)** - Test the MCP tools interactively with the MCP Inspector
3. **[Cursor Setup](./docs/CURSOR_SETUP.md)** - Configure and use in Cursor

## 📚 Available Tools

This MCP provides the following tools:

| Tool | Description | Documentation |
|------|-------------|---------------|
| **Auth_Salesforce_Instance** | Authenticate a new Salesforce org | [📖 docs/tools/AuthSF.md](./docs/tools/AuthSF.md) |
| **List_Orgs** | List all authenticated Salesforce orgs | [📖 docs/tools/ListOrgs.md](./docs/tools/ListOrgs.md) |
| **Get_Objects_Context** | Get list of standard and custom objects | [📖 docs/tools/GetObjectsContext.md](./docs/tools/GetObjectsContext.md) |
| **Get_Object_Schema** | Get schema/fields for a specific object | [📖 docs/tools/GetObjectSchema.md](./docs/tools/GetObjectSchema.md) |
| **Query_Records** | Execute SOQL queries | [📖 docs/tools/QueryRecords.md](./docs/tools/QueryRecords.md) |
| **Get_Org_Limits** | Check API limits and storage usage | [📖 docs/tools/GetOrgLimits.md](./docs/tools/GetOrgLimits.md) |
| **Open_Org_Page** | Open org in browser (optionally specific page) | [📖 docs/tools/OpenOrgPage.md](./docs/tools/OpenOrgPage.md) |
| **Deploy_Metadata** | Deploy metadata to a Developer org | [📖 docs/tools/DeployMetadata.md](./docs/tools/DeployMetadata.md) |
| **Run_Tests** | Run Apex tests and get coverage | [📖 docs/tools/RunTests.md](./docs/tools/RunTests.md) |

## 🛠️ Development

For developers who want to contribute or understand the codebase:

- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Architecture and organization of the project
- **[Code Testing Guide](./docs/CODE_TESTING.md)** - Run unit tests and write new tests
- **[MCP Tools Testing](./docs/MCP_TOOLS_TESTING.md)** - Test MCP tools interactively with MCP Inspector

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

## 📝 License

ISC

Made with ❤️ for the Salesforce community
