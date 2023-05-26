const express = require('express');
const router = require('./api/routes/router');

const app = express();

// JSON 파싱을 위한 미들웨어
app.use(express.json());

app.use("/auth", router);

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 시작되었습니다.');
});
