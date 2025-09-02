'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const { sequelize, User, Message, PrivateRoom } = require('./models');
const crypto = require('crypto');

const app = express();

// ---------------- Middleware ---------------- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- Routes ---------------- //
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

// ---------------- Health check ---------------- //
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ---------------- Error handling ---------------- //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ---------------- Helper: Fix NULL Users ---------------- //
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

    await User.update({ profileImg: null }, { where: { profileImg: null } });
    await User.update({ dateOfBirth: null }, { where: { dateOfBirth: null } });

    console.log('✅ NULL values fixed in Users table.');
  } catch (error) {
    console.error('❌ Error fixing NULL values:', error);
  }
}

// ---------------- Helper: Generate Room ID ---------------- //
function getRoomId(user1, user2) {
  const sorted = [user1, user2].sort();
  return crypto.createHash('md5').update(sorted.join('_')).digest('hex');
}

// ---------------- Start Server ---------------- //
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

async function startServer() {
  try {
    await fixNullUsers(); 
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database synced successfully.');

    const server = http.createServer(app);

    // ---------------- Socket.IO ---------------- //
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id);

      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on('sendMessage', async (data) => {
        try {
          const { from, to, context, media_url } = data;
          const roomId = getRoomId(from, to);

          await PrivateRoom.findOrCreate({
            where: { roomId },
            defaults: { user1Id: from, user2Id: to, roomId }
          });

          const message = await Message.create({ from, to, context, media_url, roomId });
          io.to(roomId).emit('receiveMessage', message);
        } catch (error) {
          console.error('❌ Error sending message via Socket.IO:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
      });
    });

    server.listen(PORT, HOST, () => {
      // Automatically get local network IP
      const nets = os.networkInterfaces();
      let localIp = 'localhost';
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            localIp = net.address;
          }
        }
      }
      console.log(`🚀 Server running on http://${localIp}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database sync failed:', err.message);
  }
}

startServer();
