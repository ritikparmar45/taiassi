const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const transcribeRoutes = require('./routes/transcribe');
const suggestRoutes = require('./routes/suggest');
const chatRoutes = require('./routes/chat');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/suggest', suggestRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
