const sequelize = require('../config/database');
const User = require('./User');
const InstagramAccount = require('./InstagramAccount');
const Chat = require('./Chat');
const Message = require('./Message');
const AutoDMRule = require('./AutoDMRule');
const ReelComment = require('./ReelComment');

// Define associations
User.hasMany(InstagramAccount, { foreignKey: 'userId', as: 'instagramAccounts' });
InstagramAccount.belongsTo(User, { foreignKey: 'userId', as: 'user' });

InstagramAccount.hasMany(Chat, { foreignKey: 'instagramAccountId', as: 'chats' });
Chat.belongsTo(InstagramAccount, { foreignKey: 'instagramAccountId', as: 'instagramAccount' });

Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });

InstagramAccount.hasMany(AutoDMRule, { foreignKey: 'instagramAccountId', as: 'autoDMRules' });
AutoDMRule.belongsTo(InstagramAccount, { foreignKey: 'instagramAccountId', as: 'instagramAccount' });

InstagramAccount.hasMany(ReelComment, { foreignKey: 'instagramAccountId', as: 'reelComments' });
ReelComment.belongsTo(InstagramAccount, { foreignKey: 'instagramAccountId', as: 'instagramAccount' });

module.exports = {
  sequelize,
  User,
  InstagramAccount,
  Chat,
  Message,
  AutoDMRule,
  ReelComment,
};

