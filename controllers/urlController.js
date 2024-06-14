const Url = require('./../models/urlModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
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
        return next(new AppError('Invalid base URL or Original URL', 401));
        
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

// Redirect URL when access with you shortURL e count a click 
exports.redirectUrl = catchAsync(async(req, res) => {
    const url = await Url.findOneAndUpdate(
        {urlCode: req.params.code},
        {$inc:{click:1}},   
        {new:true}    
    );
    
    return url ? res.redirect(url.longUrl) : next(new AppError('No URL found', 404));
});


// Delete add date of 
exports.deleteUrl = catchAsync(async (req, res, next) => {
    await Url.findByIdAndUpdate(req.url.id, { deleteAt: Date.now });

    res.status(204).json({
        staus: 'success',
        data: null
    });
});

