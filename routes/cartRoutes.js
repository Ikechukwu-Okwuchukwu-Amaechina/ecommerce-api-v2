const router = require('express').Router()
const ctrl = require('../controllers/cartController')
const { auth } = require('../middleware/auth')

router.post('/add', auth, ctrl.add)
router.get('/', auth, ctrl.view)
router.delete('/remove/:id', auth, ctrl.remove)

module.exports = router
