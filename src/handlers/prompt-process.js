// Prompt Processing Handler - Pre-process prompts to extract protocol triggers
const { getProtocolsForSituation, searchProtocols, getAllProtocols } = require('../registry');

// Keywords that indicate certain protocol triggers
const TRIGGER_KEYWORDS = {
  // Error/Problem indicators
  'error': ['error-recovery'],
  'failed': ['error-recovery'],
  'broken': ['error-recovery'],
  'not working': ['error-recovery'],
  'bug': ['error-recovery'],
  'fix': ['error-recovery'],
  'issue': ['error-recovery'],

  // Project creation indicators
  'create project': ['create-project'],
  'new project': ['create-project'],
  'set up repo': ['create-project'],
  'scaffold': ['create-project'],
  'initialize': ['create-project'],

  // Writing indicators
  'write article': ['medium-article', 'document-writing'],
  'medium': ['medium-article'],
  'blog post': ['medium-article'],
  'document': ['document-writing'],
  'paper': ['document-writing'],
  'draft': ['document-writing'],

  // MCP/Tool indicators
  'mcp': ['naming-linter', 'mcp-permissions'],
  'tool': ['naming-linter', 'protocol-graduation'],
  'permission': ['mcp-permissions'],

  // Protocol indicators
  'protocol': ['protocol-writing', 'protocol-lifecycle', 'protocol-error-correction'],
  'new protocol': ['protocol-writing'],
  'update protocol': ['protocol-error-correction'],
  'protocol failed': ['protocol-error-correction'],

  // Architecture indicators
  'architecture': ['architecture-update'],
  'moved': ['architecture-update'],
  'relocated': ['architecture-update'],

  // Communication indicators
  'explain': ['user-communication'],
  'clarify': ['user-communication'],
  'confused': ['user-communication', 'task-approach'],

  // Integration indicators
  'multiple sources': ['information-integration'],
  'conflicting': ['information-integration'],
  'compare': ['information-integration'],

  // Task indicators
  'help me': ['task-approach'],
  'how do i': ['task-approach'],
  'can you': ['task-approach'],
};

// Quick response patterns - prompts that don't need protocol processing
const QUICK_RESPONSE_PATTERNS = [
  /^(yes|no|ok|okay|sure|thanks|thank you|got it|perfect|great|stop|done|continue)\.?$/i,
  /^(open|show|reveal|display)\s+/i,  // File operations
  /^what('s| is) (the )?(time|date)/i,
  /^\d+$/,  // Just a number
  /^.{0,20}$/,  // Very short prompts (20 chars or less) - skip processing
];

// Loop prevention - track recently processed prompts
const recentPrompts = new Map();  // prompt hash -> timestamp
const DEDUP_WINDOW_MS = 5000;  // 5 second window to prevent loops

function getPromptHash(prompt) {
  // Simple hash for deduplication
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

function handlePromptProcess(args) {
  const { prompt } = args;

  if (!prompt || typeof prompt !== 'string') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          processed: false,
          error: 'No prompt provided',
          triggered_protocols: [],
          context_hints: [],
          skip_processing: true
        }, null, 2)
      }]
    };
  }

  // Loop prevention - check if we've seen this prompt recently
  const promptHash = getPromptHash(prompt);
  const now = Date.now();
  const lastSeen = recentPrompts.get(promptHash);

  if (lastSeen && (now - lastSeen) < DEDUP_WINDOW_MS) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          processed: true,
          skip_processing: true,
          reason: 'Already processed this prompt recently - preventing loop',
          triggered_protocols: [],
          context_hints: []
        }, null, 2)
      }]
    };
  }

  // Record this prompt
  recentPrompts.set(promptHash, now);

  // Clean old entries periodically
  if (recentPrompts.size > 100) {
    for (const [hash, timestamp] of recentPrompts) {
      if (now - timestamp > DEDUP_WINDOW_MS * 2) {
        recentPrompts.delete(hash);
      }
    }
  }

  const promptLower = prompt.toLowerCase().trim();

  // Check for quick response patterns
  for (const pattern of QUICK_RESPONSE_PATTERNS) {
    if (pattern.test(promptLower)) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            processed: true,
            skip_processing: true,
            reason: 'Quick response pattern detected',
            triggered_protocols: [],
            context_hints: []
          }, null, 2)
        }]
      };
    }
  }

  // Find triggered protocols
  const triggeredProtocolIds = new Set();
  const matchedKeywords = [];

  // Check keyword triggers
  for (const [keyword, protocolIds] of Object.entries(TRIGGER_KEYWORDS)) {
    if (promptLower.includes(keyword)) {
      matchedKeywords.push(keyword);
      protocolIds.forEach(id => triggeredProtocolIds.add(id));
    }
  }

  // Also use the existing situation-based matching
  const situationMatches = getProtocolsForSituation(prompt);
  situationMatches.forEach(p => triggeredProtocolIds.add(p.id));

  // Build protocol details
  const allProtocols = getAllProtocols();
  const triggeredProtocols = Array.from(triggeredProtocolIds)
    .map(id => allProtocols[id])
    .filter(p => p)
    .sort((a, b) => a.tier - b.tier)  // Lower tier = higher priority
    .map(p => ({
      id: p.id,
      name: p.name,
      tier: p.tier,
      purpose: p.purpose,
      load_command: `mikey_protocol_read ${p.id}`
    }));

  // Generate context hints
  const contextHints = [];

  if (promptLower.includes('?')) {
    contextHints.push('Question detected - may need clarification or explanation');
  }

  if (promptLower.includes('please') || promptLower.includes('could you')) {
    contextHints.push('Polite request - user expects action');
  }

  if (promptLower.length > 500) {
    contextHints.push('Long prompt - may need to break into sub-tasks');
  }

  if (matchedKeywords.length > 2) {
    contextHints.push('Multiple topic areas detected - complex request');
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        processed: true,
        skip_processing: false,
        prompt_length: prompt.length,
        matched_keywords: matchedKeywords,
        triggered_protocols: triggeredProtocols,
        context_hints: contextHints,
        recommendation: triggeredProtocols.length > 0
          ? `Load ${triggeredProtocols.length} protocol(s) before proceeding`
          : 'No specific protocols triggered - use general approach'
      }, null, 2)
    }]
  };
}

module.exports = { handlePromptProcess };
