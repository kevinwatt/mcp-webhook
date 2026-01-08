#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosError } from 'axios';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { isValidSendMessageArgs, isValidSendJsonArgs } from './utils/validators.js';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json with error handling
let pkg: { name: string; version: string };
try {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
} catch {
  pkg = { name: 'mcp-webhook', version: '0.0.0' };
}

// HTTP request timeout in milliseconds
const HTTP_TIMEOUT = 30000;

/**
 * Validates webhook URL format and protocol
 */
function validateWebhookUrl(url: string): void {
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Webhook URL must use http or https protocol');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('protocol')) {
      throw error;
    }
    throw new Error(`Invalid WEBHOOK_URL format: ${url}`);
  }
}

/**
 * Handles axios errors and returns a formatted error response
 */
function handleWebhookError(error: unknown): { content: Array<{ type: string; text: string }>; isError: true } {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || axiosError.message;
    console.error('[Webhook Error]', {
      response: axiosError.response?.data,
      status: axiosError.response?.status
    });
    return {
      content: [{ type: 'text', text: `Webhook error: ${errorMessage}` }],
      isError: true,
    };
  }
  // Log non-axios errors for debugging
  console.error('[Webhook Error] Unexpected error:', error);
  throw error;
}

class WebhookServer {
  private server: Server;
  private webhookUrl: string;

  constructor() {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('WEBHOOK_URL environment variable is required');
    }

    // Validate URL format
    validateWebhookUrl(webhookUrl);
    this.webhookUrl = webhookUrl;

    this.server = new Server(
      {
        name: pkg.name,
        version: pkg.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
      process.exit(1);
    };
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
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
        return this.handleSendMessage(request.params.arguments);
      } else if (request.params.name === 'send_json') {
        return this.handleSendJson(request.params.arguments);
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
    });
  }

  private async handleSendMessage(args: unknown) {
    if (!isValidSendMessageArgs(args)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Content parameter is required'
      );
    }

    if (!args.content.trim()) {
      return {
        content: [{ type: 'text', text: 'Error: Message content cannot be empty' }],
        isError: true,
      };
    }

    try {
      await axios.post(
        this.webhookUrl,
        {
          text: args.content,
          username: args.username,
          avatar_url: args.avatar_url,
        },
        { timeout: HTTP_TIMEOUT }
      );

      return {
        content: [{ type: 'text', text: 'Message sent successfully' }],
      };
    } catch (error) {
      return handleWebhookError(error);
    }
  }

  private async handleSendJson(args: unknown) {
    if (!isValidSendJsonArgs(args)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Body parameter is required and must be an object'
      );
    }

    try {
      await axios.post(this.webhookUrl, args.body, { timeout: HTTP_TIMEOUT });

      return {
        content: [{ type: 'text', text: 'JSON sent successfully' }],
      };
    } catch (error) {
      return handleWebhookError(error);
    }
  }

  async run(): Promise<void> {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      // Use stderr for MCP server logs (stdout is reserved for MCP protocol)
      console.error('[MCP Server] Webhook server running on stdio');
    } catch (error) {
      console.error('[MCP Server] Failed to start:', error);
      process.exit(1);
    }
  }
}

const server = new WebhookServer();
server.run().catch(console.error);
