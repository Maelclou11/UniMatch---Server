const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Utilisez le même secret que lors de la création du token
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
