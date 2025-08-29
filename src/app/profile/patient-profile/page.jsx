"use client"
import { useState, useEffect } from "react"
import { useActiveAccount } from "thirdweb/react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import TabContent from "@/components/patient/TabContent"
import Header from "@/components/patient/Header"
import Profile from "@/components/patient/Profile"
import ProfileSetupCard from "@/components/patient/ProfileSetupCard"
import ProfileForm from "@/components/patient/ProfileForm"


export default function PatientDashboard() {
  const activeAccount = useActiveAccount()
  const address = activeAccount?.address
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    about: "",
    bloodType: "",
    allergies: "",
    conditions: "",
    emergencyContact: "",
    emergencyPhone: "",
    profileImage: ""
  })

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!address) return;
      
      try {
        const docRef = doc(db, "patients", address);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() || {}
          setPatientData(prev => ({
            ...prev,
            ...data,
            // Ensure known fields are at least empty strings when missing
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            dateOfBirth: data.dateOfBirth ?? "",
            gender: data.gender ?? "",
            address: data.address ?? "",
            about: data.about ?? "",
            bloodType: data.bloodType ?? "",
            allergies: data.allergies ?? "",
            conditions: data.conditions ?? "",
            emergencyContact: data.emergencyContact ?? "",
            emergencyPhone: data.emergencyPhone ?? "",
            profileImage: data.profileImage ?? "",
          }));
          setHasProfile(true);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [address]);

  const appointments = []
  const medicalRecords = []
  const dashboardStats = {
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalRecords: 0,
    lastVisit: null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05696b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 pb-8">
      {/*}  <Header 
          address={address} 
          patientData={patientData} 
          hasProfile={hasProfile} 
          dashboardStats={dashboardStats} 
        /> */}


<div className="space-y-6">
  
          {!hasProfile && !isEditingProfile && (
           <div>
            <Header address={address} />
             <ProfileSetupCard setIsEditingProfile={setIsEditingProfile} />
           </div>
          )}
          
          {isEditingProfile && (
            <ProfileForm
              patientData={patientData}
              setPatientData={setPatientData}
              setIsEditingProfile={setIsEditingProfile}
              setHasProfile={setHasProfile}
              address={address}
            />
          )}
          
          {hasProfile && !isEditingProfile && (
            <>
              <Profile
                patientData={patientData} 
                setIsEditingProfile={setIsEditingProfile} 
              />
              
            
            </>
          )}
        </div>
        <TabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isEditingProfile={isEditingProfile}
          setIsEditingProfile={setIsEditingProfile}
          hasProfile={hasProfile}
          setHasProfile={setHasProfile}
          patientData={patientData}
          setPatientData={setPatientData}
          appointments={appointments}
          medicalRecords={medicalRecords}
          address={address}
        />
      </div>
    </div>
  )
}