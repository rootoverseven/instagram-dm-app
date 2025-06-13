const axios = require('axios');

class InstagramService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
  }

  // Get user profile information
  async getUserProfile(accessToken, userId) {
    try {
      const response = await axios.get(`${this.baseURL}/${userId}`, {
        params: {
          fields: 'id,username,profile_picture_url',
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Get conversations (chats)
  async getConversations(accessToken, pageId) {
    try {
      const response = await axios.get(`${this.baseURL}/${pageId}/conversations`, {
        params: {
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get conversations: ${error.message}`);
    }
  }

  // Get messages from a conversation
  async getMessages(accessToken, conversationId) {
    try {
      const response = await axios.get(`${this.baseURL}/${conversationId}/messages`, {
        params: {
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }

  // Send a message
  async sendMessage(accessToken, recipientId, message) {
    try {
      const response = await axios.post(`${this.baseURL}/me/messages`, {
        recipient: { id: recipientId },
        message: { text: message },
      }, {
        params: {
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Get media (posts/reels)
  async getMedia(accessToken, userId) {
    try {
      const response = await axios.get(`${this.baseURL}/${userId}/media`, {
        params: {
          fields: 'id,media_type,media_url,caption,timestamp',
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get media: ${error.message}`);
    }
  }

  // Get comments on a media object
  async getComments(accessToken, mediaId) {
    try {
      const response = await axios.get(`${this.baseURL}/${mediaId}/comments`, {
        params: {
          fields: 'id,text,timestamp,from',
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  // Reply to a comment (send DM to commenter)
  async replyToComment(accessToken, commenterId, message) {
    try {
      const response = await axios.post(`${this.baseURL}/me/messages`, {
        recipient: { id: commenterId },
        message: { text: message },
      }, {
        params: {
          access_token: accessToken,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to reply to comment: ${error.message}`);
    }
  }

  // Validate webhook signature
  validateWebhookSignature(signature, body, appSecret) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body, 'utf8')
      .digest('hex');
    return signature === `sha256=${expectedSignature}`;
  }
}

module.exports = new InstagramService();

