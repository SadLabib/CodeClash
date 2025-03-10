// models/problem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Problem = sequelize.define('Problem', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  link: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  startTime: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },
  deadline: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'started', 'done'), 
    allowNull: false, 
    defaultValue: 'pending' 
  },
  metadata: { 
    type: DataTypes.JSON, 
    allowNull: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'id' },
    allowNull: false 
  }
}, {
  tableName: 'Problems',
  timestamps: true
});

// Relationships
User.hasMany(Problem, { foreignKey: 'userId' });
Problem.belongsTo(User, { foreignKey: 'userId' });

module.exports = Problem;
