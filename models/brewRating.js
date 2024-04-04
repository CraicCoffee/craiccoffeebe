// brewRating.js (或者任何你存储 Mongoose 模型的文件名称)

const mongoose = require('mongoose');

const brewRatingSchema = new mongoose.Schema({
  brew: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brew',
    required: true
  },
  acidityQuality: {
    type: Number,
    required: true
  },
  sweetnessQuality: {
    type: Number,
    required: true
  },
  flavorQuality: {
    type: Number,
    required: true
  },
  acidityIntensity: {
    type: Number,
    required: true
  },
  sweetnessIntensity: {
    type: Number,
    required: true
  },
  bitternessIntensity: {
    type: Number,
    required: true
  },
  flavorIntensity: {
    type: Number,
    required: true
  },
  mouthfeel: {
    type: Number,
    required: true
  },
  aftertaste: {
    type: Number,
    required: true
  },
  richness: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const BrewRating = mongoose.model('BrewRating', brewRatingSchema);

module.exports = BrewRating;
