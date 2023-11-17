module.exports = function (req, res, next) {
  const message = {}
  message.success = true;
  message.status = req.responseStatus || 200;
  message.body = req.responseObject;
  res.status(message.status).send(message);
  return next();
}