const { GroupAssign, GroupDetail, User } = require('../models');

// ✅ Assign user to group
exports.assignUserToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ error: 'groupId and userId are required' });
    }

    // Check if group exists
    const group = await GroupDetail.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prevent duplicate assignment
    const existing = await GroupAssign.findOne({ where: { groupId, userId } });
    if (existing) {
      return res.status(400).json({ error: 'User already assigned to this group' });
    }

    const assignment = await GroupAssign.create({ groupId, userId });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all assignments (with relations)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await GroupAssign.findAll({
      include: [
        { model: GroupDetail, as: 'group' },
        { model: User, as: 'user' }
      ]
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await GroupAssign.findByPk(req.params.id, {
      include: [
        { model: GroupDetail, as: 'group' },
        { model: User, as: 'user' }
      ]
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await GroupAssign.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    await assignment.update(req.body);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await GroupAssign.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    await assignment.destroy();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
