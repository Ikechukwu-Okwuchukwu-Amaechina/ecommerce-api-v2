const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    const user = await User.findById(payload.id).select('-password')
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
  next()
}

module.exports = { auth, requireRole }
