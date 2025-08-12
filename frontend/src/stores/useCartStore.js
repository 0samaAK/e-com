import { create } from "zustand"
import { toast } from "react-hot-toast"
import axios from "axios"

export const useCartStore = create((set, get) => ({

	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {

		try {

			const res = await axios.get("http://localhost:3000/api/coupons", { withCredentials: true })
			set({ coupon: res.data })

		} catch (error) {

			return toast.error("Error fetching coupon:", error)

		}

	},

	applyCoupon: async (code) => {

		try {

			const response = await axios.post("http://localhost:3000/api/validate", { code }, { withCredentials: true })
			set({ coupon: response.data.data, isCouponApplied: true })
			get().calculateTotals()
			toast.success("Coupon applied successfully")
		
        } catch (error) {
		
            toast.error(error.response?.data?.message || "Failed to apply coupon")
		
        }
	
    },
	
    removeCoupon: () => {
	
        set({ coupon: null, isCouponApplied: false })
		get().calculateTotals()
		toast.success("Coupon removed")
	
    },

	getCartItems: async () => {
	
        try {
	
            const res = await axios.get("http://localhost:3000/api/cart", { withCredentials: true })
			set({ cart: res.data.data })
			get().calculateTotals()
	
        } catch (error) {
	
            set({ cart: [] })
			toast.error(error.response.data.message || "An error occurred")
	
        }
	
    },
	
    clearCart: async () => {
	
        set({ cart: [], coupon: null, total: 0, subtotal: 0 })
	
    },

	clearUserCart: async () => {

		try {

			await axios.post('http://localhost:3000/api/clearcart',{}, { withCredentials: true })
			set({ cart: [], coupon: null, total: 0, subtotal: 0 })
			toast.success("Product removed from cart")

		} catch (error) {

			toast.error(error?.response?.data?.message || "An error occurred")
		
		}
	
    },
	
    addToCart: async (product) => {
	
        try {

			await axios.post("http://localhost:3000/api/addtocart", { productid: product.id, quantity: 1 }, { withCredentials: true })
			toast.success("Product added to cart")

			set((prev) => {
	
                const existingItem = prev.cart.find((item) => item.id === product.id)
				const newCart = existingItem
					? prev.cart.map((item) =>
							item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prev.cart, { ...product, quantity: 1 }]
				return { cart: newCart }
	
            })
	
            get().calculateTotals()
	
        } catch (error) {
			
            toast.error(error?.response?.data?.message || "An error occurred", error)
	
        }
	
    },
	
    removeFromCart: async (productId) => {

		try {

			await axios.post('http://localhost:3000/api/removeallfromcart', { productId }, { withCredentials: true })
			set((prev) => ({ 

				cart: prev?.cart?.filter((item) => item.id !== productId)
			
			}))
			
			get().calculateTotals()
			toast.success("Product removed from cart")

		} catch (error) {

			toast.error(error?.response?.data?.message || "An error occurred")
		
		}
	
    },
	
    updateQuantity: async (productId, quantity) => {
	
        if (quantity === 0) {
	
            get().removeFromCart(productId)
			return
	
        }

		await axios.put(`http://localhost:3000/api/updateqty/${ productId }`, { quantity }, { withCredentials: true })
		set((prev) => ({
	
            cart: prev?.cart?.map((item) => (
				item.id === productId ? { ...item, quantity } : item)
			),
	
        }))
	
        get().calculateTotals()
	
    },
	
    calculateTotals: () => {
	
        const { cart, coupon } = get()
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
		let total = subtotal

		if (coupon) {
	
            const discount = subtotal * (coupon.data[0].discountPercentage / 100)
			total = subtotal - discount
	
        }

		set({ subtotal, total })
	
	},

}))