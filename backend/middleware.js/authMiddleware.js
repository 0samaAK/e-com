const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const protectRoute = (req, res, next) => {

    try {

        const token = req.cookies.token

        if (!token) {
            
            return res.status(401).json({ message: 'Unauthorized' })
            
        } else {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            next()

        }

    } catch (error) {
        
        return res.status(500).json({ message: 'Middleware Server Error' })

    }

}

const adminRoute = (req, res, next) => {

    try {
        
        const token = req.cookies.token
        
        if (!token) {
            
            return res.status(401).json({ message: 'Unauthorized' })
            
        } else {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (decoded.role === 'admin') {
                next()

            } else {

                return res.status(403).json({ message: 'access denied Admin Only' })

            }
            
        }
        
    } catch (error) {
        
        return res.status(500).json({ message: 'Middleware Server Error' })
        
    }
}

module.exports = { protectRoute, adminRoute }