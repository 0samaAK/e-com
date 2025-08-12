const express = require('express')
const { getAuth, login, signup, logout, getProfile } = require('../controllers/authControllers')
const { protectRoute } = require('../middleware.js/authMiddleware')

const router = express.Router()

router.get('/auth', getAuth)
router.get('/profile', protectRoute, getProfile)

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)


module.exports = router