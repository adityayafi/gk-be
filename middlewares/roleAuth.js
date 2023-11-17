const roleAuth = (req, res, next) => {
  if (req.user.role !== 'admin'){
    return res.json({
      code: 401,
      message: 'Access denied, you must be an admin'
    })
  }

  next()
}

module.exports = roleAuth