const User = require('./../models/userModel');
const { promisify } = require('util');
// const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

// Validate token send client to auth
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

};

// Function to create a new token for User
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res.cookie('jwt',token, cookieOptions);

    res.status(statusCode).json({
        staus:'sucess',
        token,
        data:{
            user
        }
    });
}

exports.signup = catchAsync(async(req, res, next) =>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201, res);

});

exports.signin = catchAsync(async(req, res, next) =>{
    
    const {email, password} = req.body;

    // Check if email || password exists
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    };

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password -__v');

    // IF Wrong User or Invalid Password show this error 401
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorret email or password', 401));
    }
    // If everything ok, send token to client
    createSendToken(user, 200, res);
});

// Middleware to protect acess with validate Bearer Token
exports.protect = catchAsync(async (req, res, next) =>{
    
    // Getting token and check of it's there
    let token;

    if(
        req.header.authorization && 
        req.header.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access!', 401));
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(
            new AppError('The user belonging to this token does no longer exist', 401)
        );
    }

    // A little validation if user changed password after the token issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(
    //       new AppError('User recently changed password! Please log in again.', 401)
    //     );
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();

});