const Url = require('./../models/urlModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const validUrl = require('valid-url');
const shortid = require('shortid');
const dotenv = require('dotenv');


dotenv.config();

// GET URL of dotenv
const baseUrl = process.env.BASE_URL;

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

  // Check this original url is valid

  if (![originalUrl].every(validUrl.isUri)) {
    return next(new AppError('You are not logged in! Please log in to get access!', 401));
  }

  let url = await Url.findOne({ originalUrl });

  if (url) {
    return res.json(url);
  }
  const urlCode = await generateUniqueUrlCode();
  const user = req.user ? req.user._id : null;
  const shortUrl = `${baseUrl}/${urlCode}`;

  // Create a new url object
  const newUrlData = {
    originalUrl,
    shortUrl,
    urlCode,
    clicks: 0,
    user
  }

  const urlCreate = await Url.create(newUrlData);

  res.status(201).json({
    status: 'success',
    data: urlCreate
  })
});

// Redirect URL when access with you shortURL e count a click 
exports.redirectUrl = catchAsync(async (req, res, next) => {
  const code = req.params.urlCode;

  const url = await Url.findOneAndUpdate(
    { urlCode: urlCode },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!url) {
    return next(new AppError('No URL found', 404));
  }

  // Redirect to original URL 
  return res.redirect(url.originalUrl);

});

// Update only originalUrl in the request
exports.updateUrl = catchAsync(async (req, res, next) => {
  const urlCode = req.params.urlCode;
  const originalUrl = req.body.originalUrl;
  const urlData = await Url.findOneAndUpdate({ urlCode: urlCode },
    {
      originalUrl: originalUrl,
      updateAt: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  ).select('-__v -shortUrl -user +updateAt');

  res.status(200).json({
    status: 'success',
    data: {
      url: urlData
    }
  })
})


// Delete, this rules mark url with deleted true updated deleteAt to current date
exports.deleteUrl = catchAsync(async (req, res, next) => {
  const urlCode = req.params.urlCode
  await Url.findOneAndUpdate({ urlCode: urlCode },
    { deleteAt: Date.now() },
    {
      new: true,
      runValidators: true
    });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUrls = catchAsync(async (req, res) => {
  let user;
  try {
    user = Object(req.user._id)
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: 'Invalid user ID format' });
  }
  const urlData = await Url.find({ user: user }).select('-_id -__v -user');

  res.status(200).json({
    status: 'success',
    results: urlData.length,
    data: {
      urlData
    }
  });
});