const express = require('express')
const { protectRoute } = require('../middleware.js/authMiddleware')
const { createCheckoutSession, checkoutSuccess } = require('../controllers/paymentControllers')

const router = express.Router()

router.post('/create-checkout-session', protectRoute, createCheckoutSession)
router.post('/checkout-success', protectRoute, checkoutSuccess)

module.exports = router