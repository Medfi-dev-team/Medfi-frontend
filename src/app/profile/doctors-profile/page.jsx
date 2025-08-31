"use client"
import { useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { Button } from "@/components/ui/button"
import { User, Calendar, FileText, Shield, Clock, Bell, TrendingUp, CreditCard, MessageSquare, Star, CheckCircle, Clock4, AlertCircle, ArrowRight } from "lucide-react"

export default function DoctorDashboard() {
  const activeAccount = useActiveAccount()
  const address = activeAccount?.address
  const [activeTab, setActiveTab] = useState('overview')
  const [isVerified, setIsVerified] = useState(false) // Set to false for onboarding

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: FileText }
  ]

  // Sample data that would be available after verification
  const dashboardStats = {
    totalPatients: 0,
    upcomingAppointments: 0,
    monthlyEarnings: 0,
    patientSatisfaction: 0
  }

  const pendingAppointments = [] // Empty until verified

  const recentPatients = [] // Empty until verified

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome to MedFi, Doctor</h1>
              <p className="text-gray-600">Complete your verification to start your practice</p>
              <p className="text-sm text-gray-500 mt-1">Wallet: {address?.slice(0, 8)}...{address?.slice(-6)}</p>
            </div>
            {!isVerified && (
              <div className="bg-[#05696b]/10 border border-[#05696b] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 " />
                  <span className="font-medium ">Verification Required</span>
                </div>
                <p className="text-sm ">Complete verification to start accepting patients</p>
                <Button className="mt-2 bg-[#05696b] hover:bg-[#05696b]/90">Start Verification</Button>
              </div>
            )}
          </div>
        </div>

        {/* Onboarding Guidance */}
      
          <div className=" shadow bg-white rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#05696b] text-white p-3 rounded-full">
                <Clock className="w-6 h-6 " />
              </div>
              <div>
                <h3 className="text-lg font-semibold  mb-2">Account Verification Required</h3>
                <p className=" mb-4">
                  Before you can access the full features of MedFi, we need to verify your medical credentials. 
                  This process ensures the highest quality of care for our patients.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-[#05696b]/10 p-4 rounded-lg ">
                    <div className="bg-[#05696b] text-white w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <span className=" font-bold">1</span>
                    </div>
                    <h4 className="font-medium 0">Submit Documents</h4>
                    <p className="text-sm ">Upload your medical license and ID</p>
                  </div>
                  <div className="bg-[#05696b]/10 p-4 rounded-lg ">
                    <div className="bg-[#05696b] text-white w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <span className=" font-bold">2</span>
                    </div>
                    <h4 className="font-medium ">Verification Review</h4>
                    <p className="text-sm ">Our team reviews your credentials</p>
                  </div>
                  <div className="bg-[#05696b]/10 p-4 rounded-lg ">
                    <div className="bg-[#05696b] text-white w-10 h-10 rounded-full flex items-center justify-center mb-2">
                      <span className=" font-bold">3</span>
                    </div>
                    <h4 className="font-medium ">Start Practicing</h4>
                    <p className="text-sm ">Begin accepting patients on MedFi</p>
                  </div>
                </div>
                <Button className="bg-[#05696b] hover:bg-[#05696b]/90">
                  Begin Verification Process
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
      

       
      </div>
    </div>
  )
}