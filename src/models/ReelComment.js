const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReelComment = sequelize.define('ReelComment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  instagramAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'instagram_accounts',
      key: 'id',
    },
  },
  reelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commenterInstagramId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dmSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'reel_comments',
  timestamps: false,
});

module.exports = ReelComment;

