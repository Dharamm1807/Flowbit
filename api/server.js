const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const errorHandler = require('./utils/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const screenRoutes = require('./routes/screens');
const ticketRoutes = require('./routes/tickets');
const webhookRoutes = require('./routes/weebhook');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/me', screenRoutes);
app.use('/webhook', webhookRoutes);;

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;