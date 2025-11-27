# 🛠️ Setup Guide

This guide will walk you through the complete setup process for the Salesforce CLI MCP.

## Prerequisites

### 1. Node.js
Make sure you have Node.js installed (version 18 or higher recommended).

### 2. Salesforce CLI
The Salesforce CLI (`sf`) is **required** for this MCP to work.

#### Check if Salesforce CLI is installed:
```bash
sf --version
```

#### Install Salesforce CLI (if not installed):

**Using npm:**
```bash
npm install -g @salesforce/cli
```

## Installation Steps

### 1. Clone the repository
```bash
git clone https://github.com/deadanddani/MCP.git
cd MCPs_for_Salesforce_CLI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Edit the `.env` file and configure the following variables:

#### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ALLOW_CRITICAL_COMMANDS_TO_PROD` | No | `false` | Allows critical commands (deploy, run tests) on Production orgs. Set to `true` only if you understand the risks. **Not recommended for production use.** |
| `DISALLOW_CRITICAL_COMMANDS_TO_USERNAMES` | No | `""` | Semicolon-separated list of usernames that should be blocked from critical commands, regardless of org type. Example: `user1@prod.com;user2@prod.com` |

#### What are "Critical Commands"?

Critical commands are operations that can modify your Salesforce org or interfere with the normal flow:
- **Deploy_Metadata** - Deploys code/metadata to an org
- **Run_Tests** - Runs Apex tests (can impact org performance)

By default, these commands are only allowed on:
- ✅ Sandbox orgs
- ✅ Developer orgs  
- ❌ Production orgs (unless `ALLOW_CRITICAL_COMMANDS_TO_PROD=true`)


> **Note:** The MCP automatically detects production orgs and is safe by default but you might not want to deploy to other orgs too.

---

[← Back to README](../README.md)

