const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const couponRoutes = require('./routes/couponsRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const cartRoutes = require('./routes/cartRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())

app.use('/api', authRoutes, productRoutes, couponRoutes, analyticsRoutes, cartRoutes, paymentRoutes)

app.listen(PORT, () => {
    console.log("Server Running on port: ", PORT)
})
