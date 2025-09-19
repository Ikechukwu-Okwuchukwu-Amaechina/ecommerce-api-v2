const Order = require('../models/Order')

exports.listAll = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
}

exports.updateStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['pending', 'shipped', 'delivered']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'invalid status' })

  const order = await Order.findById(id)
  if (!order) return res.status(404).json({ message: 'not found' })

  order.fulfillmentStatus = status
  await order.save()
  res.json(order)
}
