const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied: ${requiredRole} role required` });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = verifyToken;