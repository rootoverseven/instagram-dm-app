const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const authMiddleware = require('../middleware/auth');

// All automation routes require authentication
router.use(authMiddleware);

router.get('/rules', automationController.getRules);
router.post('/rules', automationController.createRule);
router.put('/rules/:ruleId', automationController.updateRule);
router.delete('/rules/:ruleId', automationController.deleteRule);
router.get('/stats', automationController.getStats);

module.exports = router;

