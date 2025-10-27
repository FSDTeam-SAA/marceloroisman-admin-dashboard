import axios, { type AxiosInstance, type AxiosError } from "axios"
import { AUTH_CONFIG } from "./config"

const API_BASE_URL = AUTH_CONFIG.API_BASE_URL

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY)
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
