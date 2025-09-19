const mongoose = require('mongoose')

const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGODB_URI not set')
  mongoose.set('strictQuery', true)
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || undefined,
  })
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

module.exports = { mongoose, connectDB, disconnectDB }
