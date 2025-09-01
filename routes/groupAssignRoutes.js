const express = require('express');
const router = express.Router();
const groupAssignController = require('../controllers/groupAssignController');

// Group assignment routes
router.post('/', groupAssignController.assignUserToGroup);
router.get('/', groupAssignController.getAllAssignments);
router.get('/:id', groupAssignController.getAssignmentById);
router.put('/:id', groupAssignController.updateAssignment);
router.delete('/:id', groupAssignController.deleteAssignment);

module.exports = router;
