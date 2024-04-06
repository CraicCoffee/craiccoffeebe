require('dotenv').config();

// 然后导入其他依赖
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// 引入你的路由
const brewRoutes = require('./routes/brewRoutes');
const brewRatingRoutes = require('./routes/brewRatingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 引入路由表
app.use('/api', brewRoutes);
app.use('/api', brewRatingRoutes);
app.use('/api', userRoutes);

// 连接到 MongoDB，使用环境变量
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 使用环境变量定义端口
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
