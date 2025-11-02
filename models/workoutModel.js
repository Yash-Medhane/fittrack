const mongoose = require('mongoose');   

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Core'], required: true },
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: { type: Number, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  description: { type: String },
  image: { type: String }, // optional image URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);