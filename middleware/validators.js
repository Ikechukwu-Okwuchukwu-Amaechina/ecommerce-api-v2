const Joi = require('joi')

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
  if (error) return res.status(400).json({ message: 'validation error', details: error.details.map(d => d.message) })
  req.body = value
  next()
}

const productCreateSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().max(1000).allow('', null),
})

const productUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(1000).allow('', null),
}).min(1)

const cartAddSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
})

module.exports = { validate, productCreateSchema, productUpdateSchema, cartAddSchema }
