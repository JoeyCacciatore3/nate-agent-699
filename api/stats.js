// Live stats API — proxies 8004scan with our API key (never exposed to client)
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Fetch our agent data
    const agentData = await fetch8004('public/agents/2741/699');
    const agent = agentData.data;

    // Fetch Abstract leaderboard to find our rank
    const leaderboard = await fetch8004('agents?chainId=2741&sortBy=total_score&sortOrder=desc&limit=100&isTestnet=false');
    const abstractAgents = leaderboard.items || leaderboard.data || [];
    const ourRank = abstractAgents.findIndex(a => a.token_id === 699 || a.token_id === '699') + 1;
    const totalAbstract = abstractAgents.length;

    // Fetch global stats
    const stats = await fetch8004('public/stats');

    // Score breakdown
    const dims = agent.scores?.breakdown?.dimensions || {};
    const calcScore = Object.values(dims).reduce((sum, d) => sum + (d.score * d.weight), 0);

    const result = {
      agent: {
        name: agent.name,
        tokenId: agent.token_id,
        score: calcScore.toFixed(1),
        displayScore: agent.total_score,
        stars: agent.star_count,
        watches: agent.watch_count,
        protocols: agent.supported_protocols,
        rank: {
          abstract: ourRank || 'unranked',
          abstractTotal: totalAbstract,
          global: agent.scores?.rank || null
        },
        metadata_completeness: agent.metadata_completeness_score,
        mcp: agent.mcp_server,
        image: agent.image_url
      },
      dimensions: Object.fromEntries(
        Object.entries(dims).map(([k, v]) => [k, {
          score: v.score,
          weight: v.weight,
          weighted: (v.score * v.weight).toFixed(2)
        }])
      ),
      ecosystem: {
        totalAgents: stats?.data?.data?.total_agents || stats?.data?.total_agents || null,
        totalFeedbacks: stats?.data?.data?.total_feedbacks || stats?.data?.total_feedbacks || null,
        totalUsers: stats?.data?.data?.total_users || stats?.data?.total_users || null,
      },
      abstractChain: {
        agentsScanned: totalAbstract,
        topAgent: abstractAgents[0] ? { name: abstractAgents[0].name, score: abstractAgents[0].total_score } : null,
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
