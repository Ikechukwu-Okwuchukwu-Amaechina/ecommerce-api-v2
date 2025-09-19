require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { connectDB } = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))

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
