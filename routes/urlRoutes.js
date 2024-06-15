const express = require('express');
const authController = require('./../controllers/authController');
const urlController = require('./../controllers/urlController');

const router = express.Router();

router.post('/shortenUrl',authController.optionalProtect,urlController.shortenUrl);

router.route('/').get(urlController.getAll)

router.route('/:code').get(urlController.redirectUrl)
                    .patch(urlController.updateUrl)
                    .delete(urlController.deleteUrl);
                    
module.exports = router