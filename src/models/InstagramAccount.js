const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InstagramAccount = sequelize.define('InstagramAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  instagramUserId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePictureUrl: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'instagram_accounts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = InstagramAccount;

