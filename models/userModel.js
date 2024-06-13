const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Please tell us your name']
    },

    email:{
        type: String,
        required:[true, 'Please provide your email'],
        unique:true,
        lowercase:true
    },
    
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        monLength: 7,
        select: false
    },

    passwordConfirm: {
        type: String,
        require: [true, 'Confirm your password'],
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;