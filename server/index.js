const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://code-chill-vite.vercel.app'; // Set to your Vercel URL in prod
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json());

// Health check endpoint for Koyeb
app.get('/health', (req, res) => res.send('OK'));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'CodeChill server is running!', rooms: Array.from(rooms.keys()) });
});

// Store active rooms and their data
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    console.log(`User ${username} joining room ${roomId}`);
    
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
        code: '',
        language: 54,
        input: '',
        output: ''
      });
    }
    
    const room = rooms.get(roomId);
    const user = { id: socket.id, username };
    
    // Add user to room
    if (!room.users.find(u => u.id === socket.id)) {
      room.users.push(user);
    }
    
    // Send current room state to the new user
    socket.emit('code-update', {
      roomId,
      code: room.code,
      language: room.language
    });
    
    socket.emit('input-update', {
      roomId,
      input: room.input
    });
    
    socket.emit('output-update', {
      roomId,
      output: room.output
    });
    
    // Send active users to all users in the room
    io.to(roomId).emit('active-users', room.users);
    
    console.log(`Room ${roomId} users:`, room.users.map(u => u.username));
  });

  socket.on('code-change', ({ roomId, code }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).code = code;
      socket.to(roomId).emit('code-update', { roomId, code });
    }
  });

  socket.on('language-change', ({ roomId, language }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).language = language;
      socket.to(roomId).emit('language-change', { roomId, language });
    }
  });

  socket.on('input-change', ({ roomId, input }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).input = input;
      socket.to(roomId).emit('input-update', { roomId, input });
    }
  });

  socket.on('output-update', ({ roomId, output }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).output = output;
      socket.to(roomId).emit('output-update', { roomId, output });
    }
  });

  // Chat message event
  socket.on('chat-message', ({ roomId, user, text, time }) => {
    console.log('Received chat message:', { roomId, user, text, time });
    if (roomId && user && text) {
      // Broadcast to all users except sender (sender adds their own message locally)
      console.log(`Broadcasting chat message to room ${roomId}`);
      socket.to(roomId).emit('chat-message', { user, text, time });
    }
  });

  socket.on('run-code', ({ roomId, code, language, input }) => {
    // For now, just broadcast the run request
    // In a real implementation, you'd handle code execution here
    socket.to(roomId).emit('run-code', { roomId, code, language, input });
  });

  socket.on('leave-room', ({ roomId, username }) => {
    console.log(`User ${username} leaving room ${roomId}`);
    
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.users = room.users.filter(u => u.id !== socket.id);
      
      if (room.users.length === 0) {
        // Delete room if no users left
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (no users left)`);
      } else {
        // Update active users for remaining users
        io.to(roomId).emit('active-users', room.users);
      }
    }
    
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms they were in
    rooms.forEach((room, roomId) => {
      const userIndex = room.users.findIndex(u => u.id === socket.id);
      if (userIndex !== -1) {
        const username = room.users[userIndex].username;
        room.users.splice(userIndex, 1);
        
        if (room.users.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (no users left)`);
        } else {
          io.to(roomId).emit('active-users', room.users);
        }
        
        console.log(`User ${username} removed from room ${roomId}`);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});
