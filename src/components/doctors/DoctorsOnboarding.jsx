"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Shield, Clock, ArrowRight, X, Upload, Briefcase, BookOpen, AlertCircle, Camera, CheckCircle, Eye, Edit } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { uploadImage } from "@/lib/cloudinary"
import { useActiveAccount } from "thirdweb/react"
import Link from "next/link"

export default function DoctorDashboard() {
  const activeAccount = useActiveAccount()
  const address = activeAccount?.address
  const [verificationStatus, setVerificationStatus] = useState("unverified")
  const [showVerification, setShowVerification] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [verificationStep, setVerificationStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [takingSelfie, setTakingSelfie] = useState(false)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    licenseNumber: "",
    yearsExperience: "",
    hospital: "",
    country: "",
    phone: "",
    email: "",
    bio: "",
    profileImage: "",
    idDocument: "",
    selfieImage: "",
    walletAddress: address,
    submittedAt: "",
    status: "unverified",
    createdAt: ""
  })

  // Load saved data from Firebase on component mount
  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "doctors", address)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          setDoctorData(data)
          setVerificationStatus(data.status || "unverified")
        }
      } catch (error) {
        console.error("Error loading doctor data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDoctorData()
  }, [address])

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Nigeria", "South Africa", "India", "Brazil", "Mexico", "Other"
  ]

  const medicalSpecialties = [
    "Cardiology", "Dermatology", "Emergency Medicine", "Family Medicine", 
    "Gastroenterology", "Internal Medicine", "Neurology", "Obstetrics/Gynecology",
    "Oncology", "Ophthalmology", "Orthopedics", "Pediatrics", "Psychiatry",
    "Radiology", "Surgery", "Urology", "Dentistry", "Midwifery", "Nursing",
    "Physiotherapy", "Other"
  ]

  const handleInputChange = (field, value) => {
    setDoctorData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (field, file) => {
    if (!file) return
    
    setUploading(true)
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadImage(file)
      handleInputChange(field, imageUrl)
    } catch (error) {
      console.error("File upload failed:", error)
      alert("File upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setTakingSelfie(true)
    } catch (error) {
      console.error("Camera access failed:", error)
      alert("Camera access is required for selfie verification. Please check your browser permissions.")
    }
  }

  const takeSelfie = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return
    
    // Ensure canvas dimensions match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to blob and upload to Cloudinary
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to capture image. Please try again.")
        return
      }
      
      setUploading(true)
      try {
        const selfieUrl = await uploadImage(blob)
        handleInputChange('selfieImage', selfieUrl)
      } catch (error) {
        console.error("Selfie upload failed:", error)
        alert("Selfie upload failed. Please try again.")
        
        // Fallback: convert to data URL if Cloudinary fails
        const imageData = canvas.toDataURL('image/jpeg')
        handleInputChange('selfieImage', imageData)
      } finally {
        setUploading(false)
        stopCamera()
      }
    }, 'image/jpeg', 0.8)
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setTakingSelfie(false)
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return doctorData.firstName && doctorData.lastName && doctorData.email && 
               doctorData.phone && doctorData.country && doctorData.profileImage
      case 2:
        return doctorData.specialty && doctorData.licenseNumber && 
               doctorData.yearsExperience && doctorData.hospital && doctorData.bio
      case 3:
        return doctorData.idDocument && doctorData.selfieImage
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(verificationStep) && verificationStep < 3) {
      setVerificationStep(verificationStep + 1)
    }
  }

  const prevStep = () => {
    if (verificationStep > 1) {
      setVerificationStep(verificationStep - 1)
    }
  }

  const saveToFirebase = async (data) => {
    try {
      const docRef = doc(db, "doctors", address)
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true })
      return true
    } catch (error) {
      console.error("Error saving to Firebase:", error)
      return false
    }
  }

  const submitVerification = async () => {
    setUploading(true)
    try {
      const verificationData = {
        ...doctorData,
        status: "pending",
        submittedAt: new Date().toISOString(),
        createdAt: doctorData.createdAt || serverTimestamp()
      }

      // Save to Firebase
      const success = await saveToFirebase(verificationData)
      
      if (success) {
        setDoctorData(verificationData)
        setVerificationStatus("pending")
        setShowVerification(false)
        setShowSuccess(true)
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      console.error('Error submitting verification:', error)
      alert('Failed to submit verification. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const renderVerificationContent = () => {
    if (loading) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-48"></div>
            </div>
          </div>
        </div>
      )
    }

    if (verificationStatus === "approved") {
      return (
        <div className="bg-[#05696b]/5 border border-[#05696b]/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 " />
            <div>
              <h3 className="text-lg font-semibold ">Verification Approved</h3>
              <p className="">You can now access all MedFi features</p>
            </div>
          </div>
         <Link href='/personal-profile/doctors-profile'>
         <Button 
            onClick={() => setShowProfile(true)}
            className="bg-[#05696b] hover:bg-[#05696b]/90 "
          >
            View Profile
          </Button>
         
         </Link>
        </div>
      )
    }

    if (verificationStatus === "pending") {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-yellow-600 " />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Verification Under Review</h3>
              <p className="text-yellow-700">We're reviewing your documents. This typically takes 24-48 hours.</p>
            </div>
          </div>
          <div className="flex gap-4 md:gap-2 md:flex-row flex-col">
            <Button variant="outline" disabled className="opacity-50 w-fit">
              Verification Submitted
            </Button>
            <Button variant="outline" disabled className="opacity-50 w-fit">
              Waiting for Approval
            </Button>
          </div>
        </div>
      )
    }

    if (verificationStatus === "rejected") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <X className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Verification Rejected</h3>
              <p className="text-red-700">Please review and resubmit your documents.</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowVerification(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            Resubmit Documents
          </Button>
        </div>
      )
    }

    return (
      <div className="bg-[#05696b]/10 border border-[#05696b] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-[#05696b]" />
          <div>
            <h3 className="text-lg font-semibold text-[#05696b]">Verification Required</h3>
            <p className="text-[#05696b]">Complete verification to start accepting patients</p>
          </div>
        </div>
        <Button 
          className="bg-[#05696b] hover:bg-[#05696b]/90"
          onClick={() => setShowVerification(true)}
        >
          Start Verification Process
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container  mx-auto px-4 py-16">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center max-w-[95%]">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">MedFi Doctor Portal</h1>
              <p className="text-gray-600">Your gateway to decentralized healthcare</p>
              <p className="text-sm text-gray-500 mt-1">Wallet: {address}</p>
            </div>
            <div className="text-right flex justify-end items-end flex-col">
              <div className="text-sm text-gray-500 pb-4">Status</div>
              <div className={`px-3 py-1 rounded-full  text-sm font-medium ${
                verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800 w-fit '
              }`}>
                {verificationStatus === 'approved' ? 'Verified' :
                 verificationStatus === 'pending' ? 'Under Review' :
                 verificationStatus === 'rejected' ? 'Rejected' : 'Unverified'}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {renderVerificationContent()}

        {/* Verification Modal */}
        <Dialog open={showVerification} onOpenChange={setShowVerification}>
          <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <DialogTitle className="text-xl pt-4 font-semibold">
                Professional Verification - Step {verificationStep} of 3
              </DialogTitle>
              
            </DialogHeader>

            <div className="py-6">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <div className={`text-sm font-medium ${verificationStep >= 1 ? 'text-[#05696b]' : 'text-gray-400'}`}>
                    Personal Information
                  </div>
                  <div className={`text-sm font-medium ${verificationStep >= 2 ? 'text-[#05696b]' : 'text-gray-400'}`}>
                    Professional Credentials
                  </div>
                  <div className={`text-sm font-medium ${verificationStep >= 3 ? 'text-[#05696b]' : 'text-gray-400'}`}>
                    Identity Verification
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#05696b] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(verificationStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {verificationStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#05696b] text-white p-2 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                      <p className="text-gray-600">Please provide your basic personal details</p>
                    </div>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        {doctorData.profileImage ? (
                          <img src={doctorData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        id="profile-upload"
                        onChange={(e) => handleFileUpload('profileImage', e.target.files[0])}
                        className="hidden"
                        accept="image/*"
                        disabled={uploading}
                      />
                      <label 
                        htmlFor="profile-upload" 
                        className="absolute bottom-0 right-0 bg-[#05696b] text-white p-2 rounded-full cursor-pointer hover:bg-[#05696b]/90 shadow-lg"
                      >
                        <Upload className="w-4 h-4" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={doctorData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={doctorData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={doctorData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={doctorData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                    <select
                      value={doctorData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {verificationStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#05696b] text-white p-2 rounded-lg">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Professional Credentials</h3>
                      <p className="text-gray-600">Provide your medical qualifications and experience</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Specialty *</label>
                    <select
                      value={doctorData.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select your specialty</option>
                      {medicalSpecialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical License Number *</label>
                      <input
                        type="text"
                        value={doctorData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                        placeholder="Enter license number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience *</label>
                      <select
                        value={doctorData.yearsExperience}
                        onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent bg-white"
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="16-20">16-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Hospital/Clinic *</label>
                    <input
                      type="text"
                      value={doctorData.hospital}
                      onChange={(e) => handleInputChange('hospital', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                      placeholder="Enter hospital or clinic name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio *</label>
                    <textarea
                      value={doctorData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05696b] focus:border-transparent"
                      rows={4}
                      placeholder="Describe your professional background, expertise, and approach to patient care..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
                  </div>
                </div>
              )}

              {/* Step 3: Identity Verification */}
              {verificationStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#05696b] text-white p-2 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Identity Verification</h3>
                      <p className="text-gray-600">Upload documents and take a selfie for verification</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Security & Privacy</h4>
                        <p className="text-sm text-blue-700">
                          All documents are encrypted and processed securely. Your information is only used for verification purposes and is never shared with third parties.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ID Document Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-800 mb-2">Government-Issued ID & Medical License</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a clear photo of your government ID and medical license (can be combined in one image)
                    </p>
                    <input
                      type="file"
                      id="id-upload"
                      onChange={(e) => handleFileUpload('idDocument', e.target.files[0])}
                      className="hidden"
                      accept="image/*,.pdf"
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="id-upload" 
                      className="cursor-pointer bg-[#05696b] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#05696b]/90 inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Documents'}
                    </label>
                    {doctorData.idDocument && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Documents uploaded successfully
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selfie Verification */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-800 mb-2">Live Selfie Verification</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Take a live selfie to verify your identity matches your documents
                    </p>
                    
                    {!takingSelfie && !doctorData.selfieImage && (
                      <Button 
                        onClick={startCamera}
                        className="bg-[#05696b] hover:bg-[#05696b]/90"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    )}

                    {takingSelfie && (
                      <div className="space-y-4">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline
                          muted
                          className="w-64 h-48 rounded-lg mx-auto border"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button onClick={takeSelfie} className="bg-[#05696b] hover:bg-[#05696b]/90">
                            <Camera className="w-4 h-4 mr-2" />
                            Capture Photo
                          </Button>
                          <Button variant="outline" onClick={stopCamera}>
                            Cancel
                          </Button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    )}

                    {doctorData.selfieImage && (
                      <div className="space-y-4">
                        <img 
                          src={doctorData.selfieImage} 
                          alt="Selfie" 
                          className="w-32 h-24 rounded-lg mx-auto border object-cover"
                        />
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Selfie captured successfully
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            handleInputChange('selfieImage', '')
                            startCamera()
                          }}
                          className="text-sm"
                        >
                          Retake Photo
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800">Verification Guidelines</h4>
                        <ul className="text-sm text-amber-700 mt-1 space-y-1">
                          <li>• Ensure your face is clearly visible and well-lit</li>
                          <li>• Match the photo on your ID document</li>
                          <li>• Remove any accessories that obscure your face</li>
                          <li>• Look directly at the camera</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t mt-8">
                {verificationStep > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="px-6">
                    Previous Step
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {verificationStep === 3 ? (
                  <Button 
                    onClick={submitVerification}
                    className="bg-[#05696b] hover:bg-[#05696b]/90 px-8"
                    disabled={uploading || !validateStep(3)}
                  >
                    {uploading ? 'Submitting...' : 'Submit for Verification'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    className="bg-[#05696b] hover:bg-[#05696b]/90"
                    disabled={!validateStep(verificationStep)}
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                Verification Submitted
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowSuccess(false)}>
                <X className="w-5 h-5" />
              </Button>
            </DialogHeader>
            <div className="py-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank you for submitting your verification!</h3>
              <p className="text-gray-600">
                Your documents are now under review. This process typically takes 24-48 hours. 
                You'll receive a notification once your verification is complete.
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setShowSuccess(false)} className="bg-[#05696b] hover:bg-[#05696b]/90">
                Continue to Dashboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>

       
      </div>
    </div>
  )
}