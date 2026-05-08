const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', {
    expiresIn: '1d',
  })
}

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password) return res.status(400).json({ message: 'email and password required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'email already used' })
    const user = await User.create({ email, password, role })
    const token = signToken(user)
    res.status(201).json({ token })
  } catch (e) {
    res.status(500).json({ message: 'server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'email and password required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'invalid credentials' })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(400).json({ message: 'invalid credentials' })
    const token = signToken(user)
    res.json({ token })
  } catch (e) {
    res.status(500).json({ message: 'server error' })
  }
}
