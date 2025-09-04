"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  User, Mail, Phone, MapPin, Briefcase, Shield, 
  Calendar, Clock, Edit, Star, Award, CheckCircle,
  FileText, Camera, Settings, LogOut, Menu, X
} from "lucide-react"
import { db } from "@/lib/firebase"

import { useActiveAccount } from "thirdweb/react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import Image from "next/image"

export default function DoctorProfile() {
  const activeAccount = useActiveAccount()
  const address = activeAccount?.address
  const [doctorData, setDoctorData] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false) // Changed default to false for mobile-first
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load doctor data from Firebase
  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "doctors", address)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.status === 'approved') {
            setDoctorData(data)
            setEditData(data)
          }
        }
      } catch (error) {
        console.error("Error loading doctor data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDoctorData()
  }, [address])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true) // Auto-open on desktop
      } else {
        setSidebarOpen(false) // Auto-close on mobile
      }
    }

    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEditSave = async () => {
    try {
      setSaving(true)
      const updatedData = { 
        ...editData, 
        updatedAt: serverTimestamp() 
      }
      
      // Save to Firebase
      const docRef = doc(db, "doctors", address)
      await setDoc(docRef, updatedData, { merge: true })
      
      setDoctorData(updatedData)
      setShowEditModal(false)
    } catch (error) {
      console.error("Error saving doctor data:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-sm mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#05696b] border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Profile</h2>
          <p className="text-gray-600">Please wait while we retrieve your information...</p>
        </div>
      </div>
    )
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="w-20 h-20  flex items-center justify-center mx-auto mb-6">
            <Image src='/logo.png' alt="logo" height={80} width={80} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Unavailable</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your profile is either pending verification or requires completion of the verification process.
          </p>
          <Button className="bg-[#05696b] hover:bg-[#05696b]/90 text-white px-6 py-3 rounded-lg font-medium">
            Complete Verification
          </Button>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User, active: true },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patients", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-72 lg:w-64 bg-white shadow-xl lg:shadow-sm 
          transition-transform duration-300 ease-in-out
          min-h-screen border-r border-gray-200
        `}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10  flex items-center justify-center">
                <Image src='/logo.png' alt="logo" height={80} width={80} />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-[#05696b]">MedFi</h1>
                  <p className="text-xs text-gray-500 font-medium">Doctor Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={closeSidebar}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${item.active 
                    ? 'bg-[#05696b] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-fit justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-200"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-10 h-10" />
              </Button>
              <h1 className="font-bold text-lg text-[#05696b]">Doctor Profile</h1>
              <div className="w-8"></div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 mb-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex flex-col md:flex-row items-cente sm:items-start gap-3 md:gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      {doctorData.profileImage ? (
                        <img src={doctorData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                  </div>
                  <div className=" ">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Dr. {doctorData.firstName} {doctorData.lastName}
                    </h1>
                    <p className="text-lg lg:text-xl text-[#05696b] font-semibold mb-1">{doctorData.specialty}</p>
                    <p className="text-gray-600 mb-3">{doctorData.hospital}</p>
                    <div className="inline-flex items-center gap-2 bg-[#edb23a]/10 text-[#edb23a] px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified Professional</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-end">
                <Button 
                  onClick={() => setShowEditModal(true)}
                  className="bg-[#05696b] hover:bg-[#05696b]/90 w-fit text-white px-6 py-3 rounded-lg font-medium shadow-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {[
                { icon: Calendar, value: "0", label: "Today's Appointments", color: "text-blue-600" },
                { icon: User, value: "0", label: "Total Patients", color: "text-green-600" },
                { icon: Star, value: "0", label: "Average Rating", color: "text-yellow-600" },
                { icon: Award, value: doctorData.yearsExperience, label: "Years Experience", color: "text-purple-600" },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 lg:p-6 text-center border border-gray-100">
                  <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 lg:mb-3 ${stat.color}`} />
                  <p className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-xs lg:text-sm text-gray-600 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#05696b]" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email Address", value: doctorData.email },
                    { icon: Phone, label: "Phone Number", value: doctorData.phone },
                    { icon: MapPin, label: "Location", value: doctorData.country },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 bg-transparent md:bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#05696b]" />
                  Professional Details
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Award, label: "Medical Specialty", value: doctorData.specialty },
                    { icon: FileText, label: "License Number", value: doctorData.licenseNumber },
                    { icon: Clock, label: "Years of Experience", value: `${doctorData.yearsExperience} years` },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#05696b]" />
                Professional Biography
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">{doctorData.bio}</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="bg-gradient-to-r from-[#edb23a]/5 to-[#edb23a]/10 border border-[#edb23a]/20 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-[#edb23a] text-white p-3 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Medical Professional</h3>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    This doctor has been thoroughly verified by MedFi's security team. All medical credentials, licenses, and professional qualifications have been authenticated and validated.
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Verification completed:</span> {doctorData.submittedAt ? new Date(doctorData.submittedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto mx-auto md:mx-4">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-gray-900">Edit Your Profile</DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={editData.firstName || ""}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editData.lastName || ""}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editData.phone || ""}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital/Clinic Affiliation</label>
              <input
                type="text"
                value={editData.hospital || ""}
                onChange={(e) => handleInputChange('hospital', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors"
                placeholder="Enter your hospital or clinic name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Biography</label>
              <textarea
                value={editData.bio || ""}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-[#05696b] transition-colors resize-none"
                rows={4}
                placeholder="Tell patients about your background, experience, and approach to medicine..."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Important Notice</p>
                  <p className="text-sm text-amber-700">
                    Changes to core credentials (specialty, license number, qualifications) require re-verification and may temporarily affect your profile status.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <Button
                onClick={handleEditSave}
                className="bg-[#05696b] hover:bg-[#05696b]/90 text-white px-6 py-3 rounded-lg font-medium flex-1 sm:flex-none"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="px-6 py-3 rounded-lg font-medium border-gray-300 flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}