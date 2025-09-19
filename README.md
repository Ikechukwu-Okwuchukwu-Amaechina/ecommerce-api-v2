# ecommerce-api-v2

Minimal e‑commerce REST API with auth, products, cart, orders, and admin order management.

## Setup

1) Create .env

PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecomm
JWT_SECRET=changeme

2) Install and run

```bash
npm install
npm run dev
```

## Features

- Auth (JWT)
- Products CRUD
- Cart add/view/remove
- Orders checkout (start/confirm), list, get
- Admin: list orders, update fulfillment status
- Security: helmet, rate-limit on auth, mongo sanitize
- Simple input checks (no Joi)

## Endpoints

All routes available both with and without /api prefix.

- Auth
  - POST /auth/signup
  - POST /auth/login
- Products
  - GET /products
  - GET /products/:id
  - POST /products (auth)
  - PATCH /products/:id (auth)
  - DELETE /products/:id (auth)
- Cart (auth)
  - GET /cart
  - POST /cart/add
  - DELETE /cart/remove/:id
- Orders (auth)
  - POST /orders/checkout – body.stage: start | confirm
  - GET /orders
  - GET /orders/:id
- Admin (auth + admin)
  - GET /admin/orders
  - PATCH /admin/orders/:id/status – body.status: pending|shipped|delivered

## Examples

Signup
Request: { "email": "a@b.com", "password": "pass1234" }
Response: { "token": "..." }

Create product
Headers: Authorization: Bearer <token>
Body: { "name": "P1", "price": 10, "stock": 5, "description": "d" }
Response: 201 + product

Checkout
1) POST /orders/checkout { "stage": "start" } -> { orderId, total }
2) POST /orders/checkout { "stage": "confirm", "orderId": "..." } -> { message, orderId }

## Tech

Node.js, Express, Mongoose, JWT, helmet, express-rate-limit, express-mongo-sanitize, morgan
