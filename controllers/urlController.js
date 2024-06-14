const Url = require('./../models/urlModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const validUrl = require('valid-url');
const shortid = require('shortid');
const dotenv = require('dotenv');


dotenv.config();

const baseUrl = process.env.BASE_URL;

// exports.getAllUrls = factory.getAll(Url);
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
exports.shortenUrl = catchAsync(async (req, res,next) => {
    const { originalUrl } = req.body;

    console.log('Base URL:', baseUrl);
    console.log('Long URL:', originalUrl)
    // Chek this  base url or original url is valid

    // if (![baseUrl, originalUrl].every(validUrl.isUri)) {
    //     return next(new AppError('You are not logged in! Please log in to get access!', 401));
    //   }

    let url = await Url.findOne({ originalUrl });

    if (url) {
        return res.json(url);
    }
    const urlCode = await generateUniqueUrlCode();
    const shortUrl = `${baseUrl}/${urlCode}`;
    url = await new Url({ originalUrl, shortUrl, urlCode }).save();

    res.status(200).json({
        status: 'success',
        data: url
    })
});

// Redirect URL when access with you shortURL e count a click 
exports.redirectUrl = catchAsync(async(req, res, next) => {
   
    const url = await Url.findOne(
        {urlCode: req.params.code}
        // {$inc:{click:1}},   
        // {new:true}    
    );

    console.log(req.params.code);
    return url ? res.redirect(url.originalUrl) : next(new AppError('No URL found', 404));
});


// Delete add date of 
exports.deleteUrl = catchAsync(async (req, res, next) => {
    await Url.findByIdAndUpdate(req.url.id, { deleteAt: Date.now });

    res.status(204).json({
        staus: 'success',
        data: null
    });
});

