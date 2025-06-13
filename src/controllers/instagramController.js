const { InstagramAccount } = require('../models');
const instagramService = require('../services/instagramService');

const instagramController = {
  // Link Instagram account
  linkAccount: async (req, res) => {
    try {
      const { accessToken, instagramUserId } = req.body;
      const userId = req.user.id;

      // Get user profile from Instagram
      const profile = await instagramService.getUserProfile(accessToken, instagramUserId);

      // Check if account is already linked
      const existingAccount = await InstagramAccount.findOne({
        where: { instagramUserId }
      });

      if (existingAccount) {
        return res.status(400).json({ error: 'Instagram account already linked' });
      }

      // Create Instagram account record
      const instagramAccount = await InstagramAccount.create({
        userId,
        instagramUserId,
        accessToken,
        username: profile.username,
        profilePictureUrl: profile.profile_picture_url,
      });

      res.status(201).json({
        message: 'Instagram account linked successfully',
        account: {
          id: instagramAccount.id,
          username: instagramAccount.username,
          profilePictureUrl: instagramAccount.profilePictureUrl,
        },
      });
    } catch (error) {
      console.error('Link account error:', error);
      res.status(500).json({ error: 'Failed to link Instagram account' });
    }
  },

  // Get linked Instagram accounts
  getAccounts: async (req, res) => {
    try {
      const userId = req.user.id;

      const accounts = await InstagramAccount.findAll({
        where: { userId },
        attributes: ['id', 'username', 'profilePictureUrl', 'created_at'],
      });

      res.json({ accounts });
    } catch (error) {
      console.error('Get accounts error:', error);
      res.status(500).json({ error: 'Failed to get Instagram accounts' });
    }
  },

  // Unlink Instagram account
  unlinkAccount: async (req, res) => {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      const account = await InstagramAccount.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      await account.destroy();

      res.json({ message: 'Instagram account unlinked successfully' });
    } catch (error) {
      console.error('Unlink account error:', error);
      res.status(500).json({ error: 'Failed to unlink Instagram account' });
    }
  },

  // Get Instagram media (posts/reels)
  getMedia: async (req, res) => {
    try {
      const { accountId } = req.params;
      const userId = req.user.id;

      const account = await InstagramAccount.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      const media = await instagramService.getMedia(account.accessToken, account.instagramUserId);

      res.json({ media: media.data });
    } catch (error) {
      console.error('Get media error:', error);
      res.status(500).json({ error: 'Failed to get Instagram media' });
    }
  },

  // Get comments on a media object
  getComments: async (req, res) => {
    try {
      const { accountId, mediaId } = req.params;
      const userId = req.user.id;

      const account = await InstagramAccount.findOne({
        where: { id: accountId, userId }
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      const comments = await instagramService.getComments(account.accessToken, mediaId);

      res.json({ comments: comments.data });
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ error: 'Failed to get comments' });
    }
  },
};

module.exports = instagramController;

