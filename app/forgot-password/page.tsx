"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { authService } from "@/auth/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const mutation = useMutation({
    mutationFn: () => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success("OTP sent to your email")
      router.push(`/enter-otp?email=${email}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send OTP")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    mutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-500">
            Enter your registered email address. we'll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 border-gray-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF6B5B] hover:bg-[#E55A4A] text-white font-medium py-3 rounded-lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending..." : "Send OTP"}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-[#FF6B5B] hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
