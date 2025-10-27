import apiClient from "./api-client"

export const dashboardAPI = {
  getStats: () => apiClient.get("/dashboard/admin/stats"),
  getCoaches: (page = 1, limit = 10) => apiClient.get(`/dashboard/coaches?page=${page}&limit=${limit}`),
  getPlans: () => apiClient.get("/plan"),
  createPlan: (data: any) => apiClient.post("/plan", data),
  updatePlan: (id: string, data: any) => apiClient.patch(`/plan/${id}`, data),
  deletePlan: (id: string) => apiClient.delete(`/plan/${id}`),
  getContacts: () => apiClient.get("/contact/all"),
  getContactDetails: (id: string) => apiClient.get(`/contact/${id}`),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post("/user/change-password", { oldPassword, newPassword }),
}
