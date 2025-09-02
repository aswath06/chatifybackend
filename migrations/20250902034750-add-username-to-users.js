'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check first if the column exists to avoid duplicate errors
    const table = await queryInterface.describeTable('Users');
    if (!table.username) {
      await queryInterface.addColumn('Users', 'username', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });

      const [users] = await queryInterface.sequelize.query('SELECT userId, name FROM Users;');

      for (const user of users) {
        const username = `${user.name.toLowerCase().replace(/\s+/g, '')}_${user.userId}`;
        await queryInterface.sequelize.query(
          'UPDATE Users SET username = ? WHERE userId = ?;',
          { replacements: [username, user.userId] }
        );
      }

      await queryInterface.changeColumn('Users', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'username');
  }
};
