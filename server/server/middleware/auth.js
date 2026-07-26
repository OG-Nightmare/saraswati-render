const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized — no token' });
  }
  const token = auth.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.username) {
      return res.status(401).json({ message: 'Unauthorized — malformed token claims' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized — invalid token' });
  }
};
