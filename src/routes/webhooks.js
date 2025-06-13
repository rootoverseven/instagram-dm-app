const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Webhook verification (GET)
router.get('/instagram', webhookController.verify);

// Webhook events (POST)
router.post('/instagram', webhookController.handle);

module.exports = router;

