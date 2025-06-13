const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AutoDMRule = sequelize.define('AutoDMRule', {
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
  triggerType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  triggerKeywords: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
  dmMessage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'auto_dm_rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AutoDMRule;

