require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { connectDB } = require('./config/db')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(mongoSanitize())
app.use(morgan('dev'))

app.get('/api', (req, res) => res.json({ status: 'ok' }))

const authRouter = require('./routes/authRoutes')
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
// with /api prefix
app.use('/api/auth', limiter, authRouter)
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
// unprefixed for compatibility/tests
app.use('/auth', limiter, authRouter)
app.use('/products', require('./routes/productRoutes'))
app.use('/cart', require('./routes/cartRoutes'))
app.use('/orders', require('./routes/orderRoutes'))
app.use('/admin', require('./routes/adminRoutes'))

app.use((req, res) => res.status(404).json({ message: 'route not found' }))

if (require.main === module) {
  const port = process.env.PORT || 3000
  connectDB().then(() => {
    app.listen(port, () => console.log(`server running on ${port}`))
  }).catch((e) => {
    console.error('DB connection error', e)
    process.exit(1)
  })
}

module.exports = app
