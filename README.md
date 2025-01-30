# MCP Webhook Server

An MCP server for posting messages to webhooks.

<a href="https://glama.ai/mcp/servers/ijmd1ia5zg"><img width="380" height="200" src="https://glama.ai/mcp/servers/ijmd1ia5zg/badge" alt="Webhook Server MCP server" /></a>

## Installation

```bash
npm install @kevinwatt/mcp-webhook
```

## Configuration

Add the following to your MCP configuration file:

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
