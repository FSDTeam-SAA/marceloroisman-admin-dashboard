"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardAPI } from "@/auth/dashboard-api"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { DollarSign, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardAPI.getStats(),
  })

  const stats = statsData?.data?.data

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48">
        <Header />
        <main className="p-8 bg-gray-50 min-h-screen">
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Total Revenue"
                  value={`$${stats?.totalRevenue || 0}`}
                  icon={DollarSign}
                  color="bg-[#FF6B5B]"
                />
                <StatCard title="Coach Lists" value={stats?.totalCoaches || 0} icon={Users} color="bg-blue-500" />
                <StatCard
                  title="Paid Coach Lists"
                  value={stats?.paidCoaches || 0}
                  icon={TrendingUp}
                  color="bg-green-500"
                />
              </div>

              {/* Chart */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Coach Joining Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats?.coachJoiningChart || []}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B5B" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF6B5B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#FF6B5B"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="bg-blue-50 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-500" size={24} />
                      <div>
                        <p className="font-semibold text-gray-900">Coach Lists</p>
                        <p className="text-sm text-gray-600">Manage all coaches</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-green-500" size={24} />
                      <div>
                        <p className="font-semibold text-gray-900">Subscription</p>
                        <p className="text-sm text-gray-600">Manage plans</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
