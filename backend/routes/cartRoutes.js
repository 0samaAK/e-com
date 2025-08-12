const express = require('express')
const { cartProducts, addToCart, removeAllFromCart, updateQuantity, clearCart } = require('../controllers/cartControllers')
const { protectRoute } = require('../middleware.js/authMiddleware')
const router = express.Router()

router.get('/cart', protectRoute, cartProducts)
router.post('/addtocart', protectRoute, addToCart)
router.post('/removeallfromcart', protectRoute, removeAllFromCart)
router.post('/clearcart', protectRoute, clearCart)
router.put('/updateqty/:id', protectRoute, updateQuantity)

module.exports = router