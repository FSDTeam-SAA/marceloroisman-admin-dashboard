"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { dashboardAPI } from "@/auth/dashboard-api"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableSkeletonLoader } from "@/components/skeleton-loader"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Contact {
  _id: string
  user: {
    avatar: { public_id: string; url: string }
    _id: string
    fullName: string
    email: string
    role: string
  }
  phone: string
  problemHeading: string
  problemDescription: string
  status: string
}

export default function ContactSupportPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => dashboardAPI.getContacts(),
  })

  const contacts = contactsData?.data?.data || []

  const getStatusBadge = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium"
    if (status === "viewed") return `${baseClass} bg-green-100 text-green-700`
    if (status === "pending") return `${baseClass} bg-yellow-100 text-yellow-700`
    return `${baseClass} bg-gray-100 text-gray-700`
  }

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact)
    setShowDetailsModal(true)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48">
        <Header />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>
            <p className="text-gray-600 text-sm mt-1">View and manage customer support requests</p>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Support Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeletonLoader />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Issue</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact: Contact) => (
                        <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  contact.user.avatar?.url ||
                                  "/placeholder.svg?height=40&width=40&query=user+avatar" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={contact.user.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <p className="font-medium text-gray-900">{contact.user.fullName}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{contact.user.email}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{contact.phone}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{contact.problemHeading}</td>
                          <td className="py-4 px-4">
                            <span className={getStatusBadge(contact.status)}>{contact.status}</span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleViewDetails(contact)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye size={18} className="text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Modal */}
          <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Support Request Details</DialogTitle>
                <DialogDescription>View the complete support request information</DialogDescription>
              </DialogHeader>
              {selectedContact && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          selectedContact.user.avatar?.url ||
                          "/placeholder.svg?height=60&width=60&query=user+avatar" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={selectedContact.user.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedContact.user.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedContact.user.email}</p>
                        <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Issue Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Issue Heading</h3>
                    <p className="text-gray-700">{selectedContact.problemHeading}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Issue Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.problemDescription}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                    <span className={getStatusBadge(selectedContact.status)}>{selectedContact.status}</span>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
