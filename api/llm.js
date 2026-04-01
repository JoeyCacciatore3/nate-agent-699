// LLM provider abstraction — Groq primary, Gemini fallback
const https = require('https');

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

function postJSON(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({ hostname, path, method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, (res) => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(chunks) }); }
        catch (e) { reject(new Error('Invalid JSON: ' + chunks.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(data);
    req.end();
  });
}

async function callGroq(systemPrompt, userMessage, model = 'llama-3.1-70b-versatile') {
  if (!GROQ_KEY) throw new Error('No Groq API key');
  const res = await postJSON('api.groq.com', '/openai/v1/chat/completions', {
    'Authorization': `Bearer ${GROQ_KEY}`
  }, {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 1024
  });
  if (res.status !== 200) throw new Error(`Groq ${res.status}: ${JSON.stringify(res.data)}`);
  return res.data.choices[0].message.content;
}

async function callGemini(systemPrompt, userMessage) {
  if (!GEMINI_KEY) throw new Error('No Gemini API key');
  const res = await postJSON('generativelanguage.googleapis.com', `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {}, {
    contents: [{ parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
  });
  if (res.status !== 200) throw new Error(`Gemini ${res.status}: ${JSON.stringify(res.data)}`);
  return res.data.candidates[0].content.parts[0].text;
}

async function chat(systemPrompt, userMessage) {
  // Try Groq first (fast), fall back to Gemini
  try {
    return { text: await callGroq(systemPrompt, userMessage), provider: 'groq' };
  } catch (groqErr) {
    try {
      return { text: await callGemini(systemPrompt, userMessage), provider: 'gemini' };
    } catch (geminiErr) {
      return { text: null, provider: null, error: `Groq: ${groqErr.message}; Gemini: ${geminiErr.message}` };
    }
  }
}

async function healthCheck() {
  const results = { groq: false, gemini: false };
  try {
    await callGroq('Reply with OK', 'ping', 'llama-3.1-8b-instant');
    results.groq = true;
  } catch (e) { results.groqError = e.message; }
  try {
    await callGemini('Reply with OK', 'ping');
    results.gemini = true;
  } catch (e) { results.geminiError = e.message; }
  return results;
}

module.exports = { chat, callGroq, callGemini, healthCheck };
