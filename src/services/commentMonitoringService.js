const cron = require('node-cron');
const { InstagramAccount, AutoDMRule } = require('../models');
const instagramService = require('./instagramService');
const automationController = require('../controllers/automationController');

class CommentMonitoringService {
  constructor() {
    this.isRunning = false;
    this.monitoringInterval = null;
  }

  // Start monitoring comments on all connected Instagram accounts
  start() {
    if (this.isRunning) {
      console.log('Comment monitoring is already running');
      return;
    }

    console.log('Starting comment monitoring service...');
    this.isRunning = true;

    // Monitor comments every 2 minutes
    this.monitoringInterval = cron.schedule('*/2 * * * *', async () => {
      await this.checkForNewComments();
    }, {
      scheduled: true
    });

    console.log('Comment monitoring service started');
  }

  // Stop monitoring
  stop() {
    if (!this.isRunning) {
      console.log('Comment monitoring is not running');
      return;
    }

    console.log('Stopping comment monitoring service...');
    
    if (this.monitoringInterval) {
      this.monitoringInterval.destroy();
      this.monitoringInterval = null;
    }

    this.isRunning = false;
    console.log('Comment monitoring service stopped');
  }

  // Check for new comments on all Instagram accounts
  async checkForNewComments() {
    try {
      console.log('Checking for new comments...');

      // Get all Instagram accounts with active automation rules
      const accounts = await InstagramAccount.findAll({
        include: [{
          model: AutoDMRule,
          as: 'autoDMRules',
          where: { isActive: true },
          required: true
        }]
      });

      for (const account of accounts) {
        await this.monitorAccountComments(account);
      }

      console.log(`Checked ${accounts.length} accounts for new comments`);
    } catch (error) {
      console.error('Error checking for new comments:', error);
    }
  }

  // Monitor comments for a specific Instagram account
  async monitorAccountComments(account) {
    try {
      // Get recent media (posts/reels) for this account
      const media = await instagramService.getMedia(account.accessToken, account.instagramUserId);

      if (!media || !media.data) {
        console.log(`No media found for account ${account.username}`);
        return;
      }

      // Check comments on the most recent 5 posts/reels
      const recentMedia = media.data.slice(0, 5);

      for (const mediaItem of recentMedia) {
        await this.checkMediaComments(account, mediaItem);
      }
    } catch (error) {
      console.error(`Error monitoring comments for account ${account.username}:`, error);
    }
  }

  // Check comments on a specific media item
  async checkMediaComments(account, mediaItem) {
    try {
      const comments = await instagramService.getComments(account.accessToken, mediaItem.id);

      if (!comments || !comments.data) {
        return;
      }

      // Process each comment
      for (const comment of comments.data) {
        await this.processComment(account, mediaItem, comment);
      }
    } catch (error) {
      console.error(`Error checking comments for media ${mediaItem.id}:`, error);
    }
  }

  // Process a single comment
  async processComment(account, mediaItem, comment) {
    try {
      const commentData = {
        instagramAccountId: account.id,
        reelId: mediaItem.id,
        commentId: comment.id,
        commenterInstagramId: comment.from.id,
        commentText: comment.text
      };

      const result = await automationController.processComment(commentData);

      if (result.processed && result.dmSent) {
        console.log(`Automated DM sent to ${comment.from.username} for comment: "${comment.text}"`);
      }
    } catch (error) {
      console.error('Error processing comment:', error);
    }
  }

  // Manual trigger for testing
  async triggerManualCheck() {
    console.log('Manual comment check triggered');
    await this.checkForNewComments();
  }

  // Get monitoring status
  getStatus() {
    return {
      isRunning: this.isRunning,
      startTime: this.startTime
    };
  }
}

// Create singleton instance
const commentMonitoringService = new CommentMonitoringService();

module.exports = commentMonitoringService;

