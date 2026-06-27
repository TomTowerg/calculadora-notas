/* Vercel Serverless Function — proxy seguro hacia OpenRouter.
   La API key vive en Variables de Entorno de Vercel (Settings → Environment Variables)
   y nunca se expone al cliente. */

const MODELS = ['google/gemini-2.5-flash-lite', 'openai/gpt-4.1-nano'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY no configurada en Vercel' });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Falta el campo "messages"' });
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://gradiant-notas.vercel.app',
          'X-Title': 'Gradiant',
        },
        body: JSON.stringify({ model, messages, temperature: 0.1 }),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => '');
        throw new Error(`OpenRouter ${response.status}: ${txt.slice(0, 200)}`);
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      lastError = err;
    }
  }

  return res.status(502).json({ error: `Ambos modelos fallaron: ${lastError?.message}` });
}
