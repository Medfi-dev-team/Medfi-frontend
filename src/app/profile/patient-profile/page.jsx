"use client"
import { useState } from "react"
import { useAddress } from "@thirdweb-dev/react"
import { Button } from "@/components/ui/button"
import { User, Calendar, FileText, Edit, Plus, Heart, Activity, Clock, Users } from "lucide-react"

export default function PatientDashboard() {
  const address = useAddress()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [hasProfile, setHasProfile] = useState(false) // Track if user has completed profile
  
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    conditions: "",
    emergencyContact: "",
    emergencyPhone: ""
  })

  // This would come from your backend/blockchain
  const appointments = []
  const medicalRecords = []
  const dashboardStats = {
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalRecords: 0,
    lastVisit: null
  }

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    setHasProfile(true)
    // Save to backend/blockchain here
    console.log('Saving profile:', patientData)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText }
  ]

  const ProfileSetupCard = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500 p-2 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Complete Your Profile</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Set up your medical profile to get personalized healthcare services and better treatment recommendations.
      </p>
      <Button 
        onClick={() => setIsEditingProfile(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Set Up Profile
      </Button>
    </div>
  )

  const ProfileForm = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {hasProfile ? 'Edit Profile' : 'Set Up Your Profile'}
        </h3>
        <Button
          variant="outline"
          onClick={() => setIsEditingProfile(false)}
        >
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">Personal Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={patientData.name}
              onChange={(e) => setPatientData({...patientData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={patientData.email}
              onChange={(e) => setPatientData({...patientData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={patientData.phone}
              onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              value={patientData.dateOfBirth}
              onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">Medical Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              value={patientData.bloodType}
              onChange={(e) => setPatientData({...patientData, bloodType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
            <textarea
              value={patientData.allergies}
              onChange={(e) => setPatientData({...patientData, allergies: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <textarea
              value={patientData.conditions}
              onChange={(e) => setPatientData({...patientData, conditions: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="List any ongoing medical conditions"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-medium text-gray-700 border-b pb-2">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={patientData.emergencyContact}
                onChange={(e) => setPatientData({...patientData, emergencyContact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name of emergency contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={patientData.emergencyPhone}
                onChange={(e) => setPatientData({...patientData, emergencyPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact phone"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveProfile}
          disabled={!patientData.name || !patientData.email || !patientData.phone || !patientData.dateOfBirth}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Profile
        </Button>
      </div>
    </div>
  )

  const ProfileSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingProfile(true)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium text-gray-600">Name:</span> {patientData.name}</p>
          <p><span className="font-medium text-gray-600">Email:</span> {patientData.email}</p>
          <p><span className="font-medium text-gray-600">Phone:</span> {patientData.phone}</p>
          <p><span className="font-medium text-gray-600">Date of Birth:</span> {patientData.dateOfBirth}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium text-gray-600">Blood Type:</span> {patientData.bloodType || 'Not specified'}</p>
          <p><span className="font-medium text-gray-600">Allergies:</span> {patientData.allergies || 'None specified'}</p>
          <p><span className="font-medium text-gray-600">Conditions:</span> {patientData.conditions || 'None specified'}</p>
          <p><span className="font-medium text-gray-600">Emergency Contact:</span> {patientData.emergencyContact || 'Not specified'}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-600">
                Welcome to MedFi, {hasProfile && patientData.name ? patientData.name : 'Patient'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Wallet: {address?.slice(0, 8)}...{address?.slice(-6)}
              </p>
            </div>
            {/* Quick Stats */}
            <div className="hidden md:flex gap-4">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-1">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalAppointments}</p>
                <p className="text-xs text-gray-600">Appointments</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full mb-1">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalRecords}</p>
                <p className="text-xs text-gray-600">Records</p>
              </div>
            </div>
          </div>
        </div>

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
              {!hasProfile && !isEditingProfile && <ProfileSetupCard />}
              
              {isEditingProfile && <ProfileForm />}
              
              {hasProfile && !isEditingProfile && (
                <>
                  <ProfileSummary />
                  
                  {/* Quick Actions */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        className="flex items-center gap-2 h-16 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setActiveTab('appointments')}
                      >
                        <Plus className="w-5 h-5" />
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-16"
                        onClick={() => setActiveTab('records')}
                      >
                        <FileText className="w-5 h-5" />
                        View Records
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 h-16"
                      >
                        <Users className="w-5 h-5" />
                        Find Doctors
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">My Appointments</h3>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Book New Appointment
                </Button>
              </div>
              
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No appointments yet</h4>
                  <p className="text-gray-500 mb-4">Book your first appointment to get started with MedFi</p>
                  <Button>Book Your First Appointment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{appt.doctor}</p>
                        <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                          appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'records' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Medical Records</h3>
              
              {medicalRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No medical records yet</h4>
                  <p className="text-gray-500 mb-4">Your medical records will appear here after appointments and tests</p>
                  <Button onClick={() => setActiveTab('appointments')}>Book an Appointment</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-gray-600">Date: {record.date}</p>
                        <p className="text-sm text-gray-600">Doctor: {record.doctor}</p>
                      </div>
                      <Button variant="outline">View Record</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}