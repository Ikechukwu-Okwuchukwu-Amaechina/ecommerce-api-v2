const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { simulatePayment } = require('../utils/payment')

exports.checkout = async (req, res) => {
  const { stage } = req.body || {}
  if (!stage || !['start', 'confirm'].includes(stage)) return res.status(400).json({ message: 'invalid stage' })

  if (stage === 'start') {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'cart empty' })

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) return res.status(400).json({ message: 'exceeds stock' })
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
    }))
    const total = items.reduce((a, b) => a + b.subtotal, 0)

    const order = await Order.create({ user: req.user._id, items, total, status: 'pending' })
    return res.status(201).json({ orderId: order._id, total })
  }

  if (stage === 'confirm') {
    const { orderId } = req.body
    if (!orderId) return res.status(400).json({ message: 'orderId required' })
    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'order not found' })
    if (order.status !== 'pending') return res.status(400).json({ message: 'already processed' })

    const payment = await simulatePayment(order.total)
    if (!payment.success) {
      order.status = 'failed'
      await order.save()
      return res.status(402).json({ message: 'payment failed' })
    }

    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
    }

    order.status = 'paid'
    await order.save()

    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } })

    return res.json({ message: 'payment successful', orderId: order._id })
  }
}

exports.list = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
}

exports.get = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'not found' })
  res.json(order)
}
