import apiClient from "./api-client"
import type { LoginResponse, Session } from "./config"

// Define a type for password change request
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const authService = {
  // Authentication
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { email, password }),

  forgotPassword: (email: string) => apiClient.post("/auth/forget", { email }),

  resetPassword: (email: string, otp: string, password: string) =>
    apiClient.post("/auth/reset-password", { email, otp, password }),

  // ✅ Updated to match backend
  changePassword: ({ currentPassword, newPassword, confirmPassword }: ChangePasswordRequest) =>
    apiClient.post("/user/change-password", { currentPassword, newPassword, confirmPassword }),

  // Session management
  setSession: (session: Session) => {
    localStorage.setItem("accessToken", session.accessToken)
    localStorage.setItem("session", JSON.stringify(session))
  },

  getSession: (): Session | null => {
    if (typeof window === "undefined") return null
    const session = localStorage.getItem("session")
    return session ? JSON.parse(session) : null
  },

  clearSession: () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("session")
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("accessToken")
  },
}
