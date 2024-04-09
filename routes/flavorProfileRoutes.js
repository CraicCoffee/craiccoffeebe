const express = require('express');
const FlavorProfile = require('../models/FlavorProfile'); // 确保导入模型的路径正确
const Brew = require('../models/Brew'); // 更改为导入 Brew 模型
const router = express.Router();

// 创建风味描述
router.post('/', async (req, res) => {
  try {
    const { brewId, highTempDescriptors, midTempDescriptors, lowTempDescriptors } = req.body;

    let flavorProfile = await FlavorProfile.findOne({ brew: brewId });
    if (flavorProfile) {
      // 如果已经存在，更新它
      flavorProfile.highTempDescriptors = highTempDescriptors;
      flavorProfile.midTempDescriptors = midTempDescriptors;
      flavorProfile.lowTempDescriptors = lowTempDescriptors;
    } else {
      // 如果不存在，创建一个新的
      flavorProfile = new FlavorProfile({
        highTempDescriptors,
        midTempDescriptors,
        lowTempDescriptors,
        brew: brewId
      });
    }

    await flavorProfile.save();
    // 更新 Brew，关联 FlavorProfile
    await Brew.findByIdAndUpdate(brewId, { $set: { flavorProfile: flavorProfile._id } }, { new: true });

    res.status(201).send(flavorProfile);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// 获取风味描述
router.get('/:brewId', async (req, res) => {
  try {
    // 使用 findOne() 方法通过 brew 字段查找匹配的 FlavorProfile
    const flavorProfile = await FlavorProfile.findOne({ brew: req.params.brewId })
      .select('highTempDescriptors midTempDescriptors lowTempDescriptors brew');

    if (!flavorProfile) {
      return res.status(404).send();
    }

    // 创建一个要返回的对象，仅包含需要的信息
    const response = {
      highTempDescriptors: flavorProfile.highTempDescriptors,
      midTempDescriptors: flavorProfile.midTempDescriptors,
      lowTempDescriptors: flavorProfile.lowTempDescriptors,
      brewId: flavorProfile.brew // 假设 brew 字段直接存储了 brewId
    };

    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 更新风味描述
router.patch('/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['highTempDescriptors', 'midTempDescriptors', 'lowTempDescriptors'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const flavorProfile = await FlavorProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!flavorProfile) {
      return res.status(404).send();
    }

    res.send(flavorProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 删除风味描述
router.delete('/:id', async (req, res) => {
  try {
    const flavorProfile = await FlavorProfile.findByIdAndDelete(req.params.id);

    if (!flavorProfile) {
      return res.status(404).send();
    }

    // 确保同时更新 Brew，解除与 FlavorProfile 的关联
    await Brew.findByIdAndUpdate(flavorProfile.brew, { flavorProfile: null }); // 更改为更新 Brew 文档

    res.send(flavorProfile);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
