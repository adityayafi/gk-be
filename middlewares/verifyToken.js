const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';
// const dotenv = require('dotenv');
// dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if(err) return res.sendStatus(403);
    req.user = {
      id: decoded.id,
      fullname: decoded.fullname,
      email: decoded.email,
      role: decoded.role,
    }
    next();
  })
}

module.exports = verifyToken