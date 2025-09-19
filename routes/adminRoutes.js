const router = require('express').Router()
const { auth } = require('../middleware/auth')
const roleCheck = require('../middleware/roleCheck')
const ctrl = require('../controllers/adminOrderController')

router.get('/orders', auth, roleCheck('admin'), ctrl.listAll)
router.patch('/orders/:id/status', auth, roleCheck('admin'), ctrl.updateStatus)

module.exports = router
