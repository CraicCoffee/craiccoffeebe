const express = require('express');
const Flavor = require('../models/Flavor'); // 更改为导入 Brew 模型
const Descriptor = require('../models/Descriptor'); // 更改为导入 Brew 模型
const Taste = require('../models/Taste'); // 更改为导入 Brew 模型
const router = express.Router();

// 获取所有描述词
// router.get('/descriptors', async (req, res) => {
//   try {
//     const descriptors = await Descriptor.find({});
//     res.send(descriptors);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// 获取所有味道
router.get('/tastes', async (req, res) => {
  try {
    const tastes = await Taste.find({});
    res.send(tastes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 获取所有描述词
router.get('/descriptors', async (req, res) => {
  try {
    // 查询所有分类和子分类中的描述词
    const flavors = await Flavor.find({});
    let descriptors = [];
    flavors.forEach(flavor => {
      flavor.categories.forEach(category => {
        descriptors = descriptors.concat(category.descriptors);
        category.subcategories.forEach(subcategory => {
          descriptors = descriptors.concat(subcategory.descriptors);
        });
      });
    });
    // 去重描述词
    descriptors = [...new Set(descriptors.map(descriptor => descriptor.name))];
    res.send(descriptors);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 获取大类风味
router.get('/flavor-categories', async (req, res) => {
  try {
    const categories = await Flavor.aggregate([
      { $unwind: '$categories' },
      { $replaceRoot: { newRoot: '$categories' } },
      { $group: { _id: '$category' } },
      { $sort: { _id: 1 } }
    ]);
    // 提取大类风味的名称
    const categoryNames = categories.map(c => c._id);
    res.send(categoryNames);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 根据大类获取细分风味及其描述词
router.get('/flavors/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log("categoryName", categoryName)
    const flavorCategory = await Flavor.findOne(
      { 'categories.category': categoryName },
      { 'categories.$': 1 }
    );
    if (flavorCategory && flavorCategory.categories.length > 0) {
      // 提取匹配的大类对象
      const category = flavorCategory.categories[0];
      res.send(category);
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/flavors', async (req, res) => {
  try {
    const flavors = await Flavor.find({});
    res.send(flavors);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
