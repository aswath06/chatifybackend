const { Message } = require('../models');
const { Op } = require('sequelize');
module.exports = {
  // Create message
  async createMessage(req, res) {
    try {
      const message = await Message.create(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all messages
  async getAllMessages(req, res) {
    try {
      const messages = await Message.findAll();
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
      const [updated] = await Message.update(req.body, {
        where: { id: req.params.id }
      });
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
      const deleted = await Message.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Message not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getAllMessages(req, res) {
    try {
      const { user1, user2 } = req.query;

      if (user1 && user2) {
        const messages = await Message.findAll({
          where: {
            [Op.or]: [
              { from: user1, to: user2 },
              { from: user2, to: user1 }
            ]
          },
          order: [['timestamp', 'ASC']]
        });
        return res.json(messages);
      }

      // Fallback: get all messages
      const messages = await Message.findAll({
        order: [['timestamp', 'ASC']]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};
