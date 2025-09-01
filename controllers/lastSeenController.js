const { LastSeen } = require('../models');

// Update or create last seen for user
exports.updateLastSeen = async (req, res) => {
  try {
    const { userId } = req.body;
    let lastSeen = await LastSeen.findOne({ where: { userId } });

    if (lastSeen) {
      await lastSeen.update({ timestamp: new Date() });
    } else {
      lastSeen = await LastSeen.create({ userId, timestamp: new Date() });
    }

    res.json(lastSeen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get last seen by userId
exports.getLastSeen = async (req, res) => {
  try {
    const lastSeen = await LastSeen.findOne({ where: { userId: req.params.userId } });
    if (!lastSeen) return res.status(404).json({ error: 'No last seen record' });
    res.json(lastSeen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
