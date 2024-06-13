const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({

    user:{
        type: Mongoose.Schema.ObjectId,
        ref: 'User'
    },
    url:{
        type: Mongoose.Schema.ObjectId,
        ref:'Url'
    },
    createAt:{
        type: Date,
        default: Date.now
    }
    
});

const History = mongoose.model('History', historySchema);
module.exports = History;