const express = require('express');
const router = express.Router();
const BrewRating = require('../models/brewRating'); // 引入你的 BrewRating 模型
const Brew = require('../models/Brew');

// GET route to retrieve all brew ratings
router.get('/brew-ratings', async (req, res) => {
  try {
    // 只选择 '_id' 字段
    const brewRatings = await BrewRating.find().select('brew _id');
    res.status(200).json(brewRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to create a new brew rating associated with a brew._id
router.post('/brew-ratings', async (req, res) => {
  try {
    const {
      brewId,  // Assuming the client will send a brewId
      acidityQuality,
      sweetnessQuality,
      flavorQuality,
      acidityIntensity,
      sweetnessIntensity,
      bitternessIntensity,
      flavorIntensity,
      mouthfeel,
      aftertaste,
      richness
    } = req.body;

    console.log(`Request body: ${JSON.stringify(req.body)}`); // 确保请求体被正确解析并打印
    console.log(`Brew ID from request: ${brewId}`); // 现在应该能够正确打印出 brewId

    // 检查 brewId 是否对应于现有的 Brew
    const brewExists = await Brew.findById(brewId); // 确保 Brew 模型已经正确导入
    console.log(`brewExists: ${brewExists}`);

    if (!brewExists) {
      return res.status(404).json({message: 'Brew not found'});
    }

    const newBrewRating = new BrewRating({
      brew: brewId,
      acidityQuality,
      sweetnessQuality,
      flavorQuality,
      acidityIntensity,
      sweetnessIntensity,
      bitternessIntensity,
      flavorIntensity,
      mouthfeel,
      aftertaste,
      richness
    });

    const savedBrewRating = await newBrewRating.save();
    res.status(201).json(savedBrewRating);
  } catch (error) {
    console.error(error); // 这会打印完整的错误堆栈
    res.status(500).json({message: error.message});
  }
});

// GET route to retrieve a brew rating by brew._id
router.get('/brew-ratings/:brewId', async (req, res) => {
  try {
    const {brewId} = req.params;
    const brewRating = await BrewRating.findOne({brew: brewId});
    console.log(`BrewRating: ${brewRating}`)
    if (brewRating) {
      res.status(200).json(brewRating);
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// PUT route to update a brew rating by brew._id
router.put('/brew-ratings/:brewId', async (req, res) => {
  try {
    const {brewId} = req.params;
    const {
      acidityQuality,
      sweetnessQuality,
      flavorQuality,
      acidityIntensity,
      sweetnessIntensity,
      bitternessIntensity,
      flavorIntensity,
      mouthfeel,
      aftertaste,
      richness
    } = req.body;

    const updatedBrewRating = await BrewRating.findOneAndUpdate(
      {brew: brewId},
      {
        acidityQuality,
        sweetnessQuality,
        flavorQuality,
        acidityIntensity,
        sweetnessIntensity,
        bitternessIntensity,
        flavorIntensity,
        mouthfeel,
        aftertaste,
        richness
      },
      {new: true} // 返回更新后的文档
    );

    if (updatedBrewRating) {
      res.status(200).json(updatedBrewRating);
    } else {
      res.status(404).json({message: 'BrewRating not found for the provided brew ID'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// DELETE route to delete a brew rating by brew._id
router.delete('/brew-ratings/:brewId', async (req, res) => {
  try {
    const {brewId} = req.params;
    const brewRating = await BrewRating.findOneAndDelete({brew: brewId});

    if (brewRating) {
      res.status(200).json({message: 'BrewRating successfully deleted'});
    } else {
      res.status(404).json({message: 'BrewRating not found for the provided brew ID'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


module.exports = router;
