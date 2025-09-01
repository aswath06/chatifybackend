const { GroupDetail, GroupAssign, User } = require('../models');

// ✅ Create new group
exports.createGroup = async (req, res) => {
  try {
    const { groupName, members, groupIcon, admin } = req.body;
    const group = await GroupDetail.create({ groupName, members, groupIcon, admin });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all groups (with assignments + users)
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await GroupDetail.findAll({
      include: [
        {
          model: GroupAssign,
          as: 'assignments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupDetail.findByPk(req.params.id, {
      include: [
        {
          model: GroupAssign,
          as: 'assignments',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update group
exports.updateGroup = async (req, res) => {
  try {
    const group = await GroupDetail.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    await group.update(req.body);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete group (cascade deletes assignments)
exports.deleteGroup = async (req, res) => {
  try {
    const group = await GroupDetail.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    await group.destroy();
    res.json({ message: 'Group deleted successfully (assignments removed too)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
