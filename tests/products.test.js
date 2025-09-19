const request = require('supertest')
const app = require('..')

const signup = async () => {
  const email = `u${Date.now()}@t.com`
  const res = await request(app).post('/auth/signup').send({ email, password: 'pass1234' })
  return res.body.token
}

describe('Products', () => {
  it('create, list, get, update, delete', async () => {
    const token = await signup()

    const created = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'P1', price: 10, stock: 5, description: 'd' })
    expect(created.status).toBe(201)

    const list = await request(app).get('/products')
    expect(list.status).toBe(200)
    expect(list.body.length).toBe(1)

    const id = created.body._id
    const get = await request(app).get(`/products/${id}`)
    expect(get.status).toBe(200)

    const upd = await request(app)
      .patch(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 12 })
    expect(upd.status).toBe(200)

    const del = await request(app)
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(del.status).toBe(200)
  })
})
