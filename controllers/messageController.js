const { Message, PrivateRoom } = require('../models');
const crypto = require('crypto');

function getRoomId(user1, user2) {
  const sorted = [user1, user2].sort();
  return crypto.createHash('md5').update(sorted.join('_')).digest('hex');
}

module.exports = {
  // Create a message
  async createMessage(req, res) {
    try {
      const { from, to, context, media_url } = req.body;
      const roomId = getRoomId(from, to);

      // Ensure room exists
      await PrivateRoom.findOrCreate({
        where: { roomId },
        defaults: { user1Id: from, user2Id: to, roomId }
      });

      // Create message
      const message = await Message.create({ from, to, context, media_url, roomId });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all messages (optional: filter by users)
  async getAllMessages(req, res) {
    try {
      const { user1, user2, roomId } = req.query;

      if (roomId) {
        const messages = await Message.findAll({
          where: { roomId },
          order: [['timestamp', 'ASC']]
        });
        return res.json(messages);
      }

      if (user1 && user2) {
        const messages = await Message.findAll({
          where: {
            [Message.sequelize.Op.or]: [
              { from: user1, to: user2 },
              { from: user2, to: user1 }
            ]
          },
          order: [['timestamp', 'ASC']]
        });
        return res.json(messages);
      }

      // Fallback: all messages
      const messages = await Message.findAll({
        order: [['timestamp', 'ASC']]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get message by ID
  async getMessageById(req, res) {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: 'Message not found' });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update message
  async updateMessage(req, res) {
    try {
      const [updated] = await Message.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Message not found' });
      const updatedMessage = await Message.findByPk(req.params.id);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete message
  async deleteMessage(req, res) {
    try {
      const deleted = await Message.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Message not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get messages by room
  async getMessagesByRoom(req, res) {
    try {
      const { roomId } = req.params;
      const messages = await Message.findAll({
        where: { roomId },
        order: [['timestamp', 'ASC']]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
