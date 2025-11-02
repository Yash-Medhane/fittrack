const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
  goal: { type: String, enum: ['Weight Gain', 'Weight Loss'], required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  description: { type: String },
  image: { type: String }
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
