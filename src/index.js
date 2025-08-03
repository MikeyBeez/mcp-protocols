#!/usr/bin/env node
// MCP Protocols Server - Modular, reliable protocol access
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Import modular handlers
const { handleProtocolList } = require('./handlers/list');
const { handleProtocolRead } = require('./handlers/read');
const { handleProtocolSearch } = require('./handlers/search');
const { handleProtocolTriggers } = require('./handlers/triggers');
const { handleProtocolIndex } = require('./handlers/index');
const { handleProtocolBackup } = require('./handlers/backup');

// Create MCP server
const server = new Server(
  {
    name: 'mcp-protocols',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'protocol_list',
        description: '📋 List all available protocols with metadata and triggers',
        inputSchema: {
          type: 'object',
          properties: {
            tier: {
              type: 'number',
              description: 'Filter by protocol tier (0=meta, 1=system, 2=foundation, 3=workflow)',
            },
            status: {
              type: 'string',
              description: 'Filter by status (active, inactive, deprecated)',
              enum: ['active', 'inactive', 'deprecated']
            }
          },
        },
      },
      {
        name: 'protocol_read',
        description: '📖 Read full content of a specific protocol with all trigger conditions',
        inputSchema: {
          type: 'object',
          properties: {
            protocol_id: {
              type: 'string',
              description: 'Protocol ID (error-recovery, user-communication, task-approach, information-integration, progress-communication)',
            },
          },
          required: ['protocol_id'],
        },
      },
      {
        name: 'protocol_search',
        description: '🔍 Search protocols by purpose, triggers, keywords, or situation',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (purpose, triggers, keywords)',
            },
            trigger_situation: {
              type: 'string',
              description: 'Describe current situation to find relevant protocols',
            }
          },
          required: ['query'],
        },
      },
      {
        name: 'protocol_index',
        description: '📚 Get the complete Master Protocol Index with all system status',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'protocol_backup',
        description: '💾 Create backup of all protocol data (JSON or Markdown)',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              description: 'Backup format (json, markdown)',
              enum: ['json', 'markdown']
            }
          },
        },
      },
      {
        name: 'protocol_triggers',
        description: '🎯 Get recommended protocols for a specific situation with trigger analysis',
        inputSchema: {
          type: 'object',
          properties: {
            situation: {
              type: 'string',
              description: 'Current situation or context (e.g., "error occurred", "user confused", "multiple sources", "long task")',
            },
          },
          required: ['situation'],
        },
      }
    ],
  };
});

// Tool call handlers - Modular routing
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'protocol_list':
        return handleProtocolList(args);
      
      case 'protocol_read':
        return handleProtocolRead(args);
      
      case 'protocol_search':
        return handleProtocolSearch(args);
      
      case 'protocol_triggers':
        return handleProtocolTriggers(args);
      
      case 'protocol_index':
        return handleProtocolIndex(args);
      
      case 'protocol_backup':
        return handleProtocolBackup(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `❌ Error in ${name}: ${error.message}\n\nThis error has been logged for system improvement.`
      }]
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

// Server ready message
console.error('🔧 mcp-protocols server running - reliable protocol access enabled!');
console.error('📋 Available tools: protocol_list, protocol_read, protocol_search, protocol_triggers, protocol_index, protocol_backup');
console.error('🎯 Quick start: protocol_triggers "error occurred" or protocol_list');
