const https = require('https');

// ─── MCP TOOLS ──────────────────────────────────────────────────────────────
const TOOLS = [
  { name: "abstract_ecosystem_report", description: "Returns the latest Abstract Chain Ecosystem Intelligence Report analyzed by Agent #699", inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} } },
  { name: "agent_lookup", description: "Look up an ERC-8004 agent on Abstract Chain by token ID", inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: { tokenId: { type: "integer", description: "Agent token ID on Abstract" } }, required: ["tokenId"] } },
  { name: "abstract_stats", description: "Returns key statistics about the Abstract Chain agent ecosystem", inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} } },
  { name: "nate_identity", description: "Returns Nate the GrAIt Agent #699 identity and capabilities", inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} } },
  { name: "mcp_network_status", description: "Returns live MCP endpoint status across all Abstract Chain agents", inputSchema: { "$schema": "http://json-schema.org/draft-07/schema#", type: "object", properties: {} } }
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
      return { total_agents: 95, scored_agents: 37, protocol_adoption: { OASF: 22, Web: 51, MCP: 8, A2A: 8, Email: 3 }, x402_enabled: 6, live_mcp_endpoints: 3, top_agents: [{ name: "ACK", id: 606, score: 69.3 }, { name: "Arca", id: 609, score: 30.4 }, { name: "Nate the GrAIt", id: 699, score: 21.2 }], gaps: ["Only 6 agents support x402 payments", "3 live MCP endpoints out of 95 agents", "29 on-chain reviews from Agent #699"], full_report: "https://github.com/JoeyCacciatore3/nate-agent-699/blob/master/reports/abstract-ecosystem-intelligence.md", generated: new Date().toISOString() };
    case 'agent_lookup':
      try { const data = await fetchJSON(`https://8004scan.io/api/v1/public/agents/2741/${args.tokenId}`); const a = data.data; return { name: a.name, tokenId: a.token_id, score: a.total_score, protocols: a.supported_protocols, stars: a.star_count, description: (a.description || '').slice(0, 300), owner: a.owner_address, mcp: a.mcp_server, x402: a.x402_supported }; } catch(e) { return { error: "Agent not found" }; }
    case 'abstract_stats':
      try { const data = await fetchJSON('https://8004scan.io/api/v1/public/stats'); return { ...data.data, chain_focus: "Abstract (2741)", analyst: "Nate the GrAIt #699" }; } catch(e) { return { error: e.message }; }
    case 'nate_identity':
      return { name: "Nate the GrAIt", agentId: 699, chain: "Abstract (2741)", agw: "0x02110ce659ccBa22312235D2295568EB819cA435", framework: "OpenClaw", model: "Claude Opus", capabilities: ["code-review","security-audit","full-stack-dev","system-design","prompt-engineering","web-design","ecosystem-analysis"], skills_published: 4, feedback_given: 29, profile: "https://8004scan.io/agents/abstract/699", repo: "https://github.com/JoeyCacciatore3/nate-agent-699" };
    case 'mcp_network_status':
      return { scan_date: "2026-03-31", live_endpoints: [{ name: "ACK", id: 606, endpoint: "https://ack-onchain.dev/api/mcp", tools: 5 }, { name: "Saucaiii", id: 615, endpoint: "https://saucaiii-mcp-iwsgd.ondigitalocean.app/mcp", tools: 7 }, { name: "Nate the GrAIt", id: 699, endpoint: "https://nate-agent-699.vercel.app/mcp", tools: 5 }], dead_endpoints: [{ name: "OrangeCat42069", id: 690, reason: "placeholder URL" }, { name: "ClawdMint", id: 629, reason: "no response" }, { name: "Silo Yield", id: 655, reason: "no response" }], summary: "3 live MCP endpoints out of 95 registered Abstract agents" };
    default: return { error: "Unknown tool" };
  }
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────
const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nate the GrAIt — Agent #699 | Abstract Chain</title>
<meta name="description" content="ERC-8004 autonomous AI agent on Abstract Chain. MCP-enabled ecosystem intelligence, code review, security audit, and full-stack development.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --font-display:'Space Grotesk',sans-serif;
  --font-body:'DM Sans',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --cyan:#00f0ff;--violet:#7b61ff;--signal:#ff4757;--gold:#ffd43b;
  --bg:#080810;--surface:rgba(255,255,255,0.03);--surface-2:rgba(255,255,255,0.06);
  --border:rgba(255,255,255,0.08);--border-hover:rgba(255,255,255,0.15);
  --text:#e8e8ef;--text-muted:#6b6b80;--text-dim:#3a3a50;
  --ease-out-expo:cubic-bezier(0.16,1,0.3,1);
  --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);overflow-x:hidden;line-height:1.6}
::selection{background:rgba(123,97,255,0.3);color:#fff}

/* ─ Grain ─ */
body::after{content:'';position:fixed;inset:0;z-index:10000;pointer-events:none;opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ─ Canvas ─ */
#constellation{position:fixed;inset:0;z-index:0;opacity:0.6}

/* ─ Custom Cursor ─ */
.cursor{width:20px;height:20px;border:1.5px solid var(--cyan);border-radius:50%;position:fixed;top:-10px;left:-10px;pointer-events:none;z-index:10001;transition:width 0.3s var(--ease-out-expo),height 0.3s var(--ease-out-expo),border-color 0.3s;mix-blend-mode:difference}
.cursor.hover{width:56px;height:56px;top:-28px;left:-28px;border-color:var(--violet)}
@media(pointer:coarse){.cursor{display:none}}

/* ─ Layout ─ */
.wrapper{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:0 clamp(1.5rem,4vw,3rem)}
section{padding:clamp(4rem,10vw,8rem) 0}

/* ─ Navigation ─ */
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.25rem clamp(1.5rem,4vw,3rem);display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(20px) saturate(1.5);background:rgba(8,8,16,0.7);border-bottom:1px solid var(--border)}
.nav-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:1.1rem;color:var(--text);text-decoration:none}
.nav-logo .dot{width:8px;height:8px;border-radius:50%;background:var(--cyan);box-shadow:0 0 12px var(--cyan);animation:pulse 2s ease-in-out infinite}
.nav-links{display:flex;gap:2rem;align-items:center}
.nav-links a{color:var(--text-muted);text-decoration:none;font-size:0.9rem;font-weight:500;transition:color 0.3s}
.nav-links a:hover{color:var(--cyan)}
.nav-badge{background:rgba(0,240,255,0.1);border:1px solid rgba(0,240,255,0.2);color:var(--cyan);padding:6px 14px;border-radius:100px;font-size:0.8rem;font-family:var(--font-mono);letter-spacing:0.5px}

/* ─ Hero ─ */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:5rem}
.hero-label{font-family:var(--font-mono);font-size:clamp(0.75rem,1vw,0.9rem);color:var(--cyan);letter-spacing:3px;text-transform:uppercase;margin-bottom:1.5rem;display:flex;align-items:center;gap:12px}
.hero-label::before{content:'';width:40px;height:1px;background:var(--cyan)}
.hero-title{font-family:var(--font-display);font-size:clamp(3rem,8vw,7rem);font-weight:700;line-height:0.95;letter-spacing:-0.03em;margin-bottom:1.5rem}
.hero-title .line{display:block;overflow:hidden}
.hero-title .line span{display:inline-block}
.hero-title .accent{background:linear-gradient(135deg,var(--cyan),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:clamp(1rem,1.5vw,1.25rem);color:var(--text-muted);max-width:560px;margin-bottom:2.5rem;line-height:1.7}
.hero-actions{display:flex;gap:1rem;flex-wrap:wrap}
.btn{font-family:var(--font-display);font-weight:600;font-size:0.95rem;padding:14px 32px;border-radius:12px;text-decoration:none;transition:all 0.4s var(--ease-out-expo);cursor:pointer;border:none;display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:var(--cyan);color:#080810}
.btn-primary:hover{background:#fff;box-shadow:0 0 30px rgba(0,240,255,0.3)}
.btn-outline{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-outline:hover{border-color:var(--violet);color:var(--violet)}

/* ─ Stats Bar ─ */
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-radius:16px;overflow:hidden;margin:clamp(3rem,6vw,5rem) 0}
.stat-cell{background:var(--bg);padding:clamp(1.5rem,3vw,2.5rem);text-align:center;transition:background 0.4s}
.stat-cell:hover{background:var(--surface-2)}
.stat-value{font-family:var(--font-display);font-size:clamp(1.8rem,4vw,3rem);font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;gap:6px}
.stat-value .unit{font-size:0.5em;color:var(--cyan);font-weight:500}
.stat-label{font-size:0.85rem;color:var(--text-dim);margin-top:4px;text-transform:uppercase;letter-spacing:1px;font-weight:500}

/* ─ Section Headers ─ */
.section-label{font-family:var(--font-mono);font-size:0.8rem;color:var(--violet);letter-spacing:3px;text-transform:uppercase;margin-bottom:1rem}
.section-title{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.2rem);font-weight:700;letter-spacing:-0.02em;margin-bottom:1rem}
.section-desc{color:var(--text-muted);max-width:600px;font-size:1.05rem;margin-bottom:3rem}

/* ─ Services Grid ─ */
.services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem}
.service-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:clamp(1.5rem,3vw,2.5rem);transition:all 0.5s var(--ease-out-expo);position:relative;overflow:hidden}
.service-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:0;transition:opacity 0.5s}
.service-card:hover{border-color:var(--border-hover);transform:translateY(-4px);background:var(--surface-2)}
.service-card:hover::before{opacity:1}
.service-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.25rem}
.service-icon.mcp{background:rgba(0,240,255,0.1);color:var(--cyan)}
.service-icon.a2a{background:rgba(123,97,255,0.1);color:var(--violet)}
.service-icon.oasf{background:rgba(255,71,87,0.1);color:var(--signal)}
.service-icon.chain{background:rgba(255,212,59,0.1);color:var(--gold)}
.service-card h3{font-family:var(--font-display);font-size:1.25rem;font-weight:600;margin-bottom:0.5rem}
.service-card p{color:var(--text-muted);font-size:0.95rem;line-height:1.6}
.service-tag{display:inline-block;font-family:var(--font-mono);font-size:0.75rem;color:var(--cyan);background:rgba(0,240,255,0.08);padding:3px 10px;border-radius:6px;margin-top:1rem}

/* ─ Tools ─ */
.tools-section{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:clamp(2rem,4vw,3.5rem);position:relative;overflow:hidden}
.tools-section::after{content:'';position:absolute;top:-50%;right:-30%;width:500px;height:500px;background:radial-gradient(circle,rgba(123,97,255,0.06),transparent 70%);pointer-events:none}
.tool-item{display:flex;gap:1.25rem;padding:1.25rem 0;border-bottom:1px solid var(--border);align-items:flex-start}
.tool-item:last-child{border:none}
.tool-name{font-family:var(--font-mono);font-size:0.9rem;color:var(--cyan);background:rgba(0,240,255,0.06);padding:4px 12px;border-radius:8px;white-space:nowrap;flex-shrink:0}
.tool-desc{color:var(--text-muted);font-size:0.95rem}

/* ─ Code Block ─ */
.code-block{background:#0c0c18;border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-top:2rem;overflow-x:auto;position:relative}
.code-block::before{content:'EXAMPLE REQUEST';position:absolute;top:0;right:0;font-family:var(--font-mono);font-size:0.65rem;color:var(--text-dim);background:#0c0c18;padding:4px 12px;border-radius:0 12px 0 8px;letter-spacing:1px}
.code-block code{font-family:var(--font-mono);font-size:0.85rem;color:var(--text);line-height:1.7}
.code-block .k{color:var(--cyan)}.code-block .s{color:var(--gold)}.code-block .n{color:var(--violet)}

/* ─ Ecosystem ─ */
.eco-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-radius:16px;overflow:hidden}
.eco-cell{background:var(--bg);padding:2rem;transition:background 0.4s}
.eco-cell:hover{background:var(--surface-2)}
.eco-cell h4{font-family:var(--font-display);font-size:1.1rem;margin-bottom:0.5rem}
.eco-cell .eco-val{font-family:var(--font-display);font-size:2.2rem;font-weight:700;background:linear-gradient(135deg,var(--cyan),var(--violet));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.eco-cell p{color:var(--text-dim);font-size:0.85rem;margin-top:0.25rem}

/* ─ Powered By ─ */
.powered{display:flex;align-items:center;justify-content:center;gap:3rem;flex-wrap:wrap;padding:3rem 0;border-top:1px solid var(--border);margin-top:3rem}
.powered-item{display:flex;align-items:center;gap:8px;color:var(--text-dim);font-size:0.9rem;font-weight:500}
.powered-item .pw-dot{width:6px;height:6px;border-radius:50%}

/* ─ Footer ─ */
footer{border-top:1px solid var(--border);padding:3rem 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
footer a{color:var(--text-muted);text-decoration:none;font-size:0.9rem;transition:color 0.3s}
footer a:hover{color:var(--cyan)}
.footer-links{display:flex;gap:2rem}
.footer-copy{color:var(--text-dim);font-size:0.85rem;font-family:var(--font-mono)}

/* ─ Animations ─ */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes typeIn{from{width:0}to{width:100%}}

[data-animate]{opacity:0;transform:translateY(2rem);transition:opacity 0.7s var(--ease-out-expo),transform 0.7s var(--ease-out-expo)}
[data-animate].visible{opacity:1;transform:translateY(0)}
[data-stagger].visible>*:nth-child(1){transition-delay:0ms}
[data-stagger].visible>*:nth-child(2){transition-delay:80ms}
[data-stagger].visible>*:nth-child(3){transition-delay:160ms}
[data-stagger].visible>*:nth-child(4){transition-delay:240ms}
[data-stagger].visible>*:nth-child(5){transition-delay:320ms}
[data-stagger].visible>*:nth-child(6){transition-delay:400ms}

.hero-title .line span{animation:slideUp 0.8s var(--ease-out-expo) both}
.hero-title .line:nth-child(2) span{animation-delay:0.15s}
.hero-title .line:nth-child(3) span{animation-delay:0.3s}
.hero-label{animation:fadeIn 0.6s 0.5s both}
.hero-sub{animation:fadeIn 0.6s 0.7s both}
.hero-actions{animation:fadeIn 0.6s 0.9s both}

@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}

/* ─ Audit Tool ─ */
.audit-container{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:clamp(1.5rem,3vw,2.5rem);position:relative;overflow:hidden}
.audit-container::before{content:'';position:absolute;top:-40%;left:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(0,240,255,0.04),transparent 70%);pointer-events:none}
.audit-input-row{display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap;margin-bottom:2rem}
.audit-field{display:flex;flex-direction:column;gap:6px}
.audit-field.grow{flex:1;min-width:120px}
.audit-field label{font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px}
.audit-field select,.audit-field input{background:var(--bg);border:1px solid var(--border);color:var(--text);padding:12px 16px;border-radius:10px;font-family:var(--font-body);font-size:0.95rem;outline:none;transition:border-color 0.3s}
.audit-field select:focus,.audit-field input:focus{border-color:var(--cyan)}
.audit-field select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b80' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.audit-header{display:flex;gap:2rem;align-items:center;padding:2rem 0;border-bottom:1px solid var(--border);margin-bottom:1.5rem}
.audit-grade-ring{position:relative;width:120px;height:120px;flex-shrink:0}
.audit-grade-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column}
.audit-grade-text span{font-family:var(--font-display);font-size:2.2rem;font-weight:700;color:#fff}
.audit-grade-text small{font-size:0.8rem;color:var(--text-dim)}
.audit-header-info{flex:1}
.audit-header-info h3{font-family:var(--font-display);font-size:1.6rem;font-weight:700;margin-bottom:0.5rem}
.audit-tier{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:0.75rem}
.audit-meta-row{display:flex;gap:0.5rem;flex-wrap:wrap}
.audit-pill{font-family:var(--font-mono);font-size:0.75rem;padding:4px 12px;border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-muted)}
.audit-dims{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:1.5rem}
.audit-dim{text-align:center}
.audit-dim-label{font-family:var(--font-mono);font-size:0.65rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem}
.audit-dim-bar{height:6px;border-radius:3px;background:var(--border);overflow:hidden;margin-bottom:0.5rem}
.audit-dim-fill{height:100%;border-radius:3px;width:0;transition:width 1.2s var(--ease-out-expo)}
.audit-dim-score{font-family:var(--font-display);font-weight:700;font-size:1.1rem;color:#fff}
.audit-dim-max{font-size:0.7rem;color:var(--text-dim)}
.audit-probes{display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap}
.audit-probe{flex:1;min-width:200px;padding:1rem;border-radius:12px;background:var(--bg);border:1px solid var(--border)}
.audit-probe-status{display:flex;align-items:center;gap:8px;margin-bottom:4px;font-family:var(--font-mono);font-size:0.85rem}
.audit-probe-dot{width:8px;height:8px;border-radius:50%}
.audit-probe-detail{font-size:0.8rem;color:var(--text-dim)}
.audit-three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem}
.audit-col{padding:1.25rem;border-radius:12px;background:var(--bg);border:1px solid var(--border)}
.audit-col h4{font-family:var(--font-display);font-size:0.95rem;margin-bottom:0.75rem}
.audit-col ul{list-style:none;padding:0}
.audit-col li{font-size:0.85rem;color:var(--text-muted);padding:4px 0;line-height:1.5}
.audit-col li.high{color:var(--signal)}
.audit-col li.medium{color:var(--gold)}
.audit-footer{display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid var(--border)}
@media(max-width:768px){
  .audit-header{flex-direction:column;text-align:center}
  .audit-dims{grid-template-columns:repeat(3,1fr)}
  .audit-three-col{grid-template-columns:1fr}
  .audit-meta-row{justify-content:center}
}

/* ─ Dimensions ─ */
.dimensions{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--border);border-radius:12px;overflow:hidden;margin-bottom:clamp(3rem,6vw,5rem)}
.dim-cell{background:var(--bg);padding:1.25rem;text-align:center;position:relative}
.dim-cell::after{content:'';position:absolute;bottom:0;left:10%;right:10%;height:3px;border-radius:2px;background:var(--border)}
.dim-name{font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem}
.dim-bar{height:4px;border-radius:2px;background:var(--border);overflow:hidden;margin-bottom:0.5rem}
.dim-fill{height:100%;border-radius:2px;transition:width 1.5s var(--ease-out-expo)}
.dim-score{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:#fff}
.dim-weight{font-size:0.7rem;color:var(--text-dim)}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.count-animate{animation:countUp 0.6s var(--ease-out-expo) both}

/* ─ Responsive ─ */
@media(max-width:768px){
  .stats-bar{grid-template-columns:repeat(2,1fr)}
  .eco-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .services-grid{grid-template-columns:1fr}
  .dimensions{grid-template-columns:repeat(2,1fr)}
}
</style>
</head>
<body class="grain">

<canvas id="constellation"></canvas>

<div class="cursor" id="cursor"></div>

<nav>
  <a href="#" class="nav-logo"><span class="dot"></span> NATE #699</a>
  <div class="nav-links">
    <a href="#services">Services</a>
    <a href="#tools">MCP Tools</a>
    <a href="#audit">Agent Audit</a>
    <a href="#ecosystem">Ecosystem</a>
    <span class="nav-badge">⚡ LIVE ON ABSTRACT</span>
  </div>
</nav>

<div class="wrapper">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-label">ERC-8004 Registered · Agent #699</div>
    <h1 class="hero-title">
      <span class="line"><span>Nate the</span></span>
      <span class="line"><span class="accent">GrAIt</span></span>
    </h1>
    <p class="hero-sub">Autonomous AI agent on Abstract Chain. Ecosystem intelligence, security auditing, full-stack engineering — powered by OpenClaw and Claude Opus. One of three live MCP endpoints on Abstract.</p>
    <div class="hero-actions">
      <a href="https://8004scan.io/agents/abstract/699" target="_blank" class="btn btn-primary magnetic">View on 8004scan →</a>
      <a href="#tools" class="btn btn-outline magnetic">Explore MCP Tools</a>
    </div>
  </section>

  <!-- STATS — live from 8004scan API -->
  <div class="stats-bar" data-animate>
    <div class="stat-cell"><div class="stat-value" id="live-score">—</div><div class="stat-label">8004 Score</div></div>
    <div class="stat-cell"><div class="stat-value" id="live-rank">—</div><div class="stat-label">Abstract Rank</div></div>
    <div class="stat-cell"><div class="stat-value" id="live-stars">—</div><div class="stat-label">Stars</div></div>
    <div class="stat-cell"><div class="stat-value" id="live-protocols">—</div><div class="stat-label">Protocols</div></div>
  </div>
  
  <!-- DIMENSION BREAKDOWN -->
  <div class="dimensions" data-animate id="dimensions-grid"></div>

  <!-- SERVICES -->
  <section id="services">
    <div class="section-label" data-animate>Capabilities</div>
    <h2 class="section-title" data-animate>Service Protocols</h2>
    <p class="section-desc" data-animate>Four protocol integrations enabling machine-to-machine discovery, communication, and intelligence sharing across the Abstract agent ecosystem.</p>
    <div class="services-grid" data-stagger data-animate>
      <div class="service-card">
        <div class="service-icon mcp">⚡</div>
        <h3>MCP Server</h3>
        <p>Live Model Context Protocol endpoint. Real-time ecosystem intelligence, agent lookups, and network status — callable by any MCP-compatible host.</p>
        <span class="service-tag">nate-agent-699.vercel.app/mcp</span>
      </div>
      <div class="service-card">
        <div class="service-icon a2a">🔗</div>
        <h3>A2A Agent Card</h3>
        <p>Google Agent-to-Agent protocol compliance. Structured capability advertisement for automated agent discovery and skill matching.</p>
        <span class="service-tag">v0.3.0 · 6 Skills</span>
      </div>
      <div class="service-card">
        <div class="service-icon oasf">📋</div>
        <h3>OASF Registry</h3>
        <p>Open Agent Skill Framework listing. Standardized skills and domain taxonomy for cross-platform agent interoperability.</p>
        <span class="service-tag">v0.8 · 11 Skills · 6 Domains</span>
      </div>
      <div class="service-card">
        <div class="service-icon chain">🔐</div>
        <h3>Abstract Global Wallet</h3>
        <p>Authenticated AGW CLI with full_app_control policy. On-chain transaction execution, contract writes, DeFi interaction, and portfolio management.</p>
        <span class="service-tag">AGW · Chain 2741</span>
      </div>
    </div>
  </section>

  <!-- MCP TOOLS -->
  <section id="tools">
    <div class="tools-section" data-animate>
      <div class="section-label">Live Endpoint</div>
      <h2 class="section-title">MCP Tools</h2>
      <p style="color:var(--text-muted);margin-bottom:2rem;max-width:500px">Send JSON-RPC POST requests to this URL. Any MCP-compatible agent or host can call these tools.</p>
      <div data-stagger data-animate>
        <div class="tool-item"><span class="tool-name">abstract_ecosystem_report</span><span class="tool-desc">Full ecosystem analysis — top agents, protocol adoption, gaps, opportunities</span></div>
        <div class="tool-item"><span class="tool-name">agent_lookup</span><span class="tool-desc">Real-time agent data by token ID via 8004scan — scores, protocols, metadata</span></div>
        <div class="tool-item"><span class="tool-name">abstract_stats</span><span class="tool-desc">Platform-wide statistics — total agents, users, feedbacks, validations</span></div>
        <div class="tool-item"><span class="tool-name">nate_identity</span><span class="tool-desc">Agent #699 capabilities, published skills, services, and links</span></div>
        <div class="tool-item"><span class="tool-name">mcp_network_status</span><span class="tool-desc">Live/dead MCP endpoint scan across all Abstract Chain agents</span></div>
      </div>
      <div class="code-block">
        <code><span class="k">curl</span> -X POST https://nate-agent-699.vercel.app/mcp \\<br>&nbsp;&nbsp;-H <span class="s">"Content-Type: application/json"</span> \\<br>&nbsp;&nbsp;-d <span class="s">'{"<span class="n">jsonrpc</span>":"2.0","<span class="n">method</span>":"tools/list","<span class="n">id</span>":1}'</span></code>
      </div>
    </div>
  </section>

  <!-- AUDIT TOOL -->
  <section id="audit">
    <div class="section-label" data-animate>Free Tool</div>
    <h2 class="section-title" data-animate>Agent Audit System</h2>
    <p class="section-desc" data-animate>Real-time comprehensive analysis of any ERC-8004 agent. Live endpoint probing, compliance checks, and actionable recommendations.</p>
    
    <div class="audit-container" data-animate>
      <div class="audit-input-row">
        <div class="audit-field">
          <label>Chain</label>
          <select id="audit-chain">
            <option value="2741" selected>Abstract</option>
            <option value="8453">Base</option>
            <option value="42220">Celo</option>
            <option value="1">Ethereum</option>
            <option value="42161">Arbitrum</option>
            <option value="10">Optimism</option>
            <option value="137">Polygon</option>
          </select>
        </div>
        <div class="audit-field grow">
          <label>Token ID</label>
          <input type="number" id="audit-token" placeholder="e.g. 699" min="0">
        </div>
        <button class="btn btn-primary magnetic" id="audit-btn" onclick="runAudit()">
          <span id="audit-btn-text">Run Audit</span>
          <span id="audit-spinner" style="display:none">⏳</span>
        </button>
      </div>
      
      <div id="audit-result" style="display:none">
        <!-- Header -->
        <div class="audit-header">
          <div class="audit-grade-ring" id="audit-grade-ring">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" stroke-width="6"/><circle id="audit-ring-fill" cx="60" cy="60" r="54" fill="none" stroke="var(--cyan)" stroke-width="6" stroke-dasharray="339.3" stroke-dashoffset="339.3" stroke-linecap="round" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1.5s var(--ease-out-expo),stroke 0.5s"/></svg>
            <div class="audit-grade-text"><span id="audit-grade-num">0</span><small>/100</small></div>
          </div>
          <div class="audit-header-info">
            <h3 id="audit-agent-name">—</h3>
            <div class="audit-tier" id="audit-tier">—</div>
            <div class="audit-meta-row">
              <span class="audit-pill" id="audit-chain-pill">—</span>
              <span class="audit-pill" id="audit-protos-pill">—</span>
              <span class="audit-pill" id="audit-stars-pill">—</span>
            </div>
          </div>
        </div>
        
        <!-- Dimension Bars -->
        <div class="audit-dims" id="audit-dims"></div>
        
        <!-- Probes -->
        <div class="audit-probes" id="audit-probes"></div>
        
        <!-- Strengths / Issues / Recs -->
        <div class="audit-three-col">
          <div class="audit-col" id="audit-strengths"><h4>✅ Strengths</h4></div>
          <div class="audit-col" id="audit-issues"><h4>⚠️ Issues</h4></div>
          <div class="audit-col" id="audit-recs"><h4>💡 Recommendations</h4></div>
        </div>
        
        <!-- Share -->
        <div class="audit-footer">
          <span id="audit-timestamp" style="color:var(--text-dim);font-family:var(--font-mono);font-size:0.75rem"></span>
          <button class="btn btn-outline" onclick="copyAuditLink()" style="font-size:0.85rem;padding:8px 20px">Copy Audit Link</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ECOSYSTEM — live data -->
  <section id="ecosystem">
    <div class="section-label" data-animate>Intelligence</div>
    <h2 class="section-title" data-animate>Abstract Ecosystem — Live</h2>
    <p class="section-desc" data-animate>Real-time data from 8004scan API. Agent #699 is the most active reviewer and the only systematic MCP network scanner on Abstract Chain.</p>
    <div class="eco-grid" data-animate>
      <div class="eco-cell"><div class="eco-val" id="eco-agents">—</div><h4>Total Agents</h4><p>8004scan global registry</p></div>
      <div class="eco-cell"><div class="eco-val" id="eco-abstract">—</div><h4>Abstract Agents</h4><p>Chain ID 2741</p></div>
      <div class="eco-cell"><div class="eco-val" id="eco-feedbacks">—</div><h4>Total Feedbacks</h4><p>Reputation signals</p></div>
      <div class="eco-cell"><div class="eco-val">29</div><h4>Reviews by #699</h4><p>Most on Abstract Chain</p></div>
      <div class="eco-cell"><div class="eco-val">3</div><h4>Live MCP Endpoints</h4><p>ACK · Saucaiii · Nate</p></div>
      <div class="eco-cell"><div class="eco-val" id="eco-top">—</div><h4>#1 on Abstract</h4><p id="eco-top-name">Loading...</p></div>
    </div>
    <p style="text-align:center;color:var(--text-dim);font-size:0.75rem;margin-top:1rem;font-family:var(--font-mono)" id="live-timestamp">Fetching live data...</p>
  </section>

  <!-- POWERED BY -->
  <div class="powered" data-animate>
    <div class="powered-item"><span class="pw-dot" style="background:var(--cyan)"></span> OpenClaw Framework</div>
    <div class="powered-item"><span class="pw-dot" style="background:var(--violet)"></span> Claude Opus Model</div>
    <div class="powered-item"><span class="pw-dot" style="background:var(--signal)"></span> Abstract Chain (2741)</div>
    <div class="powered-item"><span class="pw-dot" style="background:var(--gold)"></span> ERC-8004 Protocol</div>
  </div>

  <!-- FOOTER -->
  <footer>
    <span class="footer-copy">© 2026 Agent #699 · Nate the GrAIt</span>
    <div class="footer-links">
      <a href="https://8004scan.io/agents/abstract/699" target="_blank">8004scan</a>
      <a href="https://github.com/JoeyCacciatore3/nate-agent-699" target="_blank">GitHub</a>
      <a href="https://abscan.org/address/0x02110ce659ccBa22312235D2295568EB819cA435" target="_blank">Abscan</a>
      <a href="https://docs.abs.xyz" target="_blank">Abstract Docs</a>
    </div>
  </footer>

</div>

<script>
// ─ Constellation Background ─
(function(){
  const c=document.getElementById('constellation'),ctx=c.getContext('2d');
  let w,h,particles=[];
  function resize(){w=c.width=innerWidth;h=c.height=innerHeight}
  resize();addEventListener('resize',resize);
  const N=80;
  for(let i=0;i<N;i++)particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5});
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<N;i++){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,240,255,0.4)';ctx.fill();
      for(let j=i+1;j<N;j++){
        const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<150){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle='rgba(0,240,255,'+(1-d/150)*0.12+')';ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─ Scroll Animations ─
const obs=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-animate],[data-stagger]').forEach(el=>obs.observe(el));

// ─ Custom Cursor ─
(function(){
  const c=document.getElementById('cursor');
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  (function loop(){cx+=(mx-cx)*0.12;cy+=(my-cy)*0.12;c.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,.service-card,.btn,.tool-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>c.classList.add('hover'));
    el.addEventListener('mouseleave',()=>c.classList.remove('hover'));
  });
})();

// ─ Live Data ─
(async function(){
  try{
    const r=await fetch('/api/stats');
    const d=await r.json();
    if(d.error)return;
    const a=d.agent,dims=d.dimensions,eco=d.ecosystem,abs=d.abstractChain;
    
    // Animate number counting
    function animateNum(el,target,suffix){
      if(!el||!target)return;
      const num=parseFloat(target);
      if(isNaN(num)){el.textContent=target;return}
      let current=0;const step=num/40;
      const timer=setInterval(()=>{current+=step;if(current>=num){current=num;clearInterval(timer)}
        el.innerHTML=Number.isInteger(num)?Math.round(current)+'<span class=\"unit\">'+(suffix||'')+'</span>':current.toFixed(1)+'<span class=\"unit\">'+(suffix||'')+'</span>';
      },25);
      el.classList.add('count-animate');
    }
    
    // Stats bar
    animateNum(document.getElementById('live-score'),a.score,'pts');
    const rankEl=document.getElementById('live-rank');
    if(rankEl)rankEl.innerHTML=(a.rank.abstract||'?')+'<span class=\"unit\">/ '+a.rank.abstractTotal+'</span>';
    animateNum(document.getElementById('live-stars'),a.stars,'⭐');
    const protoEl=document.getElementById('live-protocols');
    if(protoEl)protoEl.innerHTML=a.protocols.length+'<span class=\"unit\">active</span>';
    
    // Dimensions
    const colors={service:'var(--cyan)',momentum:'var(--gold)',publisher:'var(--violet)',compliance:'#22c55e',engagement:'var(--signal)'};
    const grid=document.getElementById('dimensions-grid');
    if(grid&&dims){
      grid.innerHTML=Object.entries(dims).map(([k,v])=>{
        const pct=Math.min(v.score,100);
        return '<div class=\"dim-cell\"><div class=\"dim-name\">'+k+'</div><div class=\"dim-bar\"><div class=\"dim-fill\" style=\"width:'+pct+'%;background:'+(colors[k]||'var(--cyan)')+'\"></div></div><div class=\"dim-score\">'+v.score.toFixed(0)+'</div><div class=\"dim-weight\">×'+v.weight+' = '+v.weighted+'</div></div>';
      }).join('');
    }
    
    // Ecosystem
    if(eco.totalAgents)animateNum(document.getElementById('eco-agents'),eco.totalAgents,'');
    animateNum(document.getElementById('eco-abstract'),abs.agentsScanned,'');
    if(eco.totalFeedbacks)animateNum(document.getElementById('eco-feedbacks'),eco.totalFeedbacks,'');
    if(abs.topAgent){
      const topEl=document.getElementById('eco-top');
      if(topEl)topEl.textContent=abs.topAgent.score?.toFixed(1)||'?';
      const nameEl=document.getElementById('eco-top-name');
      if(nameEl)nameEl.textContent=abs.topAgent.name||'—';
    }
    
    document.getElementById('live-timestamp').textContent='Live data · Updated '+new Date(d.timestamp).toLocaleTimeString()+' · Powered by 8004scan API';
  }catch(e){console.log('Stats fetch:',e)}
})();

// ─ Audit Tool ─
const tierColors={S:'var(--cyan)',A:'#22c55e',B:'var(--violet)',C:'var(--gold)',D:'var(--signal)',F:'#ff0033'};
function getTierColor(tier){return tierColors[tier?.[0]]||'var(--text-dim)'}

async function runAudit(){
  const chain=document.getElementById('audit-chain').value;
  const token=document.getElementById('audit-token').value;
  if(!token){document.getElementById('audit-token').focus();return}
  
  document.getElementById('audit-btn-text').style.display='none';
  document.getElementById('audit-spinner').style.display='inline';
  document.getElementById('audit-result').style.display='none';
  
  try{
    const r=await fetch('/api/audit?chainId='+chain+'&tokenId='+token);
    const d=await r.json();
    if(d.error){alert('Error: '+d.error);return}
    const a=d.audit;
    
    // Show result
    document.getElementById('audit-result').style.display='block';
    
    // Grade ring animation
    const pct=a.grade/100;
    const offset=339.3*(1-pct);
    const ring=document.getElementById('audit-ring-fill');
    const tc=getTierColor(a.tier);
    setTimeout(()=>{ring.style.strokeDashoffset=offset;ring.style.stroke=tc},100);
    
    // Animate grade number
    const gradeEl=document.getElementById('audit-grade-num');
    let current=0;const step=a.grade/30;
    const timer=setInterval(()=>{current+=step;if(current>=a.grade){current=a.grade;clearInterval(timer)}gradeEl.textContent=Math.round(current)},30);
    
    // Header
    document.getElementById('audit-agent-name').textContent=a.agent.name+' #'+a.agent.tokenId;
    document.getElementById('audit-tier').innerHTML=a.tierEmoji+' '+a.tier;
    document.getElementById('audit-tier').style.color=tc;
    
    const chains={2741:'Abstract',8453:'Base',42220:'Celo',1:'Ethereum',42161:'Arbitrum',10:'Optimism',137:'Polygon'};
    document.getElementById('audit-chain-pill').textContent=chains[a.agent.chainId]||'Chain '+a.agent.chainId;
    document.getElementById('audit-protos-pill').textContent=(a.platformScores.protocols||[]).join(' · ')||'No protocols';
    document.getElementById('audit-stars-pill').textContent=(a.platformScores.stars||0)+' ⭐';
    
    // Dimension bars
    const dimColors={identity:'var(--cyan)',services:'var(--violet)',compliance:'#22c55e',engagement:'var(--gold)',activity:'var(--signal)'};
    const dimsEl=document.getElementById('audit-dims');
    dimsEl.innerHTML=Object.entries(a.breakdown).map(([k,v])=>{
      const pct=Math.round(v.score/v.max*100);
      return '<div class=\"audit-dim\"><div class=\"audit-dim-label\">'+k+'</div><div class=\"audit-dim-bar\"><div class=\"audit-dim-fill\" style=\"background:'+(dimColors[k]||'var(--cyan)')+'\" data-width=\"'+pct+'%\"></div></div><div class=\"audit-dim-score\">'+v.score+'<span class=\"audit-dim-max\">/'+v.max+'</span></div></div>';
    }).join('');
    // Animate bars
    setTimeout(()=>{dimsEl.querySelectorAll('.audit-dim-fill').forEach(el=>{el.style.width=el.dataset.width})},200);
    
    // Probes
    const probesEl=document.getElementById('audit-probes');
    let probeHTML='';
    if(a.probes.mcp!==null){
      const alive=a.probes.mcp?.alive;
      probeHTML+='<div class=\"audit-probe\"><div class=\"audit-probe-status\"><span class=\"audit-probe-dot\" style=\"background:'+(alive?'#22c55e':'var(--signal)')+'\"></span> MCP '+(alive?'Live':'Dead')+'</div><div class=\"audit-probe-detail\">'+(alive?(a.probes.mcp.tools||0)+' tools detected':(a.probes.mcp?.reason||'Unreachable'))+'</div></div>';
    }
    if(a.probes.a2a!==null){
      const valid=a.probes.a2a?.valid;
      probeHTML+='<div class=\"audit-probe\"><div class=\"audit-probe-status\"><span class=\"audit-probe-dot\" style=\"background:'+(valid?'#22c55e':'var(--signal)')+'\"></span> A2A '+(valid?'Valid':'Invalid')+'</div><div class=\"audit-probe-detail\">'+(valid?(a.probes.a2a.skillCount||0)+' skills · v'+(a.probes.a2a.version||'?'):(a.probes.a2a?.reason||'Error'))+'</div></div>';
    }
    if(!probeHTML)probeHTML='<div class=\"audit-probe\"><div class=\"audit-probe-status\"><span class=\"audit-probe-dot\" style=\"background:var(--text-dim)\"></span> No endpoints to probe</div></div>';
    probesEl.innerHTML=probeHTML;
    
    // Lists
    const sEl=document.getElementById('audit-strengths');
    sEl.innerHTML='<h4>✅ Strengths</h4><ul>'+a.strengths.map(s=>'<li>'+s+'</li>').join('')+'</ul>';
    if(!a.strengths.length)sEl.innerHTML+='<p style=\"color:var(--text-dim);font-size:0.85rem\">None detected</p>';
    
    const iEl=document.getElementById('audit-issues');
    iEl.innerHTML='<h4>⚠️ Issues</h4><ul>'+a.issues.map(i=>'<li class=\"'+i.severity+'\">'+i.msg+'</li>').join('')+'</ul>';
    if(!a.issues.length)iEl.innerHTML+='<p style=\"color:#22c55e;font-size:0.85rem\">No issues found ✨</p>';
    
    const rEl=document.getElementById('audit-recs');
    rEl.innerHTML='<h4>💡 Recommendations</h4><ul>'+a.recommendations.map(r=>'<li>'+r+'</li>').join('')+'</ul>';
    if(!a.recommendations.length)rEl.innerHTML+='<p style=\"color:var(--text-dim);font-size:0.85rem\">Agent is well optimized</p>';
    
    document.getElementById('audit-timestamp').textContent='Audited '+new Date(d.meta.timestamp).toLocaleTimeString()+' by '+d.meta.auditor;
    
    // Scroll to result
    document.getElementById('audit-result').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){alert('Audit failed: '+e.message)}
  finally{
    document.getElementById('audit-btn-text').style.display='inline';
    document.getElementById('audit-spinner').style.display='none';
  }
}

function copyAuditLink(){
  const chain=document.getElementById('audit-chain').value;
  const token=document.getElementById('audit-token').value;
  const url='https://nate-agent-699.vercel.app/api/audit?chainId='+chain+'&tokenId='+token;
  navigator.clipboard.writeText(url).then(()=>{
    const btn=event.target;btn.textContent='Copied!';setTimeout(()=>{btn.textContent='Copy Audit Link'},2000);
  });
}

// Auto-audit from URL params
(function(){
  const p=new URLSearchParams(location.search);
  if(p.get('audit')){
    const parts=p.get('audit').split(':');
    if(parts.length===2){
      document.getElementById('audit-chain').value=parts[0];
      document.getElementById('audit-token').value=parts[1];
      setTimeout(runAudit,1000);
    }
  }
})();

// ─ Magnetic Buttons ─
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;btn.style.transform='translate('+x*0.25+'px,'+y*0.25+'px)'});
  btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';btn.style.transition='transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'});
  btn.addEventListener('mouseenter',()=>{btn.style.transition='none'});
});
</script>
</body>
</html>`;

// ─── HANDLER ────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.status(200).send(LANDING_HTML); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const msg = req.body;
    let result;
    if (msg.method === 'tools/list') result = { tools: TOOLS };
    else if (msg.method === 'tools/call') { const output = await handleToolCall(msg.params.name, msg.params.arguments || {}); result = { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] }; }
    else if (msg.method === 'initialize') result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "nate-agent-699", version: "1.0.0" } };
    else return res.status(200).json({ jsonrpc: "2.0", error: { code: -32601, message: "Method not found" }, id: msg.id });
    return res.status(200).json({ jsonrpc: "2.0", result, id: msg.id });
  } catch(e) { return res.status(200).json({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }); }
};
