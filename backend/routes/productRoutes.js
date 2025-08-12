const express = require('express')
const { allProducts, featuredProducts, recommandedProducts, createProduct, deleteProduct, ProductsByCategory, toggleFeaturedProducts } = require('../controllers/productControllers')
const { protectRoute, adminRoute } = require('../middleware.js/authMiddleware')

const router = express.Router()

router.get('/products', protectRoute, adminRoute, allProducts)
router.get('/product/featured', featuredProducts)
router.get('/product/category/:category', ProductsByCategory)
router.get('/product/recommended', recommandedProducts)
router.post('/product/create', protectRoute, adminRoute, createProduct)
router.patch('/product/featured/:id', protectRoute, adminRoute, toggleFeaturedProducts)
router.delete('/product/delete/:id', protectRoute, adminRoute, deleteProduct)

module.exports = router