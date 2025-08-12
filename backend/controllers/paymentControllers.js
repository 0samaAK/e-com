const express = require('express')
const db = require('../config/db')
const stripe = require('../config/stripe')
const { a } = require('framer-motion/client')

const createCheckoutSession = async(req, res) => {
    try {
        const { products, couponCode } = req.body
        const userid = req.user?.id
        
        if (!Array.isArray(products) || products.length === 0) {
        
            return res.status(400).json({ message: 'Invalid or empty products array' })
        
        }
        
        let totalAmount = 0
        const lineItems = products.map((product) => {
        
            const amount = Math.round(product.price * 100)
            totalAmount += amount * product.quantity
        
            return {
        
                price_data: {
        
                    currency:'usd',
                    product_data: {
        
                        name: product.name,
                        images: [ product.imageUrl ],
        
                    },
        
                    unit_amount: amount
        
                },
        
                quantity: product.quantity || 1
        
            }
        
        })        
        
        // let coupon = null
        // if (couponCode) {
        //     coupon = await db.query('SELECT * FROM coupons WHERE code = ? AND userid = ? AND isActive = 1 LIMIT = 1', [ couponCode, userId || userid ])
        //     if (coupon[0].length > 0) {
        //         totalAmount = Math.round(totalAmount * (1 - coupon.discountPercentage / 100))
        //     }
        // }
        
        const session = await stripe.checkout.sessions.create({
        
            payment_method_types: [ 'card' ],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/cancel',
        
            // discounts: coupon ?
            // [
            //     {
            //         coupon: await createStripeCoupon(coupon.discountPercentage),
            //     },
            // ] : [],
        
            metadata: {
        
                userId: req.body.id || userid,
                couponCode: couponCode || '',
                products: JSON.stringify(
        
                    products.map((product) => ({
        
                        id: product.id,
                        quantity: product.quantity,
                        price: product.price,
        
                    }))
        
                )
        
            }
        
        })
        
        // if (totalAmount >= 20000) {  
        //     const newcoupon = await createNewCoupon(userId || userid)
        // }
        
        return res.status(200).json({ message: 'session',  id: session.id, totalAmount: totalAmount / 100 })
    
    } catch (error) {
    
        return res.status(500).json({ message: 'Server Error' })
    
    }

}

const createStripeCoupon = async(discountPercentage) => {

    const coupon = await stripe.coupons.create({

        percent_off: discountPercentage,
        duration: 'once',

    })

    return coupon.id

}

const createNewCoupon = async(userId) => {

    const newCoupon = new Coupon({

        code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId

    })

    const data = await db.query('UPDATE coupons SET code = ? WHERE user_id = ?', [ newCoupon, userId ])
    return newCoupon

}

const checkoutSuccess = async (req, res) => {
    
    try {
        
        const { sessionId } = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        // if (session.payment_status === 'paid') {
            
        //     if (session.metadata.couponCode) {
                
        //         const coupon = await db.query('UPDATE coupons SET isActive = 0 WHERE code = ? AND user_id = ?', [ session.metadata.couponCode, session.metadata.userId ])

        //     }

        // }

        const products = JSON.parse(session.metadata.products)        
        const order = await db.query("INSERT INTO orders (userid, totalAmount, stripeSessionId) VALUES (?, ?, ?)", [ session.metadata.userId, session.amount_total / 100, sessionId ])
        const orderid = order[0].insertId
        
        products.map(async (product) => {
        
            await db.query("INSERT INTO order_items (orderid, productid, quantity, price) VALUES (?, ?, ?, ?)", [ orderid, product.id, product.quantity, product.price ])
            // const stock = await db.query("SELECT stock FROM products WHERE id = ?", [ product.id ])
            // console.log("Stock:", stock[0])
            // console.log("Stock quantity:", stock[0][0].stock)
            // const newStock = stock[0][0].stock - product.quantity
            // console.log("New stock:", newStock)
            // const updstock = await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [ newStock, product.id ])
            // console.log("Updated stock:", updstock[0])
      
        })

      return res.status(200).json({ message: "Checkout processed successfully" })
    
    } catch (error) {
        
        return res.status(500).json({ message: 'Server Error', error: error.message })

    }

}

module.exports = { createCheckoutSession, checkoutSuccess }