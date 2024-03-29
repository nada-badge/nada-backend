const express = require('express');
const router = require('./api/routes/router');
const connectDB = require('./loader/db');
const config = require('./config/config');
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

app.use(router);

// 서버 시작
app.listen(config.PORT, () => {
  console.log('서버가 시작되었습니다.');
});
