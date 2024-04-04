const express = require('express');
const router = express.Router();
const Brew = require('../models/Brew');
const multer = require('multer');
const fs = require('fs');

// 配置 Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.json')
  }
});
const upload = multer({ storage: storage }).single('jsonfile');

// POST route to save brew data
router.post('/brew', async (req, res) => {
  try {
    const newBrew = new Brew(req.body);
    const savedBrew = await newBrew.save();
    res.status(201).json(savedBrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to retrieve brew data
router.get('/brew', async (req, res) => {
  try {
    const brews = await Brew.find();
    res.status(200).json(brews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to retrieve a list of all brews' ids
router.get('/brews', async (req, res) => {
  try {
    // 只选择 '_id' 字段
    const brews = await Brew.find().select('_id id json.cupFactory json.singleBean.name');
    // 将结果映射为一个包含所有 id 的数组
    // const brewIds = brews.map(brew => brew._id);
    res.status(200).json(brews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to retrieve a single brew by id
router.get('/brew/:id', async (req, res) => {
  try {
    // 通过 URL 中的 id 参数查找对应的 Brew
    const brew = await Brew.findById(req.params.id);
    if (brew) {
      res.status(200).json(brew);
    } else {
      res.status(404).send('Brew not found.');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to delete a single brew by id
router.delete('/brew/:id', async (req, res) => {
  try {
    // Attempt to delete the specified Brew by ID
    const result = await Brew.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Brew deleted successfully.' });
    } else {
      // If no document found, send a 404
      res.status(404).send('Brew not found.');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to upload and process JSON file
router.post('/upload-json', upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  // 读取文件内容
  const filePath = req.file.path;
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the uploaded file.');
    }

    try {
      const jsonData = JSON.parse(data);

      // 检查 id 是否重复
      const existingData = await Brew.findOne({ id: jsonData.id }).exec();
      if (existingData) {
        res.status(400).send('Duplicate id, data not saved.');
      } else {
        // 保存到 MongoDB
        const newBrew = new Brew(jsonData);
        const savedBrew = await newBrew.save();
        res.status(200).send('JSON file uploaded and data saved to MongoDB.');
      }
    } catch (jsonErr) {
      res.status(400).send('File content is not valid JSON.');
    }
  });
});

module.exports = router;
