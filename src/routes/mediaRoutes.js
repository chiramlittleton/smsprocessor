const express = require('express');
const { uploadMedia, getMedia } = require('../controllers/mediaController');

const router = express.Router();

router.post('/:id/media', uploadMedia);
router.get('/:id/media', getMedia);

module.exports = router;
