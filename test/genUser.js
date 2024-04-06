const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 确保路径正确

// 替换为你的MongoDB连接字符串
const mongoURI = 'mongodb://localhost/coffeeDB';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const createUser = async () => {
  const hashedPassword = await bcrypt.hash('your_password', 8); // 替换 'your_password' 为你想要的密码

  const user = new User({
    email: 'admin@admin.com',
    phone: '1234567890',
    password: hashedPassword
  });

  try {
    await user.save();
    console.log('User created:', user);
  } catch (err) {
    console.error('Error creating user:', err);
  }

  mongoose.disconnect();
};

createUser();
