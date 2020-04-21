const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function(req, res, next) {
  //Define Token
  const token = req.header('x-auth-token');

  //Check existing token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied!' });
  }
  try {
    //Verify Token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(500).json({ msg: 'Invalid Token' });
  }
};
