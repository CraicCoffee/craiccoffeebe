const mongoose = require('mongoose');

// 描述符的Schema
const descriptorSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// 子分类的Schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  descriptors: [descriptorSchema] // 使用描述符Schema
});

// 主分类的Schema，它可以有一个子分类数组，或直接有描述符数组
const categorySchema = new mongoose.Schema({
  category: { type: String, required: true }, // 大类风味
  subcategories: [subCategorySchema], // 细分风味的数组（如果有子分类）
  descriptors: [descriptorSchema] // 直接的描述符数组（如果没有子分类）
});

// 风味的Schema，包括多个大类
const flavorSchema = new mongoose.Schema({
  categories: [categorySchema] // 风味的大类数组
});

const Flavor = mongoose.model('Flavor', flavorSchema);

module.exports = Flavor;
