const { Schema, model, Types } = require('mongoose')

const cartItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true, min: 0 },
  },
  { _id: true }
)

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', unique: true, required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
)

module.exports = model('Cart', cartSchema)
