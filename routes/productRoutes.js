const router = require('express').Router()
const ctrl = require('../controllers/productController')
const { auth } = require('../middleware/auth')

router.get('/', ctrl.list)
router.get('/:id', ctrl.get)
router.post('/', auth, ctrl.create)
router.patch('/:id', auth, ctrl.update)
router.delete('/:id', auth, ctrl.remove)

module.exports = router
