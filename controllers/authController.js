const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

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
            Date.now() + process.env.JWT.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res.cookie('jwt',token, cookieOptions);

    res.staus(statusCode).json({
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

exports.signup = catchAsync(async(req, res, next) =>{
    
    const {email, password} = req.body;

    // check if email || password exists
    if(!email || !password){
        return next(new AppError('Please provide email and password!', 400));
    };

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    // IF Wrong User or Invalid Password show this error 401
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorret email or password', 401));
    }

    createSendToken(user, 200, res);
})