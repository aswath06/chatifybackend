const express = require('express');
const { sequelize, User } = require('./models'); // Sequelize instance + User model
const app = express();

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const lastSeenRoutes = require('./routes/lastSeenRoutes');
const groupDetailsRoutes = require('./routes/groupDetailsRoutes');
const groupAssignRoutes = require('./routes/groupAssignRoutes');       
const messageRoutes = require('./routes/messageRoutes');
const privateRoomRoutes = require('./routes/privateRoomRoutes');

app.use('/api/users', userRoutes);
app.use('/api/lastseen', lastSeenRoutes);
app.use('/api/groups', groupDetailsRoutes);
app.use('/api/group-assign', groupAssignRoutes);       
app.use('/api/privateRooms', privateRoomRoutes);
app.use('/messages', messageRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ----------------- Helper: Fix NULL values in Users table ----------------- //
async function fixNullUsers() {
  try {
    const usersWithNullUsername = await User.findAll({ where: { username: null } });
    for (const user of usersWithNullUsername) {
      const uniqueUsername = `user_${user.userId || Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await user.update({ username: uniqueUsername });
    }

    const usersWithNullEmail = await User.findAll({ where: { email: null } });
    for (const user of usersWithNullEmail) {
      const uniqueEmail = `user${user.userId || Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
      await user.update({ email: uniqueEmail });
    }

    // Optional: fix profileImg and dateOfBirth if needed
    await User.update(
      { profileImg: null },
      { where: { profileImg: null } }
    );
    await User.update(
      { dateOfBirth: null },
      { where: { dateOfBirth: null } }
    );

    console.log('✅ NULL values fixed in Users table.');
  } catch (error) {
    console.error('❌ Error fixing NULL values:', error);
  }
}

// ----------------- Start server ----------------- //
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await fixNullUsers(); // Fix NULL values first
    await sequelize.sync({ alter: true }); // Sync DB safely
    console.log('✅ Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database sync failed:', err.message);
  }
}

startServer();
