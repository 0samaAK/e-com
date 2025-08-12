const express = require('express')
const dotenv = require('dotenv')
const { protectRoute, adminRoute } = require('../middleware.js/authMiddleware')
const { getAnalyticsData, getDailySalesData } = require('../controllers/analyticsControllers')
const { p } = require('framer-motion/client')
dotenv.config()

const router = express.Router()

router.get('/analytics',protectRoute, adminRoute, async (req, res) => {

    const pad = (num) => String(num).padStart(2, '0')
        
    const formatDateLocal = (date) => {
        
        return `${ date.getFullYear() }-${ pad(date.getMonth() + 1) }-${ pad(date.getDate()) }`
        
    }

    try {
        
        const analyticsData = await getAnalyticsData()
		const endDate = new Date()
    	const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
	
        const startdate = formatDateLocal(startDate)
        const enddate = formatDateLocal(endDate)
        
        const dailySalesData = await getDailySalesData(startdate, enddate)
		res.status(200).json({ analyticsData, dailySalesData, })

    } catch (error) {

        res.status(500).json({ message: "Server error", error: error.message})
    
    }
})

module.exports = router