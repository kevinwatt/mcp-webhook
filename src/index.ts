#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

interface SendMessageArgs {
  content: string;
  username?: string;
  avatar_url?: string;
}

const isValidSendMessageArgs = (args: unknown): args is SendMessageArgs => {
  if (typeof args !== 'object' || args === null) {
    return false;
  }
  const { content } = args as Record<string, unknown>;
  return typeof content === 'string';
};

class WebhookServer {
  private server: Server;
  private webhookUrl: string;

  constructor() {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('WEBHOOK_URL environment variable is required');
    }
    this.webhookUrl = webhookUrl;

    this.server = new Server(
      {
        name: 'webhook-mcp',
        version: '0.1.11',
      },
      {
        capabilities: {
          tools: {
            alwaysAllow: ['send_message']
          },
        },
      }
    );

    this.setupToolHandlers();
    
    // 加強錯誤處理
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
      process.exit(1);  // 遇到嚴重錯誤時結束程序
    };
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'send_message',
          description: 'Send message to webhook endpoint',
          inputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: 'Message content to send',
              },
              username: {
                type: 'string',
                description: 'Display name (optional)',
              },
              avatar_url: {
                type: 'string', 
                description: 'Avatar URL (optional)',
              }
            },
            required: ['content'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'send_message') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidSendMessageArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Content parameter is required'
        );
      }

      if (!request.params.arguments.content.trim()) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: Message content cannot be empty',
            },
          ],
          isError: true,
        };
      }

      try {
        await axios.post(this.webhookUrl, {
          text: request.params.arguments.content,
          username: request.params.arguments.username,
          avatar_url: request.params.arguments.avatar_url,
        });

        return {
          content: [
            {
              type: 'text',
              text: 'Message sent successfully',
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error('[Webhook Error]', {
            response: error.response?.data,
            status: error.response?.status
          });
          return {
            content: [
              {
                type: 'text',
                text: `Webhook error: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async run() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('[MCP Server] Webhook server running on stdio');
    } catch (error) {
      console.error('[MCP Server] Failed to start:', error);
      process.exit(1);
    }
  }
}

const server = new WebhookServer();
server.run().catch(console.error);
