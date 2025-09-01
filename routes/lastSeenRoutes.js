const express = require('express');
const router = express.Router();
const lastSeenController = require('../controllers/lastSeenController');

router.post('/', lastSeenController.updateLastSeen);
router.get('/:userId', lastSeenController.getLastSeen);

module.exports = router;
