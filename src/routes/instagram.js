const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');
const authMiddleware = require('../middleware/auth');

// All Instagram routes require authentication
router.use(authMiddleware);

router.post('/link', instagramController.linkAccount);
router.get('/accounts', instagramController.getAccounts);
router.delete('/accounts/:accountId', instagramController.unlinkAccount);
router.get('/accounts/:accountId/media', instagramController.getMedia);
router.get('/accounts/:accountId/media/:mediaId/comments', instagramController.getComments);

module.exports = router;

