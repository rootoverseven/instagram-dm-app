const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
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
  participantInstagramId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastMessageText: {
    type: DataTypes.TEXT,
  },
  lastMessageTimestamp: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'chats',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Chat;

