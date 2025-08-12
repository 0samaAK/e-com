import { create } from "zustand"
import toast from "react-hot-toast"
import axios from "axios"

export const useProductStore = create((set) => ({

	products: [],
	loading: false,

	setProducts: (products) => {
        
        set({ products })

    },

	createProduct: async (productData) => {

		set({ loading: true })
		
        try {

			const res = await axios.post("http://localhost:3000/api/product/create", productData, { withCredentials: true })
			set((prev) => ({

				products: [ ...prev.products, res.data ],
				loading: false,

			}))

		} catch (error) {

			toast.error(error.response.data.error)
			set({ loading: false })

		}

	},

	fetchAllProducts: async () => {

		set({ loading: true })

		try {

			const res = await axios.get("http://localhost:3000/api/products", { withCredentials: true })
			set({ products: res.data.data, loading: false })
            
		} catch (error) {
            
			set({ error: "Failed to fetch products", loading: false })
			toast.error(error.res.data.error || "Failed to fetch products")

		}

	},

	fetchProductsByCategory: async (category) => {

		set({ loading: true })

		try {

			const res = await axios.get(`http://localhost:3000/api/product/category/${ category }`, { withCredentials: true })
			set({ products: res.data.data, loading: false })

		} catch (error) {

			set({ error: "Failed to fetch products", loading: false })
			toast.error(error.res.data.error || "Failed to fetch products")

		}

	},

	deleteProduct: async (productId) => {

		set({ loading: true })
		
        try {
		
            await axios.delete(`http://localhost:3000/api/product/delete/${ productId }`, { withCredentials: true })
			
			set((prevProducts) => ({
	
                products: prevProducts.products.filter((product) => product.id !== productId),
				loading: false,
	
            }))
		
        } catch (error) {
		
            set({ loading: false })
			toast.error(error.response.data.error || "Failed to delete product")
		
        }
	
    },

	toggleFeaturedProduct: async (productId) => {
	
        set({ loading: true })
	
        try {
	
            await axios.patch(`http://localhost:3000/api/product/featured/${ productId }`, {}, { withCredentials: true })
	
            set((prevProducts) => ({
	
                products: prevProducts.products.map((product) =>
					product.id === productId ? { ...product, isFeatured: !product.isFeatured } : product
				),
				loading: false,
	
            }))
	
        } catch (error) {
	
            set({ loading: false })
			toast.error(error.response?.data?.error || "Failed to update product")
	
        }
	
    },

	fetchFeaturedProducts: async () => {
	
        set({ loading: true })
	
        try {
	
            const res = await axios.get("http://localhost:3000/api/product/featured", {}, { withCredentials: true })
			set({ products: res.data, loading: false })
	
        } catch (error) {
	
            set({ error: "Failed to fetch products", loading: false, message: error.response.data.error || "Failed to fetch products" })
	
        }
	
    },

}))