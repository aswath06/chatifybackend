const express = require('express');
const router = express.Router();
const groupDetailsController = require('../controllers/groupDetailsController');

// Group routes
router.post('/', groupDetailsController.createGroup);
router.get('/', groupDetailsController.getAllGroups);
router.get('/:id', groupDetailsController.getGroupById);
router.put('/:id', groupDetailsController.updateGroup);
router.delete('/:id', groupDetailsController.deleteGroup);

module.exports = router;
