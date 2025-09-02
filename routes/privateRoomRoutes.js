const express = require('express');
const router = express.Router();
const privateRoomController = require('../controllers/privateRoomController');

router.post('/', privateRoomController.createOrGetRoom);
router.get('/user/:userId', privateRoomController.getRoomsForUser);

module.exports = router;
