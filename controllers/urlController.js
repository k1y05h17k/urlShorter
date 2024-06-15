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
// exports.getUrl = factory.getOne(Url);

exports.getAll = async (req, res) => {
  try {
    const urls = await Url.find().select('-__v -_id -urlCode');
    res.status(200).json({
      status: 'success',
      data: {
        urls
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};



// Function recursive to generate a unicode for url

const generateUniqueUrlCode = async () => {

  const urlCode = shortid.generate().slice(0, 6);
  const existingUrl = await Url.findOne({ urlCode });

  // If unicode exists, callbak function again.
  if (existingUrl) {

    return generateUniqueUrlCode();
  }
  return urlCode;
}

// Verify if original url contains http:// or https://

const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// Create a new short url
exports.shortenUrl = catchAsync(async (req, res, next) => {
  let { originalUrl } = req.body;

  // Normalize the original URL
  originalUrl = normalizeUrl(originalUrl);

  // Chek this original url is valid

  if (![originalUrl].every(validUrl.isUri)) {
      return next(new AppError('You are not logged in! Please log in to get access!', 401));
    }

  let url = await Url.findOne({ originalUrl });

  if (url) {
    return res.json(url);
  }
  const urlCode = await generateUniqueUrlCode();
  const shortUrl = `${baseUrl}/${urlCode}`;

  const newUrl = {
          'originalUrl': originalUrl,
          'shortUrl': shortUrl,
          urlCode:urlCode,
          clicks: 0
  }

  if (req.user) {
    url = await new Url.create({ newUrl });
  }
  res.status(200).json({
    status: 'success',
    data: newUrl
  })
});

// Redirect URL when access with you shortURL e count a click 
exports.redirectUrl = catchAsync(async (req, res, next) => {
  const code = req.params.code;

  const url = await Url.findOneAndUpdate(
    { urlCode: code },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  // REVIEW --- Verify this message when I dont find vildate url in DB
  if (!url) {
    return next(new AppError('No URL found', 404));
  }

  // Redirect to original URL 
  return res.redirect(url.originalUrl);

});


// Update only originalUrl

exports.updateUrl = catchAsync(async (req, res, next) =>{
  const code = req.params.code;
  const originalUrl = req.body.originalUrl;
  await Url.findByIdAndUpdate({urlCode: code},
    {originalUrl:originalUrl},
    { new: true,
      runValidators:true
    }
  );

    res.status(200).json({
      status:'success',
      data:{
        
      }
    })
})




// Delete, this rules mark url with deleted true updated deleteAt to current date
exports.deleteUrl = catchAsync(async (req, res, next) => {
  const code = req.params.code
  await Url.findByIdAndUpdate({ urlCode: code },
    { deleteAt: Date.now },
    { new: true });

  res.status(204).json({
    staus: 'success',
    data: null
  });
});

