import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const useUserStore = create((set, get) => ({

    user: null,
    loading: false,
    checkingAuth: true,

    signup: async({ name, email, password, confirmPassword }) => {

        set({ loading: true })
        if (password !== confirmPassword) {

            set({ loading: false })
            return toast.error("Passwords do not match")

        }

        try {

            const res = await axios.post('http://localhost:3000/api/signup', { name, email, password })
            set({ user: res.data })

        } catch (error) {

            set({ loading: false })
            toast.error(error.response.data.message || 'An error occurred')

        }

    },

    login: async ({ email, password }) => {

        set({ loading: true })

		try {

			const res = await axios.post("http://localhost:3000/api/login", { email, password }, { withCredentials: true })
			set({ user: res.data, loading: false })
			localStorage.setItem('user',JSON.stringify(res.data))
        
		} catch (error) {

			set({ loading: false })
			toast.error(error.response.data.message || "An error occurred")

		}

	},

    logout: async () => {

		try {

			await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true })
			set({ user: null })

		} catch (error) {

			toast.error(error.response?.data?.message || "An error occurred during logout")

		}

	},

    checkAuth: async () => {

		set({ checkingAuth: true })

		try {

			const response = await axios.get("http://localhost:3000/api/profile")
			set({ user: response.data, checkingAuth: false })

		} catch (error) {

			console.log(error.message);
			set({ checkingAuth: false, user: null })

		}

	},

}))

export default useUserStore