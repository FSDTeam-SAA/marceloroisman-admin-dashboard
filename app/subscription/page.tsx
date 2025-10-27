"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { dashboardAPI } from "@/auth/dashboard-api"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableSkeletonLoader } from "@/components/skeleton-loader"
import { Trash2, Edit2, Plus, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Plan {
  _id: string
  name: string
  price: number
  description: string
  benefits: string[]
  image?: { public_id: string; url: string }
}

export default function SubscriptionPage() {
  const queryClient = useQueryClient()

  // States
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    benefits: [""],
  })

  // Queries
  const { data: plansData, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => dashboardAPI.getPlans(),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => dashboardAPI.createPlan(data),
    onSuccess: () => {
      toast.success("Plan created successfully")
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      setShowPlanModal(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create plan")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dashboardAPI.updatePlan(id, data),
    onSuccess: () => {
      toast.success("Plan updated successfully")
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      setShowPlanModal(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update plan")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dashboardAPI.deletePlan(id),
    onSuccess: () => {
      toast.success("Plan deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      setShowDeleteModal(false)
      setSelectedPlan(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete plan")
    },
  })

  // Helpers
  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", benefits: [""] })
    setEditingPlanId(null)
  }

  const handleAddBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] })
  }

  const handleRemoveBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    })
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({ ...formData, benefits: newBenefits })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    const payload = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      benefits: formData.benefits.filter((b) => b.trim()),
    }

    if (modalMode === "add") {
      createMutation.mutate(payload)
    } else if (modalMode === "edit" && editingPlanId) {
      updateMutation.mutate({ id: editingPlanId, data: payload })
    }
  }

  const plans = plansData?.data?.data || []

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48">
        <Header />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
              <p className="text-gray-600 text-sm mt-1">Manage subscription plans</p>
            </div>
            <Button
              onClick={() => {
                setModalMode("add")
                resetForm()
                setShowPlanModal(true)
              }}
              className="bg-[#FF6B5B] hover:bg-[#E55A4A] text-white gap-2"
            >
              <Plus size={18} />
              Add Plan
            </Button>
          </div>

          <Card className="bg-white">
            <CardContent className="pt-6">
              {isLoading ? (
                <TableSkeletonLoader />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Plan Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Benefits</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.map((plan: Plan) => (
                        <tr key={plan._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{plan.name}</td>
                          <td className="py-4 px-4 text-gray-600">${plan.price}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{plan.description}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{plan.benefits?.length || 0} benefits</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setModalMode("edit")
                                  setEditingPlanId(plan._id)
                                  setFormData({
                                    name: plan.name,
                                    price: plan.price.toString(),
                                    description: plan.description,
                                    benefits: plan.benefits || [""],
                                  })
                                  setShowPlanModal(true)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit2 size={18} className="text-blue-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPlan(plan)
                                  setShowDeleteModal(true)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shared Add/Edit Modal */}
          <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{modalMode === "add" ? "Add New Plan" : "Edit Plan"}</DialogTitle>
                <DialogDescription>
                  {modalMode === "add"
                    ? "Create a new subscription plan"
                    : "Update the subscription plan details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Basic"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 19.99"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Plan description"
                  />
                </div>

                <div>
                  <Label>Benefits</Label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          placeholder="Add benefit"
                        />
                        {formData.benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddBenefit}
                    variant="outline"
                    className="mt-2 w-full bg-transparent"
                    size="sm"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Benefit
                  </Button>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowPlanModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#FF6B5B] hover:bg-[#E55A4A]"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {modalMode === "add"
                      ? createMutation.isPending
                        ? "Creating..."
                        : "Create Plan"
                      : updateMutation.isPending
                      ? "Updating..."
                      : "Update Plan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <AlertDialogContent>
              <AlertDialogTitle>Delete Plan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the "{selectedPlan?.name}" plan? This action cannot be undone.
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => selectedPlan && deleteMutation.mutate(selectedPlan._id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  )
}
