const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['bike', 'car'], required: true },
  // Top-level category: superbike or city bike
  category: { type: String, enum: ['superbike', 'city'], default: 'city' },
  // Sub-category for more specific classification
  subcategory: {
    type: String,
    enum: ['cruiser', 'sports', 'tourer', 'adventure', 'naked', 'scooter', 'commuter'],
    default: 'commuter',
  },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'], required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
  ownership: { type: Number, default: 1 },
  kilometers: { type: Number, required: true },
  description: { type: String },
  features: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String },
    displayOrder: { type: Number, default: 0 }
  }],
  registrationState: { type: String, default: 'Delhi' },
  insuranceStatus: { type: String, enum: ['Active', 'Expired', 'Third Party'], default: 'Active' },
  sellerNotes: { type: String },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
