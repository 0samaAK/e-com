const express = require('express')
const db = require('../config/db')


const getCoupons = async(req, res) => {
    
    try {

        const userid = req.user?.id

        if (!userid) {

            return res.status(400).json({ message: 'User ID is required' })

        }

        const coupon =  await db.query('SELECT * FROM coupons WHERE userid = ? AND isActive = 1', [ userid ])

        if (coupon[0].length > 0) {

            return res.status(200).json({ message: 'Coupon Items', data: coupon[0] })
            
        } else {

            return res.status(404).json({ message: 'Coupon not found' })
            
        }

    } catch (error) {

        return res.status(500).json({ message: 'Server Error' })

    }
    
}

const validateCoupon = async(req, res) => {
    
    try {

        const { code } = req.body
        const userid = req.user?.id
        const product = await db.query('SELECT * FROM coupons WHERE code = ? AND userid = ? AND isActive = 1', [ code, userid ])
        
        if (product[0].length === 0) {

            return res.status(404).json({ message: 'Coupon  not found' })

        }

        const now = new Date()
        
        if (new Date(product[0].expirationDate) < now) {
            
            const expire = await db.query('UPDATE coupons SET isActive = 0 WHERE id = ?', [ product[0].id ])
            return res.status(404).json({ message: 'coupon expire' })

        }

        return res.status(200).json({ message: 'Coupon is valid', code: product[0].code, discountPercentage: product[0].discountPercentage })
        
    } catch (error) {

        return res.status(500).json({ message: 'Server Error' })
        
    }
    
}

module.exports = { getCoupons, validateCoupon }