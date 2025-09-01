const express = require('express');
const app = express();

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const lastSeenRoutes = require('./routes/lastSeenRoutes');

app.use('/api/users', userRoutes);
app.use('/api/lastseen', lastSeenRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
