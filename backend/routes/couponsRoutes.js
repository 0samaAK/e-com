const express = require('express')
const { getCoupons, validateCoupon } = require('../controllers/couponsControllers')
const { protectRoute } = require('../middleware.js/authMiddleware')
const router = express.Router()

router.get('/coupons', protectRoute, getCoupons)
router.post('/validate', protectRoute, validateCoupon)

module.exports = router