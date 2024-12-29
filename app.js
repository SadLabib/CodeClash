const express = require('express');
const dotenv = require('dotenv');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');
const authenticateToken = require('./middlewares/auth');

//env file configuration
dotenv.config();

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);

// Example of a protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

//Exporting the app
module.exports = app;