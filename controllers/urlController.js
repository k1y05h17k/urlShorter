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

  if (!validUrl.isUri(originalUrl)) {
    return next(new AppError('You are not logged in! Please log in to get access!', 401));
  }

  const urlCode = await generateUniqueUrlCode();
  const user = req.user ? req.user._id : null;
  const shortUrl = `${baseUrl}/${urlCode}`;

  // Check if URL already exists in the database
  let url = await Url.findOne({ originalUrl });

  // If the URL is owned by the user, a new short URL will not be created..
  if (url && user) {
    return res.json({      
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl
    });
  }

   // Create a new url object
  const newUrlData = {
    originalUrl,
    shortUrl,
    urlCode,
    clicks: 0,
    user
  }

  const urlCreate = (await Url.create(newUrlData));

  res.status(201).json({
    status: 'success',
    data: {
      originalUrl: urlCreate.originalUrl,
      shortUrl: urlCreate.shortUrl
    }
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
  const newUrl = req.body.originalUrl;
  const urlData = await Url.findOneAndUpdate({ urlCode: urlCode },
    {
      originalUrl: newUrl,
      updateAt: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      originalUrl: urlData.originalUrl,
      shortUrl: urlData.shortUrl,
      clicks:urlData.clicks,
      createAt:urlData.createAt,
      updateAt: urlData.updateAt
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