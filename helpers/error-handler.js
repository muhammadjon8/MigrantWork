const errorHandler = (res, err) => {
  res.status(400).json({
    error: `Xatolik: ${err}`,
  });
};


module.exports = { errorHandler };
