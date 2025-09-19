const router = require('express').Router()
const ctrl = require('../controllers/productController')
const { auth } = require('../middleware/auth')
const { validate, productCreateSchema, productUpdateSchema } = require('../middleware/validators')

router.get('/', ctrl.list)
router.get('/:id', ctrl.get)
router.post('/', auth, validate(productCreateSchema), ctrl.create)
router.patch('/:id', auth, validate(productUpdateSchema), ctrl.update)
router.delete('/:id', auth, ctrl.remove)

module.exports = router
