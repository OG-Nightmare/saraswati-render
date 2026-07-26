const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  brand:       { type: String, required: true },
  model:       { type: String, required: true },
  year:        { type: Number, required: true },
  kilometers:  { type: Number, default: 0 },
  askingPrice: { type: Number },
  description: { type: String },
  image:       {
    url: { type: String },
    publicId: { type: String }
  },
  status:      { type: String, enum: ['new', 'reviewed', 'contacted'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('SellRequest', sellRequestSchema);
