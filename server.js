// server.js
const express = require('express');
const { checkApiKey } = require('./middleware/auth');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;


app.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'API running' });
});


app.use('/api/books', checkApiKey, require('./routes/books'));


app.use((req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});

// ---- global error handler (put LAST) ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, msg: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
