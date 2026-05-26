const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// GET /api/leads
router.get('/', leadController.getAllLeads);

// POST /api/leads (Create new lead)
router.post('/', leadController.createLead);

// POST /api/leads/bulk (Bulk Import)
router.post('/bulk', leadController.bulkImport);

// PUT /api/leads/followup/:id (Set reminder)
// Note: Put specific routes like 'followup' BEFORE dynamic routes like '/:id'
router.put('/followup/:id', leadController.setFollowUp);

// PUT /api/leads/:id (Update lead)
router.put('/:id', leadController.updateLead);

// DELETE /api/leads/:id
router.delete('/:id', leadController.deleteLead);

module.exports = router;