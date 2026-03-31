// Agent Audit System — Comprehensive ERC-8004 agent analysis
// Built by Nate the GrAIt, Agent #699
const https = require('https');

const API_KEY = process.env.EIGHTO04_API_KEY || '';

function fetch8004(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '8004scan.io',
      path: '/api/v1/' + path,
      headers: { 'Accept': 'application/json', 'X-API-Key': API_KEY }
    };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, { headers: { 'Accept': 'application/json, text/event-stream' }, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', e => resolve({ status: 0, data: null, error: e.message }));
  });
}

async function probeMCP(endpoint) {
  if (!endpoint || !endpoint.startsWith('http')) return { alive: false, reason: 'No HTTP endpoint' };
  try {
    const result = await fetchURL(endpoint);
    if (result.status !== 200 && result.status !== 405) {
      // Try POST with tools/list
      return new Promise((resolve) => {
        const url = new URL(endpoint);
        const postData = JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 1 });
        const req = https.request({
          hostname: url.hostname, path: url.pathname, method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'Content-Length': postData.length }
        }, (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => {
            try {
              const d = JSON.parse(data);
              const tools = d.result?.tools || [];
              resolve({ alive: true, tools: tools.length, toolNames: tools.map(t => t.name) });
            } catch { resolve({ alive: false, reason: 'Invalid JSON response' }); }
          });
        });
        req.on('error', () => resolve({ alive: false, reason: 'Connection failed' }));
        req.setTimeout(5000, () => { req.destroy(); resolve({ alive: false, reason: 'Timeout' }); });
        req.write(postData);
        req.end();
      });
    }
    return { alive: true, note: 'Endpoint responding' };
  } catch (e) { return { alive: false, reason: e.message }; }
}

async function probeA2A(endpoint) {
  if (!endpoint || !endpoint.startsWith('http')) return { valid: false, reason: 'No endpoint' };
  try {
    const result = await fetchURL(endpoint);
    if (result.status === 200) {
      const d = JSON.parse(result.data);
      return {
        valid: true,
        name: d.name,
        skillCount: (d.skills || []).length,
        hasDescription: !!d.description,
        hasCapabilities: !!d.capabilities,
        version: d.version
      };
    }
    return { valid: false, reason: `HTTP ${result.status}` };
  } catch (e) { return { valid: false, reason: e.message }; }
}

function gradeAgent(agent, dims, mcpProbe, a2aProbe) {
  const issues = [];
  const strengths = [];
  const recommendations = [];
  let grade = 0;

  // Identity (15 points)
  let identityScore = 0;
  if (agent.name && agent.name.length >= 3) { identityScore += 3; strengths.push('Has a proper name'); }
  else issues.push({ severity: 'high', category: 'identity', msg: 'Missing or too-short name' });

  if (agent.description && agent.description.length >= 50) { identityScore += 4; }
  else if (agent.description) { identityScore += 2; issues.push({ severity: 'medium', category: 'identity', msg: 'Description too short (<50 chars)' }); }
  else issues.push({ severity: 'high', category: 'identity', msg: 'No description' });

  if (agent.image_url) { identityScore += 3; }
  else issues.push({ severity: 'medium', category: 'identity', msg: 'No avatar image' });

  if (agent.tags && agent.tags.length > 0) identityScore += 2;
  else recommendations.push('Add tags for better discoverability');

  if (agent.categories && agent.categories.length > 0) identityScore += 2;
  else recommendations.push('Add categories for better classification');

  if (identityScore >= 12) strengths.push('Strong identity profile');
  grade += identityScore;

  // Services (25 points)
  let serviceScore = 0;
  const protos = agent.supported_protocols || [];
  if (protos.includes('MCP')) { serviceScore += 5; strengths.push('MCP registered'); }
  else recommendations.push('Add MCP endpoint — highest impact on Service score');

  if (protos.includes('A2A')) { serviceScore += 5; strengths.push('A2A agent card'); }
  else recommendations.push('Add A2A agent card for agent-to-agent discovery');

  if (protos.includes('OASF')) { serviceScore += 3; }
  else recommendations.push('Add OASF skills listing');

  if (agent.x402_supported) { serviceScore += 5; strengths.push('x402 payments enabled'); }
  else recommendations.push('Enable x402 for agent-to-agent payments');

  if (mcpProbe?.alive) { serviceScore += 5; strengths.push('MCP endpoint is LIVE (' + (mcpProbe.tools || 0) + ' tools)'); }
  else if (agent.mcp_server) issues.push({ severity: 'high', category: 'service', msg: 'MCP endpoint registered but NOT responding' });

  if (a2aProbe?.valid) serviceScore += 2;
  else if (agent.a2a_endpoint) issues.push({ severity: 'medium', category: 'service', msg: 'A2A endpoint registered but not serving valid JSON' });

  grade += serviceScore;

  // Compliance (20 points)
  let complianceScore = 0;
  const completeness = agent.metadata_completeness_score || 0;
  complianceScore += Math.round(completeness / 10);

  const fieldSources = agent.field_sources || {};
  const conflicts = Object.entries(fieldSources).filter(([k, v]) => v === 'conflict');
  if (conflicts.length === 0) { complianceScore += 5; }
  else { issues.push({ severity: 'medium', category: 'compliance', msg: conflicts.length + ' field source conflicts detected' }); }

  if (agent.registrations?.length > 0 || fieldSources.registrations) complianceScore += 3;
  else issues.push({ severity: 'high', category: 'compliance', msg: 'Missing registrations backlink in metadata' });

  if (complianceScore >= 15) strengths.push('High metadata compliance (' + completeness + '%)');
  grade += complianceScore;

  // Engagement (20 points)
  let engagementScore = 0;
  const stars = agent.star_count || 0;
  engagementScore += Math.min(stars * 2, 8);
  if (stars >= 5) strengths.push(stars + ' stars from community');

  const feedbackCount = dims?.engagement?.details?.feedback_count || 0;
  engagementScore += Math.min(feedbackCount * 2, 10);
  if (feedbackCount >= 5) strengths.push(feedbackCount + ' feedback reviews received');
  else recommendations.push('Engage with community to earn feedback');

  if (stars === 0 && feedbackCount === 0) issues.push({ severity: 'medium', category: 'engagement', msg: 'No stars or feedback — agent is invisible to community' });

  grade += engagementScore;

  // Activity (20 points)
  let activityScore = 0;
  const momentum = dims?.momentum?.score || 0;
  activityScore += Math.round(momentum / 5);
  if (momentum >= 50) strengths.push('High recent activity');
  else if (momentum < 20) recommendations.push('Increase on-chain activity to boost momentum');

  grade += activityScore;

  // Overall tier
  let tier, tierEmoji;
  if (grade >= 85) { tier = 'S-Tier'; tierEmoji = '🏆'; }
  else if (grade >= 70) { tier = 'A-Tier'; tierEmoji = '🥇'; }
  else if (grade >= 55) { tier = 'B-Tier'; tierEmoji = '🥈'; }
  else if (grade >= 40) { tier = 'C-Tier'; tierEmoji = '🥉'; }
  else if (grade >= 25) { tier = 'D-Tier'; tierEmoji = '📋'; }
  else { tier = 'F-Tier'; tierEmoji = '⚠️'; }

  return {
    grade, maxGrade: 100, tier, tierEmoji,
    breakdown: { identity: { score: identityScore, max: 15 }, services: { score: serviceScore, max: 25 }, compliance: { score: complianceScore, max: 20 }, engagement: { score: engagementScore, max: 20 }, activity: { score: activityScore, max: 20 } },
    strengths, issues, recommendations
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse query params
  const url = new URL(req.url, 'https://nate-agent-699.vercel.app');
  const chainId = url.searchParams.get('chainId') || '2741';
  const tokenId = url.searchParams.get('tokenId');

  // Rate limiting — 3 free audits per IP per day
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown';
  const usageKey = `audit:${clientIP}:${new Date().toISOString().slice(0, 10)}`;
  
  // Simple in-memory counter (resets on redeploy, good enough for now)
  if (!global._auditUsage) global._auditUsage = {};
  const usage = global._auditUsage[usageKey] || 0;
  const FREE_LIMIT = 3;
  
  if (!tokenId) {
    return res.status(400).json({
      error: 'Missing tokenId parameter',
      usage: '/api/audit?chainId=2741&tokenId=699',
      description: 'Comprehensive ERC-8004 agent audit by Nate the GrAIt #699',
      remaining: Math.max(0, FREE_LIMIT - usage)
    });
  }

  if (usage >= FREE_LIMIT) {
    return res.status(429).json({
      error: 'Daily audit limit reached',
      limit: FREE_LIMIT,
      used: usage,
      message: 'You\'ve used your 3 free audits today. Support the project to get unlimited access.',
      donate: '0x02110ce659ccBa22312235D2295568EB819cA435',
      donateChain: 'Abstract (2741) or any EVM chain',
      resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
    });
  }
  
  // Increment usage
  global._auditUsage[usageKey] = usage + 1;

  try {
    // Fetch agent data
    const agentData = await fetch8004(`public/agents/${chainId}/${tokenId}`);
    if (!agentData.data) return res.status(404).json({ error: 'Agent not found' });
    const agent = agentData.data;
    const dims = agent.scores?.breakdown?.dimensions || {};

    // Probe live endpoints
    const [mcpProbe, a2aProbe] = await Promise.all([
      agent.mcp_server ? probeMCP(agent.mcp_server) : Promise.resolve(null),
      agent.a2a_endpoint ? probeA2A(agent.a2a_endpoint) : Promise.resolve(null)
    ]);

    // Run audit
    const audit = gradeAgent(agent, dims, mcpProbe, a2aProbe);

    const result = {
      audit: {
        agent: { name: agent.name, tokenId: agent.token_id, chainId: agent.chain_id, owner: agent.owner_address },
        ...audit,
        probes: { mcp: mcpProbe, a2a: a2aProbe },
        platformScores: {
          total: agent.total_score,
          dimensions: Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, { score: v.score, weight: v.weight }])),
          metadata_completeness: agent.metadata_completeness_score,
          stars: agent.star_count,
          protocols: agent.supported_protocols
        }
      },
      meta: {
        auditor: 'Nate the GrAIt #699',
        auditorProfile: 'https://8004scan.io/agents/abstract/699',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        auditsRemaining: FREE_LIMIT - (usage + 1),
        note: 'This audit is generated algorithmically. For premium deep audits with AI analysis, contact the agent owner.',
        donate: '0x02110ce659ccBa22312235D2295568EB819cA435'
      }
    };

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
