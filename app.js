const express = require('express');
const { sequelize } = require('./models'); // Sequelize instance
const app = express();

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const lastSeenRoutes = require('./routes/lastSeenRoutes');
const groupDetailsRoutes = require('./routes/groupDetailsRoutes');
const groupAssignRoutes = require('./routes/groupAssignRoutes');

app.use('/api/users', userRoutes);
app.use('/api/lastseen', lastSeenRoutes);
app.use('/api/groups', groupDetailsRoutes);
app.use('/api/group-assign', groupAssignRoutes);       

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Start server and sync DB
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) // auto sync models with DB (use { force: true } only for dev reset)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err.message);
  });
