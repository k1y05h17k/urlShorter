// This middleware handles async errors without the need for 'try-catch' blocks.

module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  