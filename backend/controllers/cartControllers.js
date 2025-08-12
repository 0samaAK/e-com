const express = require('express')
const db = require('../config/db')


const cartProducts = async(req, res) => {
    
    try {

        const userid = req.user.id
        const products =  await db.query('SELECT productid FROM cart_items WHERE userid = ?', [ userid ])
        
        const cartProducts = await Promise.all(
            products[0].map(async(product) => {
                data = await db.query('SELECT p.*, c.quantity FROM products AS p LEFT JOIN cart_items AS c ON c.productid = p.id WHERE p.id = ?', [ product.productid ])
                return data[0][0]
            })
        )
        
        return res.status(200).json({ message: 'Cart Items', data: cartProducts })
        
    } catch (error) {
        
        return res.status(500).json({ message: 'Server Error', error })

    }
    
}

const addToCart = async(req, res) => {
    
    try {
    
        const { productid, quantity } = req.body
        const userid = req.user.id
        const product = await db.query('SELECT stock FROM products WHERE id = ?', [ productid ])
    
        if (product[0].length === 0) {
    
            return res.status(404).json({ message: 'product not found' })
    
        }
    
        const availableStock = product[0][0].stock
    
        if (quantity > availableStock) {
    
            return res.status(400).json({ message: `Only ${ availableStock } items in stock` })
    
        }
    
        let cartid
        let cart = await db.query('SELECT * FROM cart_items WHERE userid = ?', [ userid ])
    
        if (cart[0].length === 0) {

            const createCart = await db.query('INSERT INTO cart_items (userid, productid, quantity) VALUES (?,?,?)', [ userid, productid, quantity ])
            cartid = createCart[0].insertId
        
        } else {
        
            cartid = cart[0][0].id
        
        }
        
        const items = await db.query('SELECT * FROM cart_items WHERE userid = ? AND productid = ?', [ userid, productid ])
        
        if (items[0].length > 0) {
            const newQuantity = items[0][0].quantity + quantity
        
            if (newQuantity > availableStock) {
        
                return res.status(400).json({ message: `Cannot exceed available stock (${ availableStock })` })
        
            }
        
            await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [ newQuantity, items[0][0].id ])
        
        } else {
        
            await db.query('INSERT INTO cart_items (userid, productid, quantity) VALUES (?, ?, ?)', [ userid, productid, quantity ])
        
        }
        
        return res.status(200).json({ message: 'product added to cart' })
    
    } catch (error) {
    
        return res.status(500).json({ message: 'Server Error in addToCart', error })
    
    }

}

const removeAllFromCart = async(req, res) => {
    
    try {
        
        const { productId } = req.body
        const userid = req.user.id
        const cart = await db.query('SELECT id FROM cart_items WHERE userid = ?', [ userid ])

        if (cart[0].length === 0) {

            return res.status(404).json({ message: 'Cart not found for user' })
            
        }

        const cartid = cart[0].id
        const cartItems = await db.query('DELETE FROM cart_items WHERE userid = ? AND productid = ?', [ userid, productId ])

        if (cartItems[0].affectedRows === 0) {
            
            return res.status(404).json({ message: 'cart not found' })
            
        } else {
            
            return res.status(200).json({ message: 'cart deleted' })
            
        }

    } catch (error) {
        
        return res.status(500).json({ message: 'Server Error' })
        
    }
    
    return res.status(200).json({ message: 'Items removed from cart' })
}

const updateQuantity = async(req, res) => {
    
    try {
        
        const productid = req.params.id
        const { quantity } = req.body
        const userid = req.user.id
        
        const cart = await db.query('SELECT id FROM cart_items WHERE userid = ? ', [ userid ])
        let cartid = cart[0].id

        if (quantity === 0) {

            const data = await db.query('DELETE FROM cart_items WHERE id = ? AND productid = ?', [ cartid, productid ])
            return res.status(200).json({ message: 'item deleted from cart' })

        } else {
            
            const data = await db.query('UPDATE cart_items SET quantity = ? WHERE userid = ? AND productid = ?', [ quantity, userid, productid ])
            return res.status(200).json({ message: 'quantity updated', data: data[0] })

        }

    } catch (error) {

        return res.status(500).json({ message: 'Server Error' })
        
    }
    
}

const clearCart = async(req, res) => {
    
    try {
        
        const userid = req.user.id
        const cart = await db.query('DELETE FROM cart_items WHERE userid = ?', [ userid ])
        
        if (cart[0].affectedRows > 0) {
        
            return res.status(200).json({ message: 'Cart cleared successfully' })
        
        } else {
        
            return res.status(404).json({ message: 'No items found in cart' })
        
        }
        
    } catch (error) {

        return res.status(500).json({ message: 'Server Error' })
        
    }
    
}

module.exports = { cartProducts, addToCart, removeAllFromCart, updateQuantity, clearCart }