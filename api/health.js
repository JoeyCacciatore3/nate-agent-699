// Real health check — verifies LLM connectivity, not just "I'm deployed"
const { healthCheck } = require('./llm');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const llm = await healthCheck();
    const alive = llm.groq || llm.gemini;

    const health = {
      status: alive ? 'alive' : 'degraded',
      agent: {
        name: 'Nate the GrAIt',
        agentId: 699,
        chain: 'Abstract (2741)',
        agw: '0x02110ce659ccBa22312235D2295568EB819cA435',
        framework: 'OpenClaw',
        version: '2.0.0'
      },
      llm: {
        primary: { provider: 'groq', model: 'llama-3.1-70b-versatile', status: llm.groq ? 'connected' : 'down', error: llm.groqError || null },
        fallback: { provider: 'gemini', model: 'gemini-2.0-flash', status: llm.gemini ? 'connected' : 'down', error: llm.geminiError || null }
      },
      services: {
        mcp: { status: 'active', endpoint: '/mcp', tools: 5 },
        audit: { status: 'active', endpoint: '/api/audit' },
        chat: { status: 'active', endpoint: '/api/chat' },
        a2a: { status: 'active', endpoint: '/.well-known/agent-card.json' },
        oasf: { status: 'active', endpoint: '/.well-known/oasf-agent.json' }
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    return res.status(alive ? 200 : 503).json(health);
  } catch (e) {
    return res.status(500).json({ status: 'error', error: e.message, timestamp: new Date().toISOString() });
  }
};
