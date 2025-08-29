'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PublicPatientProfile from "@/components/patient/PublicPatientProfile";

export default function ProfIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Patient Profile Access</h1>
        <p className="text-gray-600 mb-6">
          To view a patient profile, navigate to:
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded text-sm">
            /profile/prof/[wallet-address]
          </code>
        </p>
        <p className="text-sm text-gray-500">
          Replace [wallet-address] with the actual wallet address of the patient.
        </p>
      </div>
    </div>
  );
}