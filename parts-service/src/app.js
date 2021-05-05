require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const partRoutes = require('./api-routes/partRoutes');
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

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("./images")));

app.use('/api/v1/part', partRoutes);

app.listen(process.env.PORT, () =>
    logger.info(`Parts-service-app listening on port ${process.env.PORT}`),
);