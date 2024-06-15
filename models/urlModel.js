const mongoose = require('mongoose');
const shortid = require("shortid");

const urlSchema = new mongoose.Schema({

    urlCode: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate,
    },

    originalUrl: {
        type: String,
        required: [true, 'Please inform a url to shorten']
    },
    shortUrl: {
        type: String
    },

    clicks: {
        type: Number,
        default: 0
    },

    createAt: {
        type: Date,
        default: Date.now
    },

    deleteAt: {
        type: Date,
        default: null
    }

});

// Middleware to filter url diferents of NULL
// urlSchema.pre(/^find/, function (next) {
//     // this points to the current query
//     this.find({ deleteAt: { $ne: null } });
//     next();
// });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;