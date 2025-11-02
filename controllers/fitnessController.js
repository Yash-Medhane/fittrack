const Workout = require('../models/workoutModel');
const Nutrition = require('../models/nutritionModel');
const Profile = require("../models/profileModel");

// 🏋️ Fetch all or filtered workouts
const getWorkouts = async (req, res) => {
    try {
    const workouts = await Workout.find();
    res.status(200).json({ success: true, workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🥗 Fetch all or filtered nutrition data
const getNutrition = async (req, res) => {
    try {
    const nutrition = await Nutrition.find();
    res.status(200).json({ success: true, nutrition });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const addProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      weight, 
      calories, 
      protein, 
      carbs, 
      fats, 
      water, 
      steps, 
      sleep 
    } = req.body;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Create new progress entry
    const newProgress = {
      date: new Date(),
      weight: weight || 0,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      water: water || 0,
      steps: steps || 0,
      sleep: sleep || 0
    };

    // Push new entry
    profile.progress.push(newProgress);

    // Save
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Progress added successfully!",
      progress: profile.progress
    });

  } catch (error) {
    console.error("Error adding progress:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Get all progress entries for a user
const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      progress: profile.progress,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateTarget = async (req, res) => {
  try {
    const { userId } = req.params;
    const { targets } = req.body;

    if (!targets) {
      return res.status(400).json({ success: false, message: "Targets data missing" });
    }

    // Find profile by userId
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Update target values
    profile.targets = {
      calories: targets.calories || profile.targets?.calories || 2000,
      protein: targets.protein || profile.targets?.protein || 50,
      carbs: targets.carbs || profile.targets?.carbs || 250,
      fats: targets.fats || profile.targets?.fats || 70,
      water: targets.water || profile.targets?.water || 2000,
      steps: targets.steps || profile.targets?.steps || 8000,
      sleep: targets.sleep || profile.targets?.sleep || 8,
      weight: targets.weight || profile.targets?.weight || 70
    };

    // Save updated profile
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Targets updated successfully!",
      targets: profile.targets
    });
  } catch (error) {
    console.error("Error updating target:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = { getWorkouts, getNutrition,getProgress, addProgress, updateTarget };
