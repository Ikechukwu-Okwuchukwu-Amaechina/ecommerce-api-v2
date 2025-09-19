const request = require('supertest')
const app = require('..')

const signup = async () => {
  const email = `u${Date.now()}@t.com`
  const res = await request(app).post('/auth/signup').send({ email, password: 'pass1234' })
  return res.body.token
}

const createProduct = async (token, overrides = {}) => {
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'P1', price: 10, stock: 3, description: 'd', ...overrides })
  return res.body
}

describe('Cart and Orders', () => {
  it('add to cart, view, remove, checkout success path', async () => {
    const token = await signup()
    const p = await createProduct(token, { stock: 5, price: 7 })

    const add1 = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: p._id, quantity: 2 })
    expect(add1.status).toBe(201)

    const cart = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`)
    expect(cart.status).toBe(200)
    expect(cart.body.items.length).toBe(1)

    const start = await request(app)
      .post('/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ stage: 'start' })
    expect(start.status).toBe(201)

    // Force payment success by monkey patching
    jest.spyOn(require('../utils/payment'), 'simulatePayment').mockResolvedValue({ success: true, amount: start.body.total })

    const confirm = await request(app)
      .post('/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ stage: 'confirm', orderId: start.body.orderId })
    expect(confirm.status).toBe(200)

    const list = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${token}`)
    expect(list.status).toBe(200)

    const orders = list.body
    const get = await request(app)
      .get(`/orders/${orders[0]._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(get.status).toBe(200)

    const cart2 = await request(app)
      .get('/cart')
      .set('Authorization', `Bearer ${token}`)
    expect(cart2.body.items.length).toBe(0)
  })

  it('prevent adding beyond stock', async () => {
    const token = await signup()
    const p = await createProduct(token, { stock: 2 })

    const add1 = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: p._id, quantity: 2 })
    expect(add1.status).toBe(201)

    const add2 = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: p._id, quantity: 1 })
    expect(add2.status).toBe(400)
  })
})
