const router = require('express').Router()
const ctrl = require('../controllers/cartController')
const { auth } = require('../middleware/auth')
const { validate, cartAddSchema } = require('../middleware/validators')

router.post('/add', auth, validate(cartAddSchema), ctrl.add)
router.get('/', auth, ctrl.view)
router.delete('/remove/:id', auth, ctrl.remove)

module.exports = router
