require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./api-routes/userRoutes');
const logger = require('./utils/logger');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream('./logs/httpserver.log', { flags: 'a' })

mongoose.connect(config.getDbConnectionString())
    .then(() => {
        logger.info('MongoDB Connection established');
    })
    .catch(error => {
        logger.error('MongoDB Connection failed');
        logger.error(error);
    });

const app = express();
app.use(cors())
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/user', userRoutes);

app.listen(process.env.PORT, () =>
    logger.info(`Users-service-app listening on port ${process.env.PORT}`),
);

module.exports = app;