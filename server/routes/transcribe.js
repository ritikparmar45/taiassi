const express = require('express');
const router = express.Router();
const multer = require('multer');
const transcribeController = require('../controllers/transcribeController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('audio'), transcribeController.transcribeAudio);

module.exports = router;
