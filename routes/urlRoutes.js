const express = require('express');
const authController = require('./../controllers/authController');
const urlController = require('./../controllers/urlController');

const router = express.Router();

router.post('/shortenUrl',urlController.shortenUrl);

router.get('/:code',urlController.redirectUrl);

router.route('/:id').get(urlController.getUrl)


module.exports = router