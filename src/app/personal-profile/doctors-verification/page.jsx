"use client"
import { useState, useEffect } from "react"

import { useActiveAccount, useActiveWallet } from "thirdweb/react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import DoctorDashboard from "@/components/doctors/DoctorsOnboarding"
import DoctorProfile from "../doctors-profile/page"

export default function DoctorPortal() {
  // Use ThirdWeb hooks for wallet connection
  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()
  const [verificationStatus, setVerificationStatus] = useState("loading")
  const [doctorData, setDoctorData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get the wallet address from ThirdWeb
  const walletAddress = activeAccount?.address

  // Load doctor data and check verification status from Firebase
  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        setLoading(true)
        
        if (!walletAddress) {
          console.log("No wallet connected")
          setVerificationStatus("unverified")
          setDoctorData(null)
          setLoading(false)
          return
        }
        
        console.log("Checking verification for wallet:", walletAddress)
        
        const docRef = doc(db, "doctors", walletAddress)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          console.log("Doctor data found:", data)
          setDoctorData(data)
          setVerificationStatus(data.status || "unverified")
        } else {
          console.log("No doctor data found for this wallet")
          setVerificationStatus("unverified")
          setDoctorData(null)
        }
      } catch (error) {
        console.error("Error loading doctor data:", error)
        setVerificationStatus("unverified")
        setDoctorData(null)
      } finally {
        setLoading(false)
      }
    }

    // Only load data if we have a wallet address
    if (walletAddress) {
      loadDoctorData()
    } else {
      // No wallet connected
      setLoading(false)
      setVerificationStatus("unverified")
      setDoctorData(null)
    }
  }, [walletAddress])  // Re-run when wallet address changes

  // Show loading state while checking verification status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-[95%] mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05696b] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Checking verification status...</h2>
          <p className="text-gray-600 max-w-[90%] mx-auto mt-2">
  Wallet: {walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
    : "Connecting..."}
</p>

        </div>
      </div> 
    )
  }

  // Show wallet connection prompt if no wallet is connected
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center max-w-[95%] mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the doctor portal</p>
          <p className="text-sm text-gray-500">Use the wallet connection button in your app header</p>
        </div>
      </div>
    )
  }

  console.log("Rendering with status:", verificationStatus)

  return (
    <>
      {verificationStatus === "approved" ? (
        <DoctorProfile />
      ) : (
        <DoctorDashboard />
      )}
    </>
  )
}