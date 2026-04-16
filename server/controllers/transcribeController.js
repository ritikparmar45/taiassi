const { Groq } = require('groq-sdk');
const { Readable } = require('stream');

exports.transcribeAudio = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY || req.headers.authorization?.split(' ')[1];
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return res.status(401).json({ error: 'Groq API Key is required in .env or headers' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const groq = new Groq({ apiKey });

    // Create a readable stream from the memory buffer
    const audioStream = Readable.from(req.file.buffer);
    // Whisper API expects a file-like object with a name
    audioStream.path = 'chunk.webm'; 

    const transcription = await groq.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    res.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
};
