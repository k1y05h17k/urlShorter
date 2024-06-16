const express = require('express');
const authController = require('./../controllers/authController');
const urlController = require('./../controllers/urlController');

const router = express.Router({ mergeParams: true })

router.post('/shortenUrl', authController.optionalProtect, urlController.shortenUrl);

router.route('/').get(authController.protect, urlController.getAllUrls)

// Add router protect
router.route('/:urlCode').get(authController.protect, urlController.redirectUrl)
    .patch(authController.protect, urlController.updateUrl)
    .delete(authController.protect, urlController.deleteUrl);

module.exports = router;