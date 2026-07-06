const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Attach io to req
app.use((req, res, next) => { req.io = io; next(); });

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected: ai1mart DB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/holidays', require('./routes/holidays'));
app.use('/api/queries', require('./routes/queries'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => res.json({ message: 'AI1 Mart API Running 🚀' }));

// Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);
  socket.on('join_room', (room) => socket.join(room));
  socket.on('disconnect', () => console.log('🔴 Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 AI1Mart Server running on port ${PORT}`));
