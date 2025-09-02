'use strict';

const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Create PrivateRooms table if it doesn't exist
    await queryInterface.createTable('PrivateRooms', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      roomId: { type: Sequelize.STRING, allowNull: false, unique: true },
      user1Id: { type: Sequelize.INTEGER, allowNull: false },
      user2Id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }).catch(() => {}); // ignore if already exists

    // 2️⃣ Add roomId column to Messages if it doesn't exist
    const tableDesc = await queryInterface.describeTable('Messages');
    if (!tableDesc.roomId) {
      await queryInterface.addColumn('Messages', 'roomId', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // 3️⃣ Populate roomId for existing messages
    const [messages] = await queryInterface.sequelize.query(
      'SELECT id, `from`, `to` FROM Messages'
    );
    for (const msg of messages) {
      const roomId = crypto.createHash('md5').update([msg.from, msg.to].sort().join('_')).digest('hex');

      // Create room if it doesn't exist
      await queryInterface.sequelize.query(
        `INSERT IGNORE INTO PrivateRooms (roomId, user1Id, user2Id, createdAt, updatedAt)
         VALUES (:roomId, :user1, :user2, NOW(), NOW())`,
        { replacements: { roomId, user1: msg.from, user2: msg.to } }
      );

      // Update message
      await queryInterface.sequelize.query(
        `UPDATE Messages SET roomId=:roomId WHERE id=:id`,
        { replacements: { roomId, id: msg.id } }
      );
    }

    // 4️⃣ Alter Messages.roomId to NOT NULL
    await queryInterface.changeColumn('Messages', 'roomId', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // 5️⃣ Add foreign key constraint if not exists
    const [constraints] = await queryInterface.sequelize.query(
      "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='Messages' AND COLUMN_NAME='roomId'"
    );
    if (!constraints.find(c => c.CONSTRAINT_NAME === 'fk_roomId')) {
      await queryInterface.addConstraint('Messages', {
        fields: ['roomId'],
        type: 'foreign key',
        name: 'fk_roomId',
        references: { table: 'PrivateRooms', field: 'roomId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key if exists
    const [constraints] = await queryInterface.sequelize.query(
      "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='Messages' AND COLUMN_NAME='roomId'"
    );
    if (constraints.find(c => c.CONSTRAINT_NAME === 'fk_roomId')) {
      await queryInterface.removeConstraint('Messages', 'fk_roomId');
    }

    // Remove column if exists
    const tableDesc = await queryInterface.describeTable('Messages');
    if (tableDesc.roomId) {
      await queryInterface.removeColumn('Messages', 'roomId');
    }

    // Drop PrivateRooms table if exists
    await queryInterface.dropTable('PrivateRooms').catch(() => {});
  }
};
