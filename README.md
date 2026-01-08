# 🪝 mcp-webhook

<div align="center">

**A powerful MCP server that enables webhook messaging capabilities for your AI agents**

[![npm version](https://img.shields.io/npm/v/@kevinwatt/mcp-webhook.svg)](https://www.npmjs.com/package/@kevinwatt/mcp-webhook)
[![smithery badge](https://smithery.ai/badge/@kevinwatt/mcp-webhook)](https://smithery.ai/server/@kevinwatt/mcp-webhook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![MseeP.ai Security Assessment](https://mseep.net/mseep-audited.png)](https://mseep.ai/app/kevinwatt-mcp-webhook)

Send messages to any webhook endpoint through Claude, Dive, and other MCP-compatible AI systems. Perfect for notifications, alerts, and automated messaging.

[Features](#-features) • [Installation](#-installation) • [Tools](#-available-tools) • [Usage](#-usage-examples) • [Configuration](#-configuration)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🌐 **Generic Webhook Support**
- Works with any webhook endpoint
- Compatible with Discord, Slack, Mattermost
- Custom HTTP POST requests
- JSON payload formatting

</td>
<td width="50%">

### 🎨 **Customization**
- Custom display name (username)
- Avatar URL support
- Flexible message content
- Easy integration with any platform

</td>
</tr>
<tr>
<td width="50%">

### 🔌 **MCP Integration**
- Works with Dive Desktop
- Claude Desktop compatible
- Cursor, VS Code support
- Any MCP-compatible LLM

</td>
<td width="50%">

### 🛡️ **Simple & Secure**
- Minimal configuration
- Environment variable support
- No tracking or analytics
- MIT licensed

</td>
</tr>
</table>

<a href="https://glama.ai/mcp/servers/ijmd1ia5zg"><img width="380" height="200" src="https://glama.ai/mcp/servers/ijmd1ia5zg/badge" alt="Webhook Server MCP server" /></a>

---

## 🚀 Installation

### Getting Started

Add the following config to your MCP client:

```json
{
  "mcpServers": {
    "webhook": {
      "command": "npx",
      "args": ["-y", "@kevinwatt/mcp-webhook"],
      "env": {
        "WEBHOOK_URL": "your-webhook-url"
      }
    }
  }
}
```

### MCP Client Configuration

<details open>
<summary><strong>Dive</strong></summary>

1. Open [Dive Desktop](https://github.com/OpenAgentPlatform/Dive)
2. Click **"+ Add MCP Server"**
3. Paste the config provided above
4. Click **"Save"** and you're ready!

</details>

<details>
<summary><strong>Claude Code</strong></summary>

Use the Claude Code CLI to add the webhook MCP server ([guide](https://docs.anthropic.com/en/docs/claude-code/mcp)):

```bash
claude mcp add webhook -- npx @kevinwatt/mcp-webhook
```

Then set the webhook URL in your environment or config.

</details>

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to your `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "webhook": {
      "command": "npx",
      "args": ["-y", "@kevinwatt/mcp-webhook"],
      "env": {
        "WEBHOOK_URL": "your-webhook-url"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Go to `Cursor Settings` -> `MCP` -> `New MCP Server`. Use the config provided above.

</details>

<details>
<summary><strong>VS Code / Copilot</strong></summary>

Install via the VS Code CLI:

```bash
code --add-mcp '{"name":"webhook","command":"npx","args":["-y","@kevinwatt/mcp-webhook"],"env":{"WEBHOOK_URL":"your-webhook-url"}}'
```

Or follow the [MCP install guide](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_add-an-mcp-server) with the standard config from above.

</details>

<details>
<summary><strong>Windsurf</strong></summary>

Follow the [configure MCP guide](https://docs.windsurf.com/windsurf/cascade/mcp#mcp-config-json) using the standard config from above.

</details>

<details>
<summary><strong>Cline</strong></summary>

Follow [Cline MCP configuration guide](https://docs.cline.bot/mcp/configuring-mcp-servers) and use the config provided above.

</details>

<details>
<summary><strong>Warp</strong></summary>

Go to `Settings | AI | Manage MCP Servers` -> `+ Add` to [add an MCP Server](https://docs.warp.dev/knowledge-and-collaboration/mcp#adding-an-mcp-server). Use the config provided above.

</details>

<details>
<summary><strong>JetBrains AI Assistant</strong></summary>

Go to `Settings | Tools | AI Assistant | Model Context Protocol (MCP)` -> `Add`. Use the config provided above.

</details>

### Installing via Smithery

To install MCP Webhook Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@kevinwatt/mcp-webhook):

```bash
npx -y @smithery/cli install @kevinwatt/mcp-webhook --client claude
```

### Manual Installation

```bash
npm install -g @kevinwatt/mcp-webhook
```

---

## 🛠️ Available Tools

<table>
<tr>
<th width="30%">Tool</th>
<th width="70%">Description</th>
</tr>
<tr>
<td><code>send_message</code></td>
<td>

Send a message to the configured webhook endpoint
- **Parameters**:
  - `content` (string, required): Message content to send
  - `username` (string, optional): Custom display name
  - `avatar_url` (string, optional): Custom avatar URL
- **Returns**: Success/failure status

</td>
</tr>
</table>

---

## 💡 Usage Examples

### Basic Messages

```
"Send a message to webhook: Hello World!"
"Send 'Build completed successfully' to the webhook"
"Notify the team: Deployment finished"
```

### Custom Username

```
"Send a message with username 'Deploy Bot': Production update complete"
"Send content='Server restarted', username='System Monitor'"
```

### With Avatar

```
"Send a message with custom avatar: content='Alert!', avatar_url='https://example.com/alert.png'"
```

### Automation Examples

```
"Send a webhook message when the build completes"
"Notify via webhook: All tests passed!"
"Send deployment status to the webhook channel"
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEBHOOK_URL` | The webhook endpoint URL | Yes |

### Example Configurations

**Discord Webhook:**
```json
{
  "env": {
    "WEBHOOK_URL": "https://discord.com/api/webhooks/..."
  }
}
```

**Slack Incoming Webhook:**
```json
{
  "env": {
    "WEBHOOK_URL": "https://hooks.slack.com/services/..."
  }
}
```

**Mattermost Webhook:**
```json
{
  "env": {
    "WEBHOOK_URL": "https://your-mattermost.com/hooks/..."
  }
}
```

---

## 🏗️ Architecture

### Built With

- **[MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - Model Context Protocol
- **[Axios](https://github.com/axios/axios)** - HTTP client
- **TypeScript** - Type safety and developer experience

### Key Features

- ✅ **Simple**: Minimal setup, just provide a webhook URL
- ✅ **Flexible**: Works with any webhook-compatible service
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Lightweight**: Minimal dependencies

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) - For the Model Context Protocol
- [Dive](https://github.com/OpenAgentPlatform/Dive) - MCP-compatible AI platform

---

## 📚 Related Projects

- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Official MCP server implementations
- [Dive Desktop](https://github.com/OpenAgentPlatform/Dive) - AI agent platform

---

<div align="center">

[⬆ Back to Top](#-mcp-webhook)

</div>
