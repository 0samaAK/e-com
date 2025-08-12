import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import React from 'react'
import useUserStore from "../stores/useUserStore"
import { useCartStore } from "../stores/useCartStore"
import toast from "react-hot-toast"

const Navbar = () => {
        
    const { user, logout } = useUserStore()
    const { cart } = useCartStore()

    const currUser = JSON.parse(localStorage.getItem('user'))

    const isAdmin = currUser?.data?.role === 'admin'
    const currIsAdmin = user?.data?.role === 'admin'
    
    const navigate = useNavigate()

    const handleLogout = async(e) => {

        e.preventDefault()
        
        try {

            logout(user)
            localStorage.clear()
            navigate('/login')

        } catch (error) {
            
            return toast.error(error.response.data.message || 'An error occurred')
        
        }
    
    }

    return (
        <header className = "fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-500 border-b border-emerald-800">
            <div className = "container mx-auto px-4 py-3">
                <div className = "flex flex-wrap justify-between items-center">
                    <Link to = { '/' } className = "text-2xl font-bold text-emerald-400 items-center space-x-2 flex">E-Commerce</Link>
                    
                    <nav className = "flex flex-wrap items-center gap-5">
                        <Link to = {'/'} className = "">Home</Link>
                        
                        {

                            (currUser || user) && (

                                <Link to = { '/cart' } className = "relative group">
                                    <ShoppingCart className = "inline-block mr-1 group-hover:text-emerald-400 transition duration-500 ease-in-out" size = { 20 }/>
                                    
                                    <span className = "hidden sm:inline group-hover:text-emerald-400 transition duration-500 ease-in-out">Cart</span>

                                    {

                                        cart.length > 0 && <span className = "absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-500 ease-in-out">{ cart.length }</span>

                                    }
                                    
                                </Link>

                            )

                        }

                        {

                            (currIsAdmin || isAdmin) && (

                                <Link className = "bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-md font-medium transition duration-500 ease-in-out flex items-center" to = { '/dashboard' }>
                                    <Lock className = "inline mr-1" size = { 18 }/>
                                    
                                    <span className = "hidden sm:inline" >Dashboard</span>
                                </Link>

                            )

                        }

                        {

                            (currUser || user) ? (

                                <button className = "bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-500 ease-in-out" onClick = { handleLogout }>
                                    <LogOut size = { 18 }/>
                                    <span className = "hidden sm:inline ml-2">Log Out</span>
                                </button>

                            ) : (

                                <>
                                    <Link className = "bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-500 ease-in-out" to = { '/signup' }>
                                        <UserPlus className = "mr-2" size = { 18 }/>
                                        Sign Up
                                    </Link>

                                    <Link className = "bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-500 ease-in-out" to = { '/login' }>
                                        <LogIn className = "mr-2" size = { 18 }/>
                                        Login
                                    </Link>
                                </>

                            )

                        }

                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar