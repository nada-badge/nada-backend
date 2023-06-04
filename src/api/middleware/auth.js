const jwt = require('jsonwebtoken');
const config = require("../../config/config"); 

// JWT 검증 미들웨어
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    // 인증 성공, 요청에 사용될 사용자 정보 저장
    req.user = decoded;
    next();
  });
}

module.exports = {
    verifyToken
}