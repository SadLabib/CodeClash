const express = require('express');
const dotenv = require('dotenv');
const User = require('./models/user');

//env file configuration
dotenv.config();

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

//Exporting the app
module.exports = app;