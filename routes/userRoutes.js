const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');  // 引入multer中间件处理文件上传
const bcrypt = require('bcryptjs');

// 注册新用户
router.post('/v0/auth/register', async (req, res) => {
  try {
    console.log(req.body)
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      success: true,
      message: 'Register successful',
      user,
      token });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || 'An error occurred'
    });
  }
});

// 用户登录
router.post('/v0/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("user", user)
    if (!user || !(await user.isPasswordMatch(password))) {
      return res.status(400).send({
        success: false,
        message: 'Invalid login credentials'
      });
    }
    const token = await user.generateAuthToken();
    res.send({
      success: true,
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || 'An error occurred'
    });
  }
});

// 获取当前用户信息
router.get('/v0/auth/current', auth, async (req, res) => {
  // Auth middleware adds the user to the request object
  if (req.user) {
    // 将用户信息封装在 data 字段内发送
    res.send({ data: req.user });
  } else {
    // 如果没有用户信息，则发送错误响应
    res.status(404).send({ message: 'User not found' });
  }
});

// 用户登出
router.post('/v0/auth/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// 列出所有用户
router.get('/v0/users', /* auth, */ async (req, res) => {
  try {
    const users = await User.find({}, '-tokens'); // 选择排除密码和令牌字段
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');  // 设置文件存储位置
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // 设置文件名
  }
});

const upload = multer({ storage: storage });

// 更新用户设置，包括文件上传
router.patch('/v0/user/settings', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const updates = req.body;
    const allowedUpdates = ['email', 'nickname', 'bio', 'country', 'province', 'city', 'address', 'phone', 'occupations', 'skills'];
    const updateFields = Object.keys(updates);

    // 检查更新的字段是否都在允许的更新列表中
    const isValidOperation = updateFields.every((field) => allowedUpdates.includes(field));

    if (!isValidOperation) {
      return res.status(400).send({ message: 'Invalid updates!' });
    }

    // 应用那些实际传递的字段更新
    updateFields.forEach((field) => {
      if (field === 'skills') {
        // 确保技能字段是字符串形式的JSON，然后解析
        try {
          user[field] = JSON.parse(updates[field]);
        } catch (e) {
          return res.status(400).send({ message: 'Invalid format for skills' });
        }
      } else if (field === 'occupations') {
        // 确保职业字段是逗号分隔的字符串，然后转换为数组
        user[field] = updates[field].split(',');
      } else {
        user[field] = updates[field];
      }
    });

    // 如果有文件被上传，更新头像字段
    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/v0/user/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 验证新密码的复杂度（这里仅作为示例，实际应用中请根据需要进行复杂性校验）
    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码长度至少为6个字符。' });
    }
    // 从数据库中找到当前用户
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '用户未找到。' });
    }

    if (!(await user.isPasswordMatch(oldPassword))) {
      return res.status(400).json({ message: '旧密码不正确。' });
    }

    // 加密新密码
    // const salt = await bcrypt.genSalt(8);
    // const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newPassword;

    // 更新数据库中的密码
    await user.save();
    res.status(200).json({ message: '密码修改成功。' });
  } catch (error) {
    console.error(error); // 输出错误到控制台
    res.status(500).json({ message: '服务器错误。', error: error.message });
  }
});

module.exports = router;
