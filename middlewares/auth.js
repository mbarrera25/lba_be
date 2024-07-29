const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Acceso denegado: No se encontró el encabezado de autorización');
  }

  // Quitar el prefijo "Bearer " del token
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Acceso denegado: No se proporcionó el token');
  }

  try {
    // Verificar el token usando la clave secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send('Token expirado');
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(400).send('Token inválido');
    } else {
      return res.status(500).send('Error en el servidor al verificar el token');
    }
  }
};

module.exports = authMiddleware;
