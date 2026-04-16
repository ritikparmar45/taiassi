const { Groq } = require('groq-sdk');

exports.handleChat = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY || req.headers.authorization?.split(' ')[1];
    const { message, transcript, history, customPrompt, stream = false } = req.body;

    if (!apiKey || apiKey === 'your_groq_api_key_here') return res.status(401).json({ error: 'Groq API Key is required' });

    const groq = new Groq({ apiKey });

    const defaultSystemPrompt = "You are TwinMind, a helpful AI meeting copilot. Use the provided meeting transcript and chat history to give insightful, professional, and concise answers.";
    const systemPrompt = customPrompt || defaultSystemPrompt;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: `Current Meeting Transcript Context:\n${transcript || "No transcript yet."}` },
      ...history,
      { role: "user", content: message }
    ];

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const chatStream = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        stream: true,
      });

      for await (const chunk of chatStream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const completion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      res.json({ content: completion.choices[0].message.content });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};
