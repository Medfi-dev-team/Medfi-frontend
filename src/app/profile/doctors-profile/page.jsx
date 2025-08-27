"use client"
import { useState } from "react"
import { useAddress } from "@thirdweb-dev/react"
import { Button } from "@/components/ui/button"
import { User, Calendar, FileText, Shield, Clock } from "lucide-react"

export default function DoctorDashboard() {
  const address = useAddress()
  const [activeTab, setActiveTab] = useState('overview')
  const [isVerified, setIsVerified] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: FileText }
  ]

  const pendingAppointments = [
    { id: 1, patient: "John Doe", date: "2023-12-15", time: "10:00 AM", type: "Consultation" },
    { id: 2, patient: "Jane Smith", date: "2023-12-16", time: "2:30 PM", type: "Follow-up" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome to your practice</p>
              <p className="text-sm text-gray-500 mt-1">Wallet: {address?.slice(0, 8)}...{address?.slice(-6)}</p>
            </div>
            {!isVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Verification Required</span>
                </div>
                <p className="text-sm text-yellow-700">Complete verification to start accepting patients</p>
                <Button className="mt-2 bg-yellow-600 hover:bg-yellow-700">Verify Account</Button>
              </div>
            )}
          </div>
        </div>

        {!isVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Account Verification Pending</h3>
                <p className="text-blue-700 mb-4">
                  Your account is currently under review. This process usually takes 24-48 hours. 
                  You'll be able to access all features once your verification is complete.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-blue-700">Medical license verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-blue-700">Identity verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-blue-700">Background check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#05696b] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Pending Appointments</h3>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Total Patients</h3>
                  <p className="text-2xl font-bold text-green-600">23</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">This Week</h3>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {pendingAppointments.slice(0, 3).map((appt) => (
                    <div key={appt.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{appt.patient}</p>
                          <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {appt.type}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Appointment Schedule</h3>
              {!isVerified ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Verification Required</h4>
                  <p className="text-gray-500">Complete your verification to view and manage appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Appointment content would go here */}
                  <p className="text-gray-600">Your appointment schedule will appear here once verified.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'patients' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Patient Records</h3>
              {!isVerified ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Verification Required</h4>
                  <p className="text-gray-500">Complete your verification to access patient records</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Patient records would go here */}
                  <p className="text-gray-600">Your patient records will appear here once verified.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}