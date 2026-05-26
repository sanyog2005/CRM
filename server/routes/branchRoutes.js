const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// GET /api/branches (Get all branches with manager names)
router.get('/', branchController.getAllBranches);

// GET /api/branches/managers (Get users who can be managers)
// ⚠️ IMPORTANT: This must be defined BEFORE '/:id' 
router.get('/managers', branchController.getManagers);

// POST /api/branches (Create a new branch)
router.post('/', branchController.createBranch);

// PUT /api/branches/:id (Update an existing branch)
router.put('/:id', branchController.updateBranch);

// DELETE /api/branches/:id (Remove a branch)
router.delete('/:id', branchController.deleteBranch);

module.exports = router;