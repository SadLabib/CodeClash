// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Friend = require('./friend');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {
  tableName: 'Users',
  timestamps: true
});

// Self-referencing Many-to-Many relationship
User.belongsToMany(User, {
  through: Friend,
  as: 'Friends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

module.exports = User;
