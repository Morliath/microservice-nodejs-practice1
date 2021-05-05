const axios = require('axios');
const authServer = `http://${process.env.AUTH_SERVER}:${process.env.AUTH_SERVER_PORT}/api/v1/user/token`
const logger = require('./logger');

module.exports = {
  verify: async (req, res, next) => {
    try {

      const authToken = req.headers.authorization;

      logger.info(authToken);

      const response = await axios.post(authServer, {}, { headers: { 'Authorization': authToken } });
      const userData = response.data

      logger.info(`User verified: email: ${userData.email}, userId: ${userData.userId}`)

      req.userData = { email: userData.email, userId: userData.userId };
      next();

    } catch (error) {
      //console.error(error.data.message);
      const message = ( error && error.response && error.response.data ) ? error.response.data.message : '';
      logger.error(message || 'Authentication failed');
      res.status(401).json({ message: message || 'Authentication failed' });
    }
  },
};
