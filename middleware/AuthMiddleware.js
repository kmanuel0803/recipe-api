
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

    // IF no auth headers are provided
    // THEN return 401 Unauthorized error
    if (!authHeader) {
        return res.status(401).json({
          status: false,
          error: {
            message: 'Auth headers not provided in the request.'
          }
        });
      }

    // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    if (!authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Invalid auth mechanism.'
        }
      });
    }

    const token = authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({
            status: false,
            error: {
            message: 'Bearer token missing in the authorization headers.'
            }
        })
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
              status: false,
              error: 'Token has expired, please login again.'
            });
          }
          if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({
              status: false,
              error: 'Invalid token, please login again.'
            });
          }
          return res.status(403).json({
            status: false,
            error: 'Invalid access token provided, please login again.'
          });
        }
      
        req.user = user; // Save the user object for further use
        next();
      });
}

module.exports = authMiddleware;
