const Product = require('../models/Product')

exports.list = async (req, res) => {
  const products = await Product.find()
  res.json(products)
}

exports.get = async (req, res) => {
  const p = await Product.findById(req.params.id)
  if (!p) return res.status(404).json({ message: 'not found' })
  res.json(p)
}

exports.create = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body
    if (!name || price == null || stock == null) return res.status(400).json({ message: 'missing fields' })
    const p = await Product.create({ name, price, stock, description })
    res.status(201).json(p)
  } catch (e) {
    res.status(500).json({ message: 'server error' })
  }
}

exports.update = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!p) return res.status(404).json({ message: 'not found' })
  res.json(p)
}

exports.remove = async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id)
  if (!p) return res.status(404).json({ message: 'not found' })
  res.json({ message: 'deleted' })
}
