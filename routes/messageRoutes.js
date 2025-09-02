const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.createMessage);
router.get('/', messageController.getAllMessages);
router.get('/:id', messageController.getMessageById);
router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);
router.get('/room/:roomId', messageController.getMessagesByRoom);

module.exports = router;
