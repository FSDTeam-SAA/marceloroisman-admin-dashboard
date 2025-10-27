import apiClient from "./api"

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    role: string
    _id: string
    user: {
      avatar: { public_id: string; url: string }
      verificationInfo: { verified: boolean; token: string }
      _id: string
      fullName: string
      email: string
      credit: number
      role: string
      enableNotifications: boolean
      dnd: boolean
      fine: number
      refreshToken: string
      createdAt: string
      updatedAt: string
      speciality?: string
    }
  }
}

export const authAPI = {
  login: (email: string, password: string) => apiClient.post<LoginResponse>("/auth/login", { email, password }),

  forgotPassword: (email: string) => apiClient.post("/auth/forget", { email }),

  verifyOTP: (email: string, otp: string) => apiClient.post("/auth/verify-otp", { email, otp }),

  resetPassword: (email: string, otp: string, password: string) =>
    apiClient.post("/auth/reset-password", { email, otp, password }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post("/user/change-password", { oldPassword, newPassword }),
}

export const dashboardAPI = {
  getStats: () => apiClient.get("/admin/stats"),
  getCoaches: (page = 1, limit = 10) => apiClient.get(`/coaches?page=${page}&limit=${limit}`),
  getPlans: () => apiClient.get("/plan"),
  createPlan: (data: any) => apiClient.post("/plan", data),
  updatePlan: (id: string, data: any) => apiClient.put(`/plan/${id}`, data),
  deletePlan: (id: string) => apiClient.delete(`/plan/${id}`),
  getContacts: () => apiClient.get("/contact/all"),
  getContactDetails: (id: string) => apiClient.get(`/contact/${id}`),
}
