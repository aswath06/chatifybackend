const { PrivateRoom, Message, Sequelize } = require('../models');
const crypto = require('crypto');
const { Op } = Sequelize;

function getRoomId(user1, user2) {
  const sorted = [user1, user2].sort();
  return crypto.createHash('md5').update(sorted.join('_')).digest('hex');
}

module.exports = {
  async createOrGetRoom(req, res) {
    try {
      const { user1Id, user2Id } = req.body;
      const roomId = getRoomId(user1Id, user2Id);

      const [room] = await PrivateRoom.findOrCreate({
        where: { roomId },
        defaults: { user1Id, user2Id, roomId }
      });

      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRoomsForUser(req, res) {
    try {
      const { userId } = req.params;

      const rooms = await PrivateRoom.findAll({
        where: {
          [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
        },
        include: [{
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['timestamp', 'DESC']],
          separate: true
        }]
      });

      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
