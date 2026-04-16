const express = require('express');
const router = express.Router();
const suggestController = require('../controllers/suggestController');

router.post('/', suggestController.generateSuggestions);

module.exports = router;
