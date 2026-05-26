const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// GET /api/staff
router.get('/', staffController.getAllStaff);

// POST /api/staff (Add new staff member)
router.post('/', staffController.addStaff);

// PUT /api/staff/:id
router.put('/:id', staffController.updateStaff);

// DELETE /api/staff/:id
router.delete('/:id', staffController.deleteStaff);

module.exports = router;