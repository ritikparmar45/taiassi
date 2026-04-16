const { Groq } = require('groq-sdk');

exports.generateSuggestions = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY || req.headers.authorization?.split(' ')[1];
    const { transcript, customPrompt } = req.body;

    if (!apiKey || apiKey === 'your_groq_api_key_here') return res.status(401).json({ error: 'Groq API Key is required' });
    if (!transcript) return res.status(400).json({ error: 'No transcript provided' });

    const groq = new Groq({ apiKey });
    
    const defaultPrompt = `Based on the following meeting transcript, generate exactly 3 useful, diverse, and actionable suggestions. 
    Types: 
    - 1 Question (to clarify or dive deeper)
    - 1 Talking Point (a specific insight or observation)
    - 1 Action/Answer (a potential next step or solution)
    
    Return the response as a valid JSON array of strings only.
    Example: ["Should we consider X?", "The data shows Y is a bottleneck.", "Let's schedule a follow-up with Z."]`;

    const prompt = customPrompt || defaultPrompt;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional meeting copilot. Respond only with a JSON array of 3 suggestions." },
        { role: "user", content: `${prompt}\n\nTranscript:\n${transcript}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" } // Using JSON mode if supported, or standard if not
    });

    let suggestions;
    try {
      const content = completion.choices[0].message.content;
      const parsed = JSON.parse(content);
      suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions || Object.values(parsed)[0]);
      if (!Array.isArray(suggestions)) suggestions = [content]; // Fallback
    } catch (e) {
      console.error("JSON parse error:", e);
      suggestions = completion.choices[0].message.content.split('\n').filter(s => s.trim()).slice(0, 3);
    }

    res.json({ suggestions: suggestions.slice(0, 3) });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: error.message });
  }
};
