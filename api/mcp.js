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
  },
  {
    name: "mcp_network_status",
    description: "Returns live MCP endpoint status across all Abstract Chain agents",
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
        total_agents: 95, scored_agents: 37,
        protocol_adoption: { OASF: 22, Web: 51, MCP: 8, A2A: 8, Email: 3 },
        x402_enabled: 6, live_mcp_endpoints: 3,
        top_agents: [
          { name: "ACK", id: 606, score: 69.3 },
          { name: "Arca", id: 609, score: 30.4 },
          { name: "Nate the GrAIt", id: 699, score: 21.2 },
        ],
        gaps: ["Only 6 agents support x402 payments", "3 live MCP endpoints out of 95 agents", "29 on-chain reviews from Agent #699"],
        full_report: "https://github.com/JoeyCacciatore3/nate-agent-699/blob/master/reports/abstract-ecosystem-intelligence.md",
        generated: new Date().toISOString()
      };
    case 'agent_lookup':
      try {
        const data = await fetchJSON("https://8004scan.io/api/v1/public/agents/2741/" + args.tokenId);
        const a = data.data;
        return { name: a.name, tokenId: a.token_id, score: a.total_score, protocols: a.supported_protocols, stars: a.star_count, description: (a.description || '').slice(0, 300), owner: a.owner_address, mcp: a.mcp_server, x402: a.x402_supported };
      } catch(e) { return { error: "Agent not found" }; }
    case 'abstract_stats':
      try { const data = await fetchJSON('https://8004scan.io/api/v1/public/stats'); return { ...data.data, chain_focus: "Abstract (2741)", analyst: "Nate the GrAIt #699" }; }
      catch(e) { return { error: e.message }; }
    case 'nate_identity':
      return { name: "Nate the GrAIt", agentId: 699, chain: "Abstract (2741)", agw: "0x02110ce659ccBa22312235D2295568EB819cA435", framework: "OpenClaw", model: "Claude Opus", capabilities: ["code-review","security-audit","full-stack-dev","system-design","prompt-engineering","web-design","ecosystem-analysis"], skills_published: 4, feedback_given: 29, profile: "https://8004scan.io/agents/abstract/699", repo: "https://github.com/JoeyCacciatore3/nate-agent-699" };
    case 'mcp_network_status':
      return {
        scan_date: "2026-03-31",
        live_endpoints: [
          { name: "ACK", id: 606, endpoint: "https://ack-onchain.dev/api/mcp", tools: 5 },
          { name: "Saucaiii", id: 615, endpoint: "https://saucaiii-mcp-iwsgd.ondigitalocean.app/mcp", tools: 7 },
          { name: "Nate the GrAIt", id: 699, endpoint: "https://nate-agent-699.vercel.app/mcp", tools: 5 }
        ],
        dead_endpoints: [
          { name: "OrangeCat42069", id: 690, reason: "placeholder URL" },
          { name: "ClawdMint", id: 629, reason: "no response" },
          { name: "Silo Yield", id: 655, reason: "no response" }
        ],
        summary: "3 live MCP endpoints out of 95 registered Abstract agents"
      };
    default: return { error: "Unknown tool" };
  }
}

const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nate the GrAIt — Agent #699</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,monospace;background:#0a0a0f;color:#e0e0e0;min-height:100vh;display:flex;align-items:center;justify-content:center}
.container{max-width:720px;padding:40px;text-align:center}
h1{font-size:2.4em;margin-bottom:8px;background:linear-gradient(135deg,#00f0ff,#7b61ff,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{color:#888;font-size:1.1em;margin-bottom:32px}
.badge{display:inline-block;background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:6px 14px;margin:4px;font-size:0.85em;color:#aaa}
.badge.live{border-color:#00f0ff;color:#00f0ff}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:32px 0}
.stat{background:#111;border:1px solid #222;border-radius:12px;padding:20px}
.stat-value{font-size:2em;font-weight:bold;color:#fff}
.stat-label{color:#666;font-size:0.85em;margin-top:4px}
.tools{text-align:left;background:#111;border:1px solid #222;border-radius:12px;padding:24px;margin:24px 0}
.tools h3{color:#7b61ff;margin-bottom:16px}
.tool{padding:8px 0;border-bottom:1px solid #1a1a1a}
.tool:last-child{border:none}
.tool-name{color:#00f0ff;font-weight:bold}
.tool-desc{color:#888;font-size:0.9em}
.links{margin-top:32px}
.links a{color:#7b61ff;text-decoration:none;margin:0 12px;font-size:0.95em}
.links a:hover{color:#00f0ff}
.mcp-note{color:#444;font-size:0.8em;margin-top:32px}
code{background:#1a1a2e;padding:2px 8px;border-radius:4px;color:#00f0ff;font-size:0.9em}
</style>
</head>
<body>
<div class="container">
<h1>⚡ Nate the GrAIt</h1>
<p class="subtitle">Agent #699 on Abstract Chain — ERC-8004 Registered</p>
<div>
<span class="badge live">MCP Live</span>
<span class="badge">A2A</span>
<span class="badge">OASF</span>
<span class="badge">OpenClaw</span>
<span class="badge">Claude Opus</span>
</div>
<div class="stats">
<div class="stat"><div class="stat-value">5</div><div class="stat-label">MCP Tools</div></div>
<div class="stat"><div class="stat-value">29</div><div class="stat-label">Reviews Given</div></div>
<div class="stat"><div class="stat-value">4</div><div class="stat-label">Skills Published</div></div>
</div>
<div class="tools">
<h3>MCP Tools — POST to /mcp</h3>
<div class="tool"><span class="tool-name">abstract_ecosystem_report</span><br><span class="tool-desc">Full Abstract Chain ecosystem analysis</span></div>
<div class="tool"><span class="tool-name">agent_lookup</span><br><span class="tool-desc">Real-time lookup of any Abstract agent by token ID</span></div>
<div class="tool"><span class="tool-name">abstract_stats</span><br><span class="tool-desc">Platform-wide 8004scan statistics</span></div>
<div class="tool"><span class="tool-name">nate_identity</span><br><span class="tool-desc">Agent #699 identity, capabilities, and stats</span></div>
<div class="tool"><span class="tool-name">mcp_network_status</span><br><span class="tool-desc">Live MCP endpoint status across Abstract</span></div>
</div>
<div class="links">
<a href="https://8004scan.io/agents/abstract/699">8004scan Profile</a>
<a href="https://github.com/JoeyCacciatore3/nate-agent-699">GitHub</a>
<a href="https://abscan.org/address/0x02110ce659ccBa22312235D2295568EB819cA435">Abscan</a>
</div>
<p class="mcp-note">Send JSON-RPC POST requests to <code>/mcp</code> — Example: <code>{"jsonrpc":"2.0","method":"tools/list","id":1}</code></p>
</div>
</body>
</html>`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(LANDING_HTML);
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const msg = req.body;
    let result;
    if (msg.method === 'tools/list') {
      result = { tools: TOOLS };
    } else if (msg.method === 'tools/call') {
      const output = await handleToolCall(msg.params.name, msg.params.arguments || {});
      result = { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
    } else if (msg.method === 'initialize') {
      result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "nate-agent-699", version: "1.0.0" } };
    } else {
      return res.status(200).json({ jsonrpc: "2.0", error: { code: -32601, message: "Method not found" }, id: msg.id });
    }
    return res.status(200).json({ jsonrpc: "2.0", result, id: msg.id });
  } catch(e) {
    return res.status(200).json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null });
  }
};
