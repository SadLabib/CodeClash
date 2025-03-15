// models/comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Blog = require('./blog');

const Comment = sequelize.define('Comment', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'id' },
    allowNull: false 
  },
  blogId: { 
    type: DataTypes.INTEGER, 
    references: { model: Blog, key: 'id' },
    allowNull: false 
  },
  parentId: { 
    type: DataTypes.INTEGER, 
    references: { model: 'Comments', key: 'id' },
    allowNull: true 
  }
}, {
  tableName: 'Comments',
  timestamps: true
});

// Relationships
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Blog.hasMany(Comment, { foreignKey: 'blogId' });
Comment.belongsTo(Blog, { foreignKey: 'blogId' });

// Self-reference for comment replies
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

module.exports = Comment;