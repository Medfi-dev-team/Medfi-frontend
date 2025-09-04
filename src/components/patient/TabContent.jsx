// components/TabContent.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Calendar, FileText, Edit, Plus, Users } from "lucide-react";
import ProfileSetupCard from "./ProfileSetupCard";
import ProfileForm from "./ProfileForm";
import ProfileSummary from "./ProfileSummary";
import Header from "./Header";
import Link from "next/link";

export default function TabContent({
  activeTab,
  setActiveTab,
  isEditingProfile,
  setIsEditingProfile,
  hasProfile,
  setHasProfile,
  patientData,
  setPatientData,
  appointments,
  medicalRecords,
  address
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Tabs Navigation */}
      <div className="flex gap-3 flex-wrap md:gap-6 space-x-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center  gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#05696b] text-white'
                  : 'text-gray-600 border border-[#05696b] hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
            
          {!hasProfile && !isEditingProfile && (
            <ProfileSetupCard setIsEditingProfile={setIsEditingProfile} />
          )}
          
          
          
          {hasProfile && !isEditingProfile && (
            <>
              <ProfileSummary 
                patientData={patientData} 
                setIsEditingProfile={setIsEditingProfile} 
              />
              
            
            </>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">My Appointments</h3>
            <Link href='/doctors' className="md:block hidden"> <Button className="flex items-center gap-2 bg-[#05696b] hover:bg-[#05696b]">
              <Plus className="w-4 h-4" />
              Book New Appointment
            </Button></Link>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">No appointments yet</h4>
              <p className="text-gray-500 mb-4">Book your first appointment to get started with MedFi</p>
              <Link href='/doctors'> <Button className='bg-[#05696b] hover:bg-[#05696b]'>Book Your First Appointment</Button></Link>
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
                  <Button variant="outline" className='bg-[#05696b] hover:bg-[#05696b] '>View Details</Button>
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
              <Button onClick={() => setActiveTab('appointments')} className='bg-[#05696b]  hover:bg-[#05696b]'>Book an Appointment</Button>
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
                  <Button variant="outline " className='bg-[#05696b] hover:bg-[#05696b]'>View Record</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}