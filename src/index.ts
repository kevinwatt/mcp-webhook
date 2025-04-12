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
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isValidSendMessageArgs, isValidSendJsonArgs, SendMessageArgs, SendJsonArgs } from './utils/validators.js';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJsonPath = join(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

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
        name: pkg.name,
        version: pkg.version,
      },
      {
        capabilities: {
          tools: {
            alwaysAllow: ['send_message', 'send_json']
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
        {
          name: 'send_json',
          description: 'Send arbitrary JSON object to webhook endpoint',
          inputSchema: {
            type: 'object',
            properties: {
              body: {
                type: 'object',
                description: 'JSON object to send as the POST body',
                additionalProperties: true
              },
            },
            required: ['body'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'send_message') {
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
      } else if (request.params.name === 'send_json') {
        if (!isValidSendJsonArgs(request.params.arguments)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Body parameter is required and must be an object'
          );
        }
        
        try {
          await axios.post(this.webhookUrl, request.params.arguments.body);
          
          return {
            content: [
              {
                type: 'text',
                text: 'JSON sent successfully',
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
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
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
