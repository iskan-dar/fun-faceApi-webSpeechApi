module.exports.errorHandler = (err, req, res, next) => {
  res
    .status(err.status ?? 500)
    .render('error', { error: err });
};
