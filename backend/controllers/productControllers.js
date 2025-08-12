const express = require('express')
const db = require('../config/db')
const cloudinary = require('../config/cloudinary')

const allProducts = async(req, res) => {

    try {

        const data = await db.query('SELECT * FROM products')
        return res.status(200).send({ message: 'All Products', data: data[0] })

    } catch (error) {

        return res.status(500).send({ message: 'Product Controller Server Error' })

    }
    
}

const featuredProducts = async(req, res) => {

    try {


        const data = await db.query('SELECT * FROM products WHERE isFeatured = ?', [1])
        return res.status(200).json(data[0])
        
    } catch (error) {

        return res.status(500).json({ message: 'Server Error', error: error.message })
        
    }
}

const createProduct = async(req, res) => {

    try {
        
        const { name, description, price, stock, image, category, isFeatured } = req.body
        let cloudinaryResponse = null
        let uploadedImageUrl = ''

        if (image) {
            
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' })
            uploadedImageUrl = cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : ''

        }

        const data  = await db.query('INSERT INTO products (name, description, price, imageUrl, category, isFeatured, stock) VALUES (?, ?, ?, ?, ?, ?, ?)', [ name, description, price, uploadedImageUrl, category, isFeatured ? 1 : 0, stock ])
        res.status(201).json({ message: 'Product added', productId: data[0].insertId });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error while adding product', error: error.message });
        
    }
    
}

const deleteProduct = async(req, res) => {
    
    try {

        const id = req.params.id 
        const data = await db.query('SELECT * FROM products WHERE id = ?', [ id ])

        if(data[0].length === 0) {
            
            return res.status(404).json({ message: "Product not Found" })
            
        }

        const product = data[0][0]
        
        if (product.imageUrl) {
            
            const parts = product.imageUrl.split('/')
            const filename = parts[parts.length - 1]
            const publicId = filename.split('.')[0]
            
            try {

                await cloudinary.uploader.destroy(`products/${ publicId }`)
                
            } catch (error) {
                
                console.erro("Error deleting image from cloudinary", error)
                return res.error('error in deleting image from cloudinary', error)
                
            }
            
        }
        
        const row = await db.query('DELETE FROM products WHERE id = ?', [ id ])
        return res.status(200).json({ message: 'Product deleted successfully' });
        
    } catch (error) {

        console.error("Error in deleteProduct controller", error);
        return res.status(500).json({ message: 'Server error while deleting product' });
        
    }
}

const recommandedProducts = async(req, res) => {

    try {
        
        const data = await db.query('SELECT * FROM products ORDER BY RAND() LIMIT 4')
        return res.status(200).json({ message: 'recommended products', data: data[0] })

    } catch (error) {

        return res.status(500).json({ message: 'Server Error' })
        
    }
    
}

const ProductsByCategory = async(req, res) => {
    
    try {
        
        const { category } = req.params
        const [data] = await db.query('SELECT * FROM products WHERE category = ?', category)
        return res.status(200).json({ message: 'Category products', data: data })

    } catch (error) {
        
        return res.status(500).json({ message: 'Server Error' })
        
    }
    
}

const toggleFeaturedProducts = async(req, res) => {
    
    try {
        
        const id = req.params.id 
        
        const feature = await db.query("SELECT isFeatured FROM products WHERE id = ?", [ id ])
        
        if (feature) {
            
            const data = await db.query('UPDATE products SET isFeatured = ? WHERE id = ?', [ feature[0][0].isFeatured ? 0 : 1, id ] )
            return res.status(200).json({ message: 'Update product featured', data: data[0] })
            
        } else {

            return res.status(404).json({ message: 'Product not found', error: error })

        }

    } catch (error) {
        
        return res.status(500).json({ message: 'Server Error', error: error })

    }

}

const getRecommendedProducts = async (req, res) => {
	
    try {

		const products = await db.query(`SELECT id, name, description, image, price
			FROM products ORDER BY RAND() LIMIT 4`)
            return res.json(products);
	
    } catch (error) {
		
        console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	
    }
};


module.exports = { allProducts, featuredProducts, createProduct, deleteProduct, recommandedProducts, ProductsByCategory, toggleFeaturedProducts, getRecommendedProducts }