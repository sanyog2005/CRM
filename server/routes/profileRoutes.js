const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// PUT /api/profile/password/:id (Change Password)
// Placed before general update to ensure specific matching
router.put('/password/:id', profileController.changePassword);

// GET /api/profile/:id (Get user profile)
router.get('/:id', profileController.getProfile);

// PUT /api/profile/:id (Update general details)
router.put('/:id', profileController.updateProfile);

module.exports = router;