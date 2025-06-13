const { Chat, Message, InstagramAccount } = require('../models');
const instagramService = require('../services/instagramService');

const chatController = {
  // Get all chats for user's Instagram accounts
  getChats: async (req, res) => {
    try {
      const userId = req.user.id;

      const chats = await Chat.findAll({
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId },
          attributes: ['id', 'username']
        }],
        order: [['lastMessageTimestamp', 'DESC']]
      });

      res.json({ chats });
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({ error: 'Failed to get chats' });
    }
  },

  // Get messages for a specific chat
  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      // Verify the chat belongs to the user
      const chat = await Chat.findOne({
        where: { id: chatId },
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId }
        }]
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const messages = await Message.findAll({
        where: { chatId },
        order: [['timestamp', 'ASC']]
      });

      res.json({ messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  },

  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;

      // Verify the chat belongs to the user
      const chat = await Chat.findOne({
        where: { id: chatId },
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId }
        }]
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      // Send message via Instagram API
      await instagramService.sendMessage(
        chat.instagramAccount.accessToken,
        chat.participantInstagramId,
        text
      );

      // Save message to database
      const message = await Message.create({
        chatId,
        senderInstagramId: chat.instagramAccount.instagramUserId,
        text,
        timestamp: new Date()
      });

      // Update chat's last message
      await chat.update({
        lastMessageText: text,
        lastMessageTimestamp: new Date()
      });

      res.status(201).json({
        message: 'Message sent successfully',
        messageData: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  },

  // Sync conversations from Instagram
  syncConversations: async (req, res) => {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      const account = await InstagramAccount.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      // This would require the Instagram Page ID associated with the account
      // For now, we'll return a placeholder response
      res.json({ 
        message: 'Conversation sync initiated',
        note: 'This feature requires Instagram Page ID and proper webhook setup'
      });
    } catch (error) {
      console.error('Sync conversations error:', error);
      res.status(500).json({ error: 'Failed to sync conversations' });
    }
  }
};

module.exports = chatController;

