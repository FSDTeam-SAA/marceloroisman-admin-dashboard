"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { dashboardAPI } from "@/auth/dashboard-api"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableSkeletonLoader } from "@/components/skeleton-loader"
import CustomPagination from "@/components/custom-pagination"
import { Eye } from "lucide-react"

export default function CoachListsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: coachesData, isLoading } = useQuery({
    queryKey: ["coaches", currentPage],
    queryFn: () => dashboardAPI.getCoaches(currentPage, 10),
  })

  const coaches = coachesData?.data?.data?.coaches || []
  const totalPages = coachesData?.data?.data?.totalPages || 1

  const getStatusBadge = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium"
    if (status === "Free") return `${baseClass} bg-pink-100 text-pink-700`
    if (status === "Paid") return `${baseClass} bg-green-100 text-green-700`
    return `${baseClass} bg-gray-100 text-gray-700`
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48">
        <Header />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Coach Lists</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and view all coaches</p>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>All Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeletonLoader />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Coach Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Joined Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Spent</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coaches.map((coach: any) => (
                          <tr key={coach._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={coach.avatar?.url || "/placeholder.svg?height=40&width=40&query=coach+avatar"}
                                  alt={coach.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{coach.fullName}</p>
                                  <p className="text-xs text-gray-500">#{coach._id.slice(-5)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">{coach.email}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(coach.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">${coach.spent}</td>
                            <td className="py-4 px-4">
                              <span className={getStatusBadge(coach.status)}>{coach.status}</span>
                            </td>
                            <td className="py-4 px-4">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye size={18} className="text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
