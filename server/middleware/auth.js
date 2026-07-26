import jwt from 'jsonwebtoken';
const { verify } = jwt;

/**
 * Hono middleware that validates a Bearer JWT token in the Authorization header.
 * On success, stores the decoded payload in context as 'admin'.
 */
const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized — no token' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = verify(token, secret);
    if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.username) {
      return c.json({ message: 'Unauthorized — malformed token claims' }, 401);
    }
    c.set('admin', decoded);
    await next();
  } catch (_) {
    return c.json({ message: 'Unauthorized — invalid token' }, 401);
  }
};

export default authMiddleware;
