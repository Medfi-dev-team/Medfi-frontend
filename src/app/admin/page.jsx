"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Users, Shield, Clock, Eye, Check, X, Menu, Home, 
  UserCheck, Settings, LogOut, Phone, Mail, MapPin,
  Calendar, Briefcase, FileText, Camera, CheckCircle,
  XCircle, User, RefreshCw
} from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, query, orderBy, onSnapshot } from "firebase/firestore"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [doctorsTab, setDoctorsTab] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showDoctorDetails, setShowDoctorDetails] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default closed on mobile
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true) // Open sidebar on desktop by default
      } else {
        setSidebarOpen(false) // Close sidebar on mobile by default
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load doctors data from Firebase
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true)
        const doctorsRef = collection(db, "doctors")
        const q = query(doctorsRef, orderBy("submittedAt", "desc"))
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const doctorsList = []
          querySnapshot.forEach((doc) => {
            doctorsList.push({ id: doc.id, ...doc.data() })
          })
          setDoctors(doctorsList)
          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error('Error loading doctors:', error)
        setLoading(false)
      }
    }

    const unsubscribe = loadDoctors()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleApproval = async (doctorId, status) => {
    try {
      setUpdating(true)
      const doctorRef = doc(db, "doctors", doctorId)
      await updateDoc(doctorRef, {
        status,
        reviewedAt: new Date().toISOString()
      })
      setShowDoctorDetails(false)
    } catch (error) {
      console.error("Error updating doctor status:", error)
      alert("Failed to update doctor status. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const refreshDoctors = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "doctors"))
      const doctorsList = []
      querySnapshot.forEach((doc) => {
        doctorsList.push({ id: doc.id, ...doc.data() })
      })
      setDoctors(doctorsList)
    } catch (error) {
      console.error('Error refreshing doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      unverified: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unverified' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "doctors", label: "Doctors", icon: UserCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleSidebarItemClick = (id) => {
    setActiveTab(id)
    if (isMobile) {
      setSidebarOpen(false) // Close sidebar on mobile after selection
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor and manage the MedFi platform</p>
        </div>
        <div className="flex justify-end items-end">

        <Button onClick={refreshDoctors} variant="outline" disabled={loading} className="w-fit sm:w-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{doctors.length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#05696b]" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {doctors.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {doctors.filter(d => d.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected Applications</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {doctors.filter(d => d.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#05696b] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No doctor applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctors.slice(0, 5).map((doctor) => (
              <div key={doctor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">Dr. {doctor.firstName} {doctor.lastName}</p>
                    <p className="text-sm text-gray-600 truncate">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {getStatusBadge(doctor.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDoctor(doctor)
                      setShowDoctorDetails(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderDoctors = () => {
    // Filter doctors based on the doctorsTab state
    const filteredDoctors = doctors.filter(doctor => {
      if (doctorsTab === "all") return true
      return doctor.status === doctorsTab
    })

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registered Doctors</h2>
            <p className="text-gray-600">Manage doctor verifications and profiles</p>
          </div>
          <Button onClick={refreshDoctors} variant="outline" disabled={loading} className="w-full sm:w-auto">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button
                variant={doctorsTab === "all" ? "default" : "outline"}
                onClick={() => setDoctorsTab("all")}
                className={`text-xs sm:text-sm ${doctorsTab === "all" ? "bg-[#05696b] hover:bg-[#05696b]/90" : ""}`}
                size="sm"
              >
                All ({doctors.length})
              </Button>
              <Button
                variant={doctorsTab === "pending" ? "default" : "outline"}
                onClick={() => setDoctorsTab("pending")}
                className={`text-xs sm:text-sm ${doctorsTab === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                size="sm"
              >
                Pending ({doctors.filter(d => d.status === 'pending').length})
              </Button>
              <Button
                variant={doctorsTab === "approved" ? "default" : "outline"}
                onClick={() => setDoctorsTab("approved")}
                className={`text-xs sm:text-sm ${doctorsTab === "approved" ? "bg-green-600 hover:bg-green-700" : ""}`}
                size="sm"
              >
                Approved ({doctors.filter(d => d.status === 'approved').length})
              </Button>
              <Button
                variant={doctorsTab === "rejected" ? "default" : "outline"}
                onClick={() => setDoctorsTab("rejected")}
                className={`text-xs sm:text-sm ${doctorsTab === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}`}
                size="sm"
              >
                Rejected ({doctors.filter(d => d.status === 'rejected').length})
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#05696b] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No doctors found</p>
                <p className="text-sm">Doctors will appear here once they register</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {doctor.profileImage ? (
                          <img src={doctor.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{doctor.email}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            {doctor.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {getStatusBadge(doctor.status)}
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor)
                          setShowDoctorDetails(true)
                        }}
                        className="bg-[#05696b] hover:bg-[#05696b]/90"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'fixed' : 'relative'} ${
          sidebarOpen && !isMobile ? 'w-64' : isMobile ? 'w-64' : 'w-16'
        } bg-white shadow-lg transition-all duration-300 min-h-screen z-50`}>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              {(sidebarOpen || isMobile) && (
                <div className="min-w-0">
                  <h1 className="font-bold text-lg text-[#05696b] truncate">MedFi Admin</h1>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              )}
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSidebarItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#05696b] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(sidebarOpen || isMobile) && <span className="font-medium truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {(sidebarOpen || isMobile) && (
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${!sidebarOpen && !isMobile ? 'ml-0' : ''}`}>
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow-sm p-4 border-b">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-lg text-[#05696b]">
                {activeTab === "overview" ? "Overview" : 
                 activeTab === "doctors" ? "Doctors" : "Settings"}
              </h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6 hidden md:block">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {activeTab === "overview" ? "Dashboard Overview" : 
                 activeTab === "doctors" ? "Doctor Management" : "Settings"}
              </h1>
            </div>

            {activeTab === "overview" && renderOverview()}
            {activeTab === "doctors" && renderDoctors()}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Settings</h2>
                <p className="text-gray-600">Configure platform settings and preferences.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      <Dialog open={showDoctorDetails} onOpenChange={setShowDoctorDetails}>
        <DialogContent className="md:max-w-5xl max-h-[90vh] mx-auto overflow-y-auto md:mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">Doctor Verification Details</DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="py-6 space-y-6 sm:space-y-8">
              {/* Header with Status */}
              <div className="flex flex-col p-4 sm:p-6 bg-gradient-to-r from-[#05696b]/10 to-[#05696b]/5 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer flex-shrink-0"
                    onClick={() => selectedDoctor.profileImage && openImageModal(selectedDoctor.profileImage)}
                  >
                    {selectedDoctor.profileImage ? (
                      <img src={selectedDoctor.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h2>
                    <p className="text-base sm:text-lg text-[#05696b] font-medium">{selectedDoctor.specialty}</p>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedDoctor.hospital}</p>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right">
                    {getStatusBadge(selectedDoctor.status)}
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {selectedDoctor.submittedAt ? new Date(selectedDoctor.submittedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-800 font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email Address</label>
                      <p className="text-gray-800 break-all">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-800">{selectedDoctor.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-800">{selectedDoctor.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Wallet Address</label>
                      <p className="text-gray-800 text-xs sm:text-sm font-mono bg-gray-50 p-2 rounded break-all">
                        {selectedDoctor.walletAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-xl border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  Professional Credentials
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Medical Specialty</label>
                      <p className="text-gray-800 font-medium">{selectedDoctor.specialty}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">License Number</label>
                      <p className="text-gray-800">{selectedDoctor.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Years of Experience</label>
                      <p className="text-gray-800">{selectedDoctor.yearsExperience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hospital/Clinic</label>
                      <p className="text-gray-800">{selectedDoctor.hospital}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Professional Bio</label>
                  <p className="text-gray-800 mt-1 leading-relaxed text-sm sm:text-base">{selectedDoctor.bio}</p>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="bg-white rounded-xl border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Verification Documents
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 mb-3">ID Document & License</h4>
                    {selectedDoctor.idDocument ? (
                      <div
                        className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#05696b] transition-colors"
                        onClick={() => openImageModal(selectedDoctor.idDocument)}
                      >
                        <img 
                          src={selectedDoctor.idDocument} 
                          alt="ID Document" 
                          className="w-full h-24 sm:h-32 object-cover rounded mb-2"
                        />
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Full Size
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <p className="text-gray-500">No document uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 mb-3">Verification Selfie</h4>
                    {selectedDoctor.selfieImage ? (
                      <div
                        className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#05696b] transition-colors"
                        onClick={() => openImageModal(selectedDoctor.selfieImage)}
                      >
                        <img 
                          src={selectedDoctor.selfieImage} 
                          alt="Verification Selfie" 
                          className="w-full h-24 sm:h-32 object-cover rounded mb-2"
                        />
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Full Size
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <p className="text-gray-500">No selfie uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedDoctor.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button
                    onClick={() => handleApproval(selectedDoctor.id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={updating}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {updating ? "Approving..." : "Approve Doctor"}
                  </Button>
                  <Button
                    onClick={() => handleApproval(selectedDoctor.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                    disabled={updating}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {updating ? "Rejecting..." : "Reject Application"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-3xl mx-4">
          <DialogHeader>
            <DialogTitle>Document View</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <img 
              src={selectedImage} 
              alt="Document" 
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}