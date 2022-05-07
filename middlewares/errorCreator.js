const createError = require('http-errors');

module.exports.errorCreator = (req, res, next) => {
  const error = createError(
    404,
    'No Page Found',
  );
  next(error);
};
