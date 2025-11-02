const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { getProfileByUserId,updateProfileByUserId,getAllProfiles } = require('../controllers/profileController');
const { getWorkouts, getNutrition,addProgress,getProgress,updateTarget } = require('../controllers/fitnessController');
const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

router.get('/profile/:userId', getProfileByUserId);
router.put('/profile/:userId', updateProfileByUserId);
router.get('/profiles', getAllProfiles);

router.get('/workouts', getWorkouts);
router.get('/nutrition', getNutrition);

router.post("/progress/:userId", addProgress);
router.get("/progress/:userId", getProgress);
router.put("/target/:userId", updateTarget);

module.exports = router;
