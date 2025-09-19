const router = require('express').Router()
const ctrl = require('../controllers/orderController')
const { auth } = require('../middleware/auth')

router.post('/checkout', auth, ctrl.checkout)
router.get('/', auth, ctrl.list)
router.get('/:id', auth, ctrl.get)

module.exports = router
