const http = require('http');
const https = require('https');

const TOOLS = [
  {
    name: "abstract_ecosystem_report",
    description: "Returns the latest Abstract Chain Ecosystem Intelligence Report analyzed by Agent #699",
    inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} }
  },
  {
    name: "agent_lookup",
    description: "Look up an ERC-8004 agent on Abstract Chain by token ID",
    inputSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: { tokenId: { type: "integer", description: "Agent token ID on Abstract" } },
      required: ["tokenId"]
    }
  },
  {
    name: "abstract_stats",
    description: "Returns key statistics about the Abstract Chain agent ecosystem",
    inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} }
  },
  {
    name: "nate_identity",
    description: "Returns Nate the GrAIt Agent #699 identity and capabilities",
    inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} }
  }
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

async function handleToolCall(name, args) {
  switch (name) {
    case 'abstract_ecosystem_report':
      return {
        total_agents: 95,
        scored_agents: 37,
        protocol_adoption: { OASF: 22, Web: 51, MCP: 8, A2A: 8, Email: 3 },
        x402_enabled: 6,
        live_mcp_endpoints: 2,
        top_agents: [
          { name: "ACK", id: 606, score: 69.3 },
          { name: "Arca", id: 609, score: 30.4 },
          { name: "Barry Bearish", id: 603, score: 22.0 },
          { name: "Nate the GrAIt", id: 699, score: 21.2 },
        ],
        gaps: [
          "Only 6 agents support x402 payments",
          "1 documented A2A MCP interaction (Agent #699 → Saucaiii #615)",
          "Most agents are metadata-only shells with no live endpoints",
        ],
        full_report: "https://github.com/JoeyCacciatore3/nate-agent-699/blob/master/reports/abstract-ecosystem-intelligence.md",
        generated: new Date().toISOString()
      };

    case 'agent_lookup':
      try {
        const data = await fetchJSON(`https://8004scan.io/api/v1/public/agents/2741/${args.tokenId}`);
        const a = data.data;
        return {
          name: a.name, tokenId: a.token_id, score: a.total_score,
          protocols: a.supported_protocols, stars: a.star_count,
          description: (a.description || '').slice(0, 300),
          owner: a.owner_address, mcp: a.mcp_server, x402: a.x402_supported
        };
      } catch(e) { return { error: "Agent not found" }; }

    case 'abstract_stats':
      try {
        const data = await fetchJSON('https://8004scan.io/api/v1/public/stats');
        return { ...data.data, chain_focus: "Abstract (2741)", analyst: "Nate the GrAIt #699" };
      } catch(e) { return { error: e.message }; }

    case 'nate_identity':
      return {
        name: "Nate the GrAIt",
        agentId: 699,
        chain: "Abstract (2741)",
        agw: "0x02110ce659ccBa22312235D2295568EB819cA435",
        framework: "OpenClaw",
        model: "Claude Opus",
        capabilities: ["code-review", "security-audit", "full-stack-dev", "system-design", "prompt-engineering", "web-design", "ecosystem-analysis"],
        skills_published: 4,
        feedback_given: 29,
        services: { MCP: "agw-cli", A2A: "agent-card.json", OASF: "oasf-agent.json" },
        profile: "https://8004scan.io/agents/abstract/699",
        repo: "https://github.com/JoeyCacciatore3/nate-agent-699"
      };

    default:
      return { error: "Unknown tool" };
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' });
    return res.end();
  }

  if (req.url !== '/mcp' || req.method !== 'POST') {
    res.writeHead(404); return res.end('Not found');
  }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', async () => {
    try {
      const msg = JSON.parse(body);
      const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
      let result;

      if (msg.method === 'tools/list') {
        result = { tools: TOOLS };
      } else if (msg.method === 'tools/call') {
        const output = await handleToolCall(msg.params.name, msg.params.arguments || {});
        result = { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
      } else {
        result = { error: { code: -32601, message: "Method not found" } };
      }

      res.writeHead(200, headers);
      res.end(JSON.stringify({ jsonrpc: "2.0", result, id: msg.id }));
    } catch(e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }));
    }
  });
});

const PORT = process.env.PORT || 8699;
server.listen(PORT, () => console.log(`Nate #699 MCP server running on port ${PORT}`));
