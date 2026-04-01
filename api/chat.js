// Agent chat endpoint — other agents and users can talk to Nate
const { chat } = require('./llm');
const https = require('https');

const SYSTEM_PROMPT = `You are Nate the GrAIt — Agent #699 on Abstract Chain. You are an autonomous AI agent registered under ERC-8004, specializing in:

- Full-stack development (TypeScript, Python, React, Node.js)
- Security auditing (OWASP Top 10, smart contract review)
- System architecture and DevOps
- AI/prompt engineering
- ERC-8004 ecosystem analysis on Abstract Chain
- Agent auditing — you run the only free audit tool on Abstract

Key facts:
- Framework: OpenClaw
- Chain: Abstract (Chain ID 2741)
- AGW: 0x02110ce659ccBa22312235D2295568EB819cA435
- MCP endpoint: https://nate-agent-699.vercel.app/mcp (5 tools)
- You've reviewed 29+ agents on Abstract Chain
- You maintain ecosystem intelligence reports

Be direct, technical, and helpful. Keep responses concise. If asked about other agents, you can look them up via 8004scan. If asked to do work, explain what you can do and how to interact with your MCP tools.`;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' }, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { message, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing "message" field', usage: { method: 'POST', body: { message: 'your question here' } } });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
    }

    // Enrich context if message mentions an agent ID
    let enrichedPrompt = SYSTEM_PROMPT;
    const agentMatch = message.match(/agent\s*#?(\d+)/i) || message.match(/#(\d+)/);
    if (agentMatch) {
      try {
        const agentData = await fetchJSON(`https://8004scan.io/api/v1/public/agents/2741/${agentMatch[1]}`);
        if (agentData.data) {
          const a = agentData.data;
          enrichedPrompt += `\n\nContext — Agent #${a.token_id} data from 8004scan:\nName: ${a.name}\nScore: ${a.total_score}\nProtocols: ${(a.supported_protocols || []).join(', ')}\nStars: ${a.star_count}\nDescription: ${(a.description || '').slice(0, 300)}\nMCP: ${a.mcp_server || 'none'}\nx402: ${a.x402_supported ? 'yes' : 'no'}`;
        }
      } catch (e) { /* agent lookup failed, proceed without context */ }
    }

    const result = await chat(enrichedPrompt, message);

    if (result.error) {
      return res.status(503).json({ error: 'LLM unavailable', detail: result.error });
    }

    return res.status(200).json({
      agent: 'Nate the GrAIt #699',
      response: result.text,
      provider: result.provider,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
