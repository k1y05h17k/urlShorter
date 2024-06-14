const User = require('../models/urlModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')


exports.createUser = (req, res)=>{
    res.status(500).json({
        staus:'error',
        message:'This route is not yet defined'
    });
};

exports.getUser = factory.getOne(User);
// exports.getAllUsers = factory.getAll(User);

// Do NOT update password with this!
// exports.updateOne = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);