const mongoose = require('mongoose');

const descriptorSchema = new mongoose.Schema({
  term: { type: String, required: true },
  type: { type: String, required: true, enum: ['general'] } // 用于未来可能的扩展
});

const Descriptor = mongoose.model('Descriptor', descriptorSchema);
