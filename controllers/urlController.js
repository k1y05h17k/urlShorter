const Url = require('./../models/urlModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const validUrl = require('valid-url');
const shortid = require('shortid');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl = process.env.BASE_URL;

exports.getAllUrls = factory.getAll(Url);
exports.getUrl = factory.getOne(Url);
exports.createUrl = factory.createOne(Url);
exports.updateUrl = factory.updateOne(Url);

// Function recursive to generate a unicode para url

const generateUniqueUrlCode = async () => {

    const urlCode = shortid.generate().slice(0, 6);
    const existingUrl = await Url.findOne({ urlCode });

    // If unicode exists, callbak function again.
    if (existingUrl) {

        return generateUniqueUrlCode();
    }
    return urlCode;
}


// Create a new short url
exports.shortenUrl = catchAsync(async (req, res) => {
    const { originalUrl } = req.body;

    // Chek this  base url or original url is valid

    if (!validUrl.isUri(baseUrl) || !validUrl.isUri(originalUrl)) {
        return res.status(401).json('Invalid base URL or Original URL');
    }

    let url = await Url.findOne({ originalUrl });

    if (url) {
        return res.json(url);
    }
    const urlCode = await generateUniqueUrlCode();
    const shortUrl = `${baseUrl}/${urlCode}`;
    url = await new Url({ longUrl, shortUrl, urlCode }).save();

    res.status(200).json({
        status: 'success',
        data: url
    })
});

// Redirect URL when  
exports.redirectUrl = catchAsync(async(req, res) => {
    const url = await Url.findOne({urlCode: req.params.code});
    
    return url ? res.redirect(url.longUrl) : res.status(404).json('No URL found');
});


// Delete add date of 
exports.deleteUrl = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.url.id, { deleteAt: Date.now });

    res.status(204).json({
        staus: 'success',
        data: null
    });
});
