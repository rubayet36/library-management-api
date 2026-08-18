// middleware/auth.js
const API_KEY = process.env.API_KEY || 'secret123';

function checkApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ success: false, msg: 'Unauthorized' });
  }
  next();
}

module.exports = { checkApiKey };

