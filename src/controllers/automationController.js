const { AutoDMRule, ReelComment, InstagramAccount } = require('../models');
const instagramService = require('../services/instagramService');

const automationController = {
  // Get all automation rules for a user
  getRules: async (req, res) => {
    try {
      const userId = req.user.id;

      const rules = await AutoDMRule.findAll({
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId },
          attributes: ['id', 'username']
        }],
        order: [['created_at', 'DESC']]
      });

      res.json({ rules });
    } catch (error) {
      console.error('Get rules error:', error);
      res.status(500).json({ error: 'Failed to get automation rules' });
    }
  },

  // Create a new automation rule
  createRule: async (req, res) => {
    try {
      const { instagramAccountId, triggerType, triggerKeywords, dmMessage, isActive } = req.body;
      const userId = req.user.id;

      // Verify the Instagram account belongs to the user
      const account = await InstagramAccount.findOne({
        where: { id: instagramAccountId, userId }
      });

      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }

      const rule = await AutoDMRule.create({
        instagramAccountId,
        triggerType,
        triggerKeywords,
        dmMessage,
        isActive
      });

      res.status(201).json({
        message: 'Automation rule created successfully',
        rule
      });
    } catch (error) {
      console.error('Create rule error:', error);
      res.status(500).json({ error: 'Failed to create automation rule' });
    }
  },

  // Update an automation rule
  updateRule: async (req, res) => {
    try {
      const { ruleId } = req.params;
      const { triggerKeywords, dmMessage, isActive } = req.body;
      const userId = req.user.id;

      const rule = await AutoDMRule.findOne({
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId }
        }],
        where: { id: ruleId }
      });

      if (!rule) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      await rule.update({
        triggerKeywords,
        dmMessage,
        isActive
      });

      res.json({
        message: 'Automation rule updated successfully',
        rule
      });
    } catch (error) {
      console.error('Update rule error:', error);
      res.status(500).json({ error: 'Failed to update automation rule' });
    }
  },

  // Delete an automation rule
  deleteRule: async (req, res) => {
    try {
      const { ruleId } = req.params;
      const userId = req.user.id;

      const rule = await AutoDMRule.findOne({
        include: [{
          model: InstagramAccount,
          as: 'instagramAccount',
          where: { userId }
        }],
        where: { id: ruleId }
      });

      if (!rule) {
        return res.status(404).json({ error: 'Automation rule not found' });
      }

      await rule.destroy();

      res.json({ message: 'Automation rule deleted successfully' });
    } catch (error) {
      console.error('Delete rule error:', error);
      res.status(500).json({ error: 'Failed to delete automation rule' });
    }
  },

  // Process a comment and check for automation triggers
  processComment: async (commentData) => {
    try {
      const { instagramAccountId, reelId, commentId, commenterInstagramId, commentText } = commentData;

      // Check if we've already processed this comment
      const existingComment = await ReelComment.findOne({
        where: { commentId }
      });

      if (existingComment) {
        return { processed: false, reason: 'Comment already processed' };
      }

      // Save the comment
      const comment = await ReelComment.create({
        instagramAccountId,
        reelId,
        commentId,
        commenterInstagramId,
        commentText,
        timestamp: new Date()
      });

      // Get active automation rules for this Instagram account
      const rules = await AutoDMRule.findAll({
        where: {
          instagramAccountId,
          isActive: true,
          triggerType: 'comment_on_reel'
        }
      });

      let dmSent = false;
      let triggeredRule = null;

      // Check each rule for keyword matches
      for (const rule of rules) {
        const keywords = rule.triggerKeywords;
        const commentLower = commentText.toLowerCase();

        // Check if any keyword matches
        const hasMatch = keywords.some(keyword => 
          commentLower.includes(keyword.toLowerCase())
        );

        if (hasMatch) {
          try {
            // Get the Instagram account to get the access token
            const account = await InstagramAccount.findByPk(instagramAccountId);
            
            if (account) {
              // Send the automated DM
              await instagramService.replyToComment(
                account.accessToken,
                commenterInstagramId,
                rule.dmMessage
              );

              dmSent = true;
              triggeredRule = rule;
              break; // Only trigger the first matching rule
            }
          } catch (dmError) {
            console.error('Failed to send automated DM:', dmError);
          }
        }
      }

      // Update the comment record
      await comment.update({ dmSent });

      return {
        processed: true,
        dmSent,
        triggeredRule: triggeredRule ? {
          id: triggeredRule.id,
          message: triggeredRule.dmMessage
        } : null
      };

    } catch (error) {
      console.error('Process comment error:', error);
      return { processed: false, error: error.message };
    }
  },

  // Get automation statistics
  getStats: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get Instagram accounts for this user
      const accounts = await InstagramAccount.findAll({
        where: { userId },
        attributes: ['id']
      });

      const accountIds = accounts.map(account => account.id);

      // Get rule statistics
      const totalRules = await AutoDMRule.count({
        where: { instagramAccountId: accountIds }
      });

      const activeRules = await AutoDMRule.count({
        where: { 
          instagramAccountId: accountIds,
          isActive: true
        }
      });

      const totalComments = await ReelComment.count({
        where: { instagramAccountId: accountIds }
      });

      const messagesSent = await ReelComment.count({
        where: { 
          instagramAccountId: accountIds,
          dmSent: true
        }
      });

      res.json({
        stats: {
          totalRules,
          activeRules,
          totalComments,
          messagesSent
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get automation statistics' });
    }
  }
};

module.exports = automationController;

