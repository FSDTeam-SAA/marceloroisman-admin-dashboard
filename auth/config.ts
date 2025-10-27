export const AUTH_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/api",
  PUBLIC_ROUTES: ["/login", "/forgot-password", "/reset-password", "/enter-otp"],
  PROTECTED_ROUTES: ["/dashboard", "/coach-lists", "/subscription", "/contact-support", "/settings"],
  TOKEN_KEY: "accessToken",
  SESSION_KEY: "session",
}

export interface User {
  avatar: { public_id: string; url: string }
  _id: string
  fullName: string
  email: string
  role: string
  speciality?: string
}

export interface Session {
  accessToken: string
  refreshToken: string
  role: string
  _id: string
  user: User
}

export interface LoginResponse {
  success: boolean
  message: string
  data: Session
}
