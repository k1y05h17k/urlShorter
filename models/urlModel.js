const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({

    urlOriginal:{
        type:String,
        required:[true, 'Please inform a url to shorten']
    },
    urlShorten:{
        type: String
    },

    clicks:{
        type: Number,
        default: 0
    },

    createAt:{
        type:Date,
        default: Date.now
    },

    deleteAt:{
        type: Date,
        // default: Date.now
    }

});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;