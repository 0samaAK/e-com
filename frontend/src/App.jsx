import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading'
import Dashboard from './pages/Dashboard'
import useUserStore from './stores/useUserStore'
import Category from './pages/Category'
import Cart from './pages/Cart'
import Success from './pages/Success'
import Cancel from './pages/Cancel'

function App() {

  const { user } = useUserStore()
  const currUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  
  return (
    <BrowserRouter>
      <div className = 'min-h-screen bg-gray-900 text-white relative overflow-hidden'>
        <div className = 'absolute inset-0 overflow-hidden'>
          <div className = 'absolute inset-0 top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_50%,rgba(0,0,0,0.1)_100%)]'/>
        </div>
        <div className = 'relative z-50 pt-20'>
          <Navbar/>        
          <Routes>
            <Route path = '/dashboard' element = {  (currUser?.data?.role || user?.data?.role) === 'admin' ? <Dashboard/> : <Navigate to = { '/login' }/> }/>
            <Route path = '/' element = { <Home/> }/>
            <Route path = '/signup' element = { (!currUser || !user) ? <Signup/> : <Navigate to = { '/' }/> }/>
            <Route path = '/login' element = {  (!currUser || !user) ? <Login/> : <Navigate to = { '/' }/> }/>
            <Route path = '/category/:category' element = { <Category/> } />
            <Route path = '/cart' element = { (currUser || user) ? <Cart/> : <Navigate to = { '/login' } />} />
            <Route path = '/success' element = { (currUser || user) ? <Success /> : <Navigate to = { '/login' } /> }/>
            <Route path = '/cancel' element = { (currUser || user) ? <Cancel /> : <Navigate to = { '/login' } /> } />
          </Routes>
        </div>
        <Toaster/>
      </div>
    </BrowserRouter>
  )
}

export default App
