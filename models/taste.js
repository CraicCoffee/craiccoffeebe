const mongoose = require('mongoose');

const tasteSchema = new mongoose.Schema({
  term: { type: String, required: true },
  type: { type: String, required: true, enum: [] } // 典型的味道类型
});

const Taste = mongoose.model('Taste', tasteSchema);
