const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chatController');

router.post('/generate', processChat);

module.exports = router;