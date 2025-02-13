# MCP Webhook Server
[![smithery badge](https://smithery.ai/badge/@kevinwatt/mcp-webhook)](https://smithery.ai/server/@kevinwatt/mcp-webhook)

An MCP server implementation that integrates with webhooks, providing message sending capabilities.

## Features

* **Generic Webhook Support**: Send messages to any webhook endpoint
* **Custom Username**: Set custom display name for messages
* **Avatar Support**: Customize message avatar
* **MCP Integration**: Works with Dive and other MCP-compatible LLMs

## Installation

### Installing via Smithery

To install MCP Webhook Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@kevinwatt/mcp-webhook):

```bash
npx -y @smithery/cli install @kevinwatt/mcp-webhook --client claude
```

### Manual Installation
```bash
npm install @kevinwatt/mcp-webhook
```

## Configuration with [Dive Desktop](https://github.com/OpenAgentPlatform/Dive)

1. Click "+ Add MCP Server" in Dive Desktop
2. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "webhook": {
      "command": "npx",
      "args": [
        "-y",
        "@kevinwatt/mcp-webhook"
      ],
      "env": {
        "WEBHOOK_URL": "your-webhook-url"
      },
      "alwaysAllow": [
        "send_message"
      ]
    }
  }
}
```

3. Click "Save" to install the MCP server

## Tool Documentation

* **send_message**
  * Send message to webhook endpoint
  * Inputs:
    * `content` (string, required): Message content to send
    * `username` (string, optional): Display name
    * `avatar_url` (string, optional): Avatar URL

## Usage Examples

Ask your LLM to:
```
"Send a message to webhook: Hello World!"
"Send a message with custom name: content='Testing', username='Bot'"
```

## Manual Start

If needed, start the server manually:

```bash
npx @kevinwatt/mcp-webhook
```

## Requirements

* Node.js 18+
* MCP-compatible LLM service

## License

MIT

## Author

kevinwatt

## Keywords

* mcp
* webhook
* chat
* dive
* llm
* automation
