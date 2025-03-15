const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token });
};

const oauthSuccess = (req, res) => {
    try {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        
        res.json({
            success: true,
            message: 'OAuth authentication successful',
            token,
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error('OAuth success error:', error);
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

const oauthFailure = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'OAuth authentication failed'
    });
};

module.exports = { register, login, oauthSuccess, oauthFailure };