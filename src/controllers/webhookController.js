const instagramService = require('../services/instagramService');
const automationController = require('../controllers/automationController');

// Webhook handler for Instagram
const webhookController = {
  // Verify webhook (required by Instagram)
  verify: (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('Webhook verified');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  },

  // Handle webhook events
  handle: async (req, res) => {
    try {
      const body = req.body;

      // Verify the webhook signature
      const signature = req.get('X-Hub-Signature-256');
      const appSecret = process.env.INSTAGRAM_APP_SECRET;

      if (!instagramService.validateWebhookSignature(signature, JSON.stringify(body), appSecret)) {
        console.log('Invalid webhook signature');
        return res.sendStatus(403);
      }

      // Process webhook events
      if (body.object === 'instagram') {
        body.entry.forEach(async (entry) => {
          // Handle different types of events
          if (entry.changes) {
            for (const change of entry.changes) {
              await this.processWebhookChange(change, entry.id);
            }
          }

          // Handle messaging events
          if (entry.messaging) {
            for (const messagingEvent of entry.messaging) {
              await this.processMessagingEvent(messagingEvent);
            }
          }
        });
      }

      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).send('Error processing webhook');
    }
  },

  // Process webhook changes (comments, mentions, etc.)
  processWebhookChange: async (change, instagramUserId) => {
    try {
      if (change.field === 'comments') {
        // Handle new comment
        const commentData = change.value;
        
        // Find the Instagram account
        const { InstagramAccount } = require('../models');
        const account = await InstagramAccount.findOne({
          where: { instagramUserId }
        });

        if (account && commentData.text) {
          const processData = {
            instagramAccountId: account.id,
            reelId: commentData.media.id,
            commentId: commentData.id,
            commenterInstagramId: commentData.from.id,
            commentText: commentData.text
          };

          const result = await automationController.processComment(processData);
          
          if (result.processed && result.dmSent) {
            console.log(`Webhook: Automated DM sent for comment: "${commentData.text}"`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook change:', error);
    }
  },

  // Process messaging events
  processMessagingEvent: async (messagingEvent) => {
    try {
      // Handle incoming messages, message reads, etc.
      if (messagingEvent.message) {
        console.log('New message received:', messagingEvent.message);
        // Store message in database or process as needed
      }
    } catch (error) {
      console.error('Error processing messaging event:', error);
    }
  }
};

module.exports = webhookController;

