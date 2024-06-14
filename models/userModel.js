const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
          // This only works on CREATE and SAVE!!!
        validator: function(el) {
            return el === this.password;
        },
            message: 'Passwords are not the same!'
    }

});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };


const User = mongoose.model('User', userSchema);

module.exports = User;