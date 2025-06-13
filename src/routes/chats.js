const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// All chat routes require authentication
router.use(authMiddleware);

router.get('/', chatController.getChats);
router.get('/:chatId/messages', chatController.getMessages);
router.post('/:chatId/messages', chatController.sendMessage);
router.post('/sync/:accountId', chatController.syncConversations);

module.exports = router;

