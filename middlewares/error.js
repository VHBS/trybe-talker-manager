const errorMiddleware = (err, _req, res, _next) => {
  res.status(400).json({ message: err.message });
};

module.exports = errorMiddleware;