const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  fullName: { type: String, default: '' },
  email: { type: String, unique: true, required: true },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, default: 'Not specified' },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  goal: { type: String, default: 'Maintain fitness' },
  activityLevel: { type: String, default: 'Moderate' },
  dietaryPreference: { type: String, default: 'None' },

  targets: {
    calories: { type: Number, default: 2000 },
    protein: { type: Number, default: 50 },
    carbs: { type: Number, default: 250 },
    fats: { type: Number, default: 70 },
    water: { type: Number, default: 2000 }, // ml
    steps: { type: Number, default: 8000 },
    sleep: { type: Number, default: 8 }, // hours
    weight: { type: Number, default: 0 }
  },

  bio: { type: String, default: 'Let’s achieve fitness goals together!' },

  progress: [
    {
      date: { type: Date, default: Date.now },
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      steps: { type: Number, default: 0 },
      sleep: { type: Number, default: 0 },
      weight: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

// ✅ Virtual field to calculate average progress
profileSchema.virtual('averageProgress').get(function () {
  if (!this.progress || this.progress.length === 0) return {};

  const totals = this.progress.reduce((acc, entry) => {
    Object.keys(entry.toObject()).forEach(key => {
      if (typeof entry[key] === 'number') {
        acc[key] = (acc[key] || 0) + entry[key];
      }
    });
    return acc;
  }, {});

  const averages = {};
  Object.keys(totals).forEach(key => {
    averages[key] = parseFloat((totals[key] / this.progress.length).toFixed(1));
  });

  return averages;
});

module.exports = mongoose.model('Profile', profileSchema);
