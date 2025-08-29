'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PublicPatientProfile from "@/components/patient/PublicPatientProfile";

export default function PatientProfilePage() {
  const params = useParams();
  const address = params?.address || "";

  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log('PatientProfilePage params:', params);
  console.log('Extracted address:', address);

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        console.log('No address provided, skipping fetch');
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching data for address:', address);
        const ref = doc(db, "patients", address);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        console.log('Fetched patient data:', data);
        setPatientData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setPatientData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05696b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No wallet address provided</p>
        </div>
      </div>
    );
  }

  return (
    <PublicPatientProfile 
      patientData={patientData || {}} 
      address={address} 
    />
  );
}