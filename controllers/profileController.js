const Profile = require('../models/profileModel');

const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile fetched successfully', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfileByUserId = async (req, res) => {
  try {
    const { fullName, phone, goal, height, weight, activityLevel, gender, dateOfBirth } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { fullName, phone, goal, height, weight, activityLevel, gender, dateOfBirth },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found for update' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfileByUserId, updateProfileByUserId ,getAllProfiles};
