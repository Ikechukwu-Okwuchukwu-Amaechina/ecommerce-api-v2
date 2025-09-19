const request = require('supertest')
const app = require('..')

describe('Auth', () => {
  it('signup and login returns token', async () => {
    const email = 'a@test.com'
    const password = 'pass1234'

    const sg = await request(app).post('/auth/signup').send({ email, password })
    expect(sg.status).toBe(201)
    expect(sg.body.token).toBeTruthy()

    const lg = await request(app).post('/auth/login').send({ email, password })
    expect(lg.status).toBe(200)
    expect(lg.body.token).toBeTruthy()
  })
})
