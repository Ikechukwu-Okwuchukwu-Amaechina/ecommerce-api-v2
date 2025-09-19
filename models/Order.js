const { Schema, model, Types } = require('mongoose')

const orderItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number,
  },
  { _id: true }
)

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true }
)

module.exports = model('Order', orderSchema)
