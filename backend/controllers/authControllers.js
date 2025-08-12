const jwt = require('jsonwebtoken')
const express = require('express')
const db = require('../config/db')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

const getAuth = async(req, res) => {

    try {
        const data = await db.query('SELECT * FROM users')

        return res.status(200).json({ message: "get auth response", data: data[0] })

    } catch (error) {

        return res.status(500).json({ message: "Server Error" })

    }

}

const signup = async(req, res) => {
    
    try {
        
        const { name, email, password } = req.body
        const existUser = await db.query('SELECT * FROM users WHERE email = ?', [ email ])

        if (existUser[0].length > 0) {

            return res.status(400).json({ message: "User Already Created." })

        } else {

            const salt = parseInt(process.env.SALT)
            const hash = await bcrypt.hash(password, salt)
            const newUser = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [ name, email, hash ])

            if (newUser[0].affectedRows > 0) {
                
                return res.status(200).json({ message: "User Created", data: newUser })

            } else {
                
                return res.status(403).json({ message: "Error in signup", data: newUser })

            }

        }

    } catch (error) {

        return res.status(404).json({ message: "Server Error", error: error })

    }
}

const login = async(req, res) => {

    try {
        
        const { email, password } = req.body
        const data = await db.query('SELECT * FROM users WHERE email = ?', [ email ])
    
        if (!data) {

            return res.status(400).send({ message: 'User not exist.' })

        } else {

            const verify = await bcrypt.compare(password, data[0][0].password)
            const  { id, name, email, role } = data[0][0]
            const token = jwt.sign({ id, name, email, role }, process.env.JWT_SECRET)

            if (verify) {

                return res.status(200).cookie('token', token, { httpOnly: true }).send({ message: 'user login', data: { id, name, email, role }, token: token })

            } else {

                return res.status(403).send({ message: 'Error in encryption' }) 

            }

        }

    } catch (error) {

        return res.status(500).json({ message: "Server Error", error: error })

    }

}

const logout = (req, res) => {

    try {

        const token = req.cookies.token
        
        if (token) {

            const decode = jwt.verify(token, process.env.JWT_SECRET)
            return res.status(200).clearCookie('token', { httpOnly: true }).json({ message: "logged out" })

        } else {

            return res.status(403).json({ message: "Token is invalid" })
            
        }

    } catch (error) {

        return res.status(500).json({ message: "Server Error" })

    }
}

const getProfile = (req, res) => {

    try {

        const token = req.cookies.accesstoken
        
        if (token) {

            const decode = jwt.verify(token, process.env.JWT_SECRET)
            return res.status(200).json({ message: 'Profile', data: decode })
            
        } else {

            return res.status(403).json({ message: "Token is invalid" })
            
        }


    } catch (error) {

        return res.status(500).json({ message: "Server Error" })

    }
}

module.exports = { getAuth, signup, login, logout, getProfile }