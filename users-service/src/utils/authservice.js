const jwt = require('jsonwebtoken');
const logger = require('./logger');

const expiration = process.env.TOKEN_EXPIRATION * 60;
const JWT_KEY = process.env.JWT_KEY || 'ABCDEFG123456789'

module.exports = {
  verify: (token) => {
    try {
      const decodedToken = jwt.verify(token, JWT_KEY);
      logger.info(`Valid token email: ${decodedToken.email}, userId: ${decodedToken.userId} `);
      return { email: decodedToken.email, userId: decodedToken.userId };
    } catch (error) {
      logger.error('Authentication fail');
      logger.error(error);
      throw `Authentication failed, ${error}`;
    }
  },
  getToken: (email, userId) => {
    if(!email || !userId){
      throw 'Invalid credentials';
    }
    logger.info('Login: ' + email + '|' + userId);

    const token = jwt.sign({ email: email, userId: userId },
      JWT_KEY,
      { expiresIn: '' + (expiration * 1000) }
    );
    return { token: token, expiresIn: expiration * 1000 }
  }
};
