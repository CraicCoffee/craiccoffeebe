require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure jwt is required if not already

const userSchema = new mongoose.Schema({
  // 用户验证信息
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],

  // 用户基础信息
  nickname: String,
  bio: String,
  country: String,
  province: String,
  city: String,
  address: String,
  occupations: [{ type: String }],  // 职业字段，数组类型用于存储多个职业
  skills: [{ skillName: String, level: String }],  // 技能字段，数组类型，包含技能名称和等级
  avatar: String,  // 头像图片的URL或图片数据
});

userSchema.pre('save', async function (next) {
  // 只有当密码被修改，并且不是散列值时，才进行散列
  if (this.isModified('password') && !this.password.startsWith('$2b$')) {
    console.log("hashing password", this.password);
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  const user = this;
  const result = await bcrypt.compare(enteredPassword, user.password);
  console.log("isPasswordMatch:", result);
  console.log("enteredPassword", enteredPassword);
  console.log("user.password", user.password);
  return result;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
