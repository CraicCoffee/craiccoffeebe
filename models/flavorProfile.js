const mongoose = require('mongoose');

const flavorProfileSchema = new mongoose.Schema({
  highTempDescriptors: [String],
  midTempDescriptors: [String],
  lowTempDescriptors: [String],
  brew: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brew',
    required: true,
    unique: true // 确保风味描述与冲煮记录是1:1关系
  }
});

// const FlavorProfile = mongoose.model('FlavorProfile', flavorProfileSchema);

module.exports = mongoose.models.FlavorProfile || mongoose.model('FlavorProfile', flavorProfileSchema);
