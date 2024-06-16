const express = require('express');
const userController = require('./../controllers/userController');
const authController =require('./../controllers/authController');

const router = express.Router();

router.route('/:id').get(userController.getUser)
// Protect all routes after this middleware
router.use(authController.protect);

// router.get('/me',userController.getMe, userController.getUser);

module.exports = router;