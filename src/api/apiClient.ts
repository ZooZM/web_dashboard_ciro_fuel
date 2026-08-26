import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// Create a central Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Fallback URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor (T011)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (T012, T013)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      toast.error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.') // Session expired. Please login again.
      // Redirect to login handled by ProtectedRoute or router setup
    }
    return Promise.reject(error)
  }
)
