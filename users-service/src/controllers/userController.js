const bcrypt = require('bcryptjs');
const authService = require('../utils/authservice');
const logger = require('../utils/logger');

const User = require('../models/User');

exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  logger.info(`Process create request for email:${email}`)
  bcrypt.hash(String(password), 10)
    .then(hash => {
      const user = new User({
        email: email,
        password: hash
      });

      user.save()
        .then(result => {
          logger.info(`User ${email} created successfully`)
          res.status(201).json({
            message: 'User created'
          });
        })
        .catch(err => {
          logger.error(`User ${email} creation failed`);
          logger.error(err.message);
          res.status(400).json({
            message: err.message
          });
        });
    });
}

exports.readUser = (req, res, next) => {
  const { email } = req.params;
  let userFound;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        logger.error(`User ${email} not found`);
        res.status(404).json({ message: 'User not found' });
        throw 'User not found';
      }
      userFound = user;
      logger.info(`User: ${email} data found`);
      res.status(200).json({
        email: userFound.email,
        userID: userFound._id
      });
    }).catch(err => {
      logger.error(err.message || err);
    });
}

exports.updateUser = (req, res, next) => {
  const { email, password } = req.body;
  let userFound;
  logger.info(`Process update request for email:${email}`)

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        logger.error(`User ${email} not found`);
        res.status(404).json({ message: 'User not found' });
        throw 'User not found';
      }
      userFound = user;
      logger.info(`User: ${email} data found`);

      bcrypt.hash(String(password), 10)
        .then(hash => {
          userFound.password = hash;

          userFound.save()
            .then(result => {
              logger.info(`User ${email} updated successfully`)
              res.status(202).json({
                message: 'User updated successfully'
              });
            })
            .catch(err => {
              logger.error(`User ${email} update failed`);
              logger.error(err.message);
              res.status(500).json({
                message: err.message
              });
            });
        })

    }).catch(err => {
      logger.error(err.message || err);
    });
}

exports.deleteUser = (req, res, next) => {
  const { email } = req.params;
  User.findOneAndDelete({ email: email }, (err, doc) => {
    if (!doc || err) {
      logger.error(`User ${email} error on delete`)
      res.status(404).json({
        message: `User ${email} not found`
      });
    } else {
      logger.info(`User ${email} deleted successfully`)
      res.status(202).json({
        message: 'User deleted successfully'
      });
    }
  })
}

exports.userLogin = (req, res, next) => {
  const { email, password } = req.body;
  let userFound;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        logger.error(`User ${email} not found`);
        res.status(404).json({ message: 'User not found' });
        throw 'User not found';
      }
      userFound = user;
      logger.info(`User: ${email} data found`);
      return bcrypt.compare(String(password), userFound.password);
    })
    .then(result => {
      if (!result) {
        logger.error(`Invalid password for ${email}`)
        res.status(401).json({ message: 'Authentication fail' });
        throw 'Authentication fail';
      }

      const tokenData = authService.getToken(userFound.email, userFound._id)
      logger.info(`User: ${email} correct password`);

      res.status(200).json({
        token: tokenData.token,
        expiresIn: tokenData.expiresIn,
        userID: userFound._id
      });
    })
    .catch(err => {
      logger.error(err.message || err);
    });
}

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const result = authService.verify(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error });
  }
}