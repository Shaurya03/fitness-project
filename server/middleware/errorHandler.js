const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Something went wrong",
    emptyFields: err.emptyFields || []
  });
};

module.exports = errorHandler;