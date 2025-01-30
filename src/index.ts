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
        version: '0.1.2',
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
          description: '發送訊息到webhook端點',
          inputSchema: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: '要發送的訊息內容',
              },
              username: {
                type: 'string',
                description: '顯示名稱（選填）',
              },
              avatar_url: {
                type: 'string', 
                description: '頭像URL（選填）',
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
          `未知的工具: ${request.params.name}`
        );
      }

      if (!isValidSendMessageArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'send_message 的參數無效'
        );
      }

      try {
        await axios.post(this.webhookUrl, {
          content: request.params.arguments.content,
          username: request.params.arguments.username,
          avatar_url: request.params.arguments.avatar_url,
        });

        return {
          content: [
            {
              type: 'text',
              text: '訊息已發送成功',
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `Webhook 錯誤: ${
                  error.response?.data?.message ?? error.message
                }`,
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
      console.error('[MCP Server] Webhook URL:', this.webhookUrl);
    } catch (error) {
      console.error('[MCP Server] Failed to start:', error);
      process.exit(1);
    }
  }
}

const server = new WebhookServer();
server.run().catch(console.error);
