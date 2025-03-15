const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');
const authenticateToken = require('./middlewares/auth');
const problemRoutes = require('./routes/problemRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

//env file configuration
dotenv.config();

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

// Example of a protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

//Exporting the app
module.exports = app;