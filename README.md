# MCP Webhook Server

An MCP server for posting messages to webhooks.

## Installation

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

## Features

### send_message

Sends a message to webhook endpoint.

Parameters:
- `content`: Message content (required)
- `username`: Display name (optional)
- `avatar_url`: Avatar URL (optional)

Example:
```typescript
<use_mcp_tool>
<server_name>webhook</server_name>
<tool_name>send_message</tool_name>
<arguments>
{
  "content": "Test message",
  "username": "Custom Name"
}
</arguments>
</use_mcp_tool>
```

## Development

This project uses GitHub Actions for continuous integration and automated publishing to npm. When you push a new version tag (e.g., `v1.0.0`), it will automatically:

1. Build the package
2. Run tests
3. Publish to npm
4. Create a GitHub release

For more details about the release process, see [CHANGELOG.md](./CHANGELOG.md).

## License

MIT

## Author

kevinwatt
