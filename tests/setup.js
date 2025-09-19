const { MongoMemoryServer } = require('mongodb-memory-server')
const { connectDB, disconnectDB, mongoose } = require('../config/db')

let mongo

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()
  process.env.JWT_SECRET = 'testsecret'
  await connectDB(process.env.MONGODB_URI)
})

afterAll(async () => {
  await disconnectDB()
  if (mongo) await mongo.stop()
})

afterEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})
