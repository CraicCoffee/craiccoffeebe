const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const brewRoutes = require('./routes/brewRoutes');
const brewRatingRoutes = require('./routes/brewRatingRoutes'); // 引入 BrewRating 路由
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 引入路由表
app.use('/api', brewRoutes);
app.use('/api', brewRatingRoutes);

// 连接到 MongoDB
mongoose.connect('mongodb://localhost/coffeeDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
