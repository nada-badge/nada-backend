const express = require('express');
const router = require('./api/routes/router');
const connectDB = require('./loader/db');
const config = require('./config/config');
const { logger, combined } = require('./config/logger');
const morgan = require('morgan');
const cors = require('cors');

let corsOptions = {
    origin: '*',
    credentials: true,
}

connectDB();

const app = express();

app.use(cors(corsOptions));

// JSON 파싱을 위한 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan(combined, {stream: logger.stream}));

app.use(router);

// 서버 시작
app.listen(config.PORT, () => {
    logger.info(`Listening on port ${config.PORT}...`);
});
