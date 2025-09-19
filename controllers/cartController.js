const Cart = require('../models/Cart')
const Product = require('../models/Product')

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product')
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

exports.add = async (req, res) => {
  const { productId, quantity } = req.body
  if (!productId || !quantity) return res.status(400).json({ message: 'productId and quantity required' })
  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ message: 'product not found' })

  const qty = Number(quantity)
  if (qty < 1) return res.status(400).json({ message: 'invalid quantity' })

  const cart = await getOrCreateCart(req.user._id)
  const existing = cart.items.find((i) => i.product.equals(product._id))
  const currentQty = existing ? existing.quantity : 0
  if (currentQty + qty > product.stock) return res.status(400).json({ message: 'exceeds stock' })

  if (existing) {
    existing.quantity += qty
  } else {
    cart.items.push({ product: product._id, quantity: qty, priceAtAdd: product.price })
  }
  await cart.save()
  await cart.populate('items.product')
  res.status(201).json(cart)
}

exports.view = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  res.json(cart)
}

exports.remove = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  const { id } = req.params
  const idx = cart.items.findIndex((i) => String(i._id) === id)
  if (idx === -1) return res.status(404).json({ message: 'item not found' })
  cart.items.splice(idx, 1)
  await cart.save()
  await cart.populate('items.product')
  res.json(cart)
}
