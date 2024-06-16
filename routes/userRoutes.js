const express = require('express');
const userController = require('./../controllers/userController');
const authController =require('./../controllers/authController');

const router = express.Router();
router.use(authController.protect);
router.route('/:id').get(userController.getUser)

module.exports = router;