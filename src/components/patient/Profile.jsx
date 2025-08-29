// components/Profile
import { Button } from "@/components/ui/button";
import {
  Edit,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplet,
  AlertTriangle,
  Activity,
  Users
} from "lucide-react";

export default function Profile({ patientData = {}, setIsEditingProfile }) {
  const {
    name = "Unnamed User",
    email = "no-email",
    phone = "N/A",
    dateOfBirth = "N/A",
    address = "",
    bio = "",
    bloodType = "",
    allergies = "",
    conditions = "",
    emergencyContact = "",
    emergencyPhone,
    photoURL,
    profileImage,
    gender='',
    stats = {}
  } = patientData || {};

  const avatarSrc = photoURL || profileImage || "";
  const totalAppointments = stats.appointments ?? 0;
  const doctorsVisited = stats.doctorsVisited ?? 0;
  const filesUploaded = stats.filesUploaded ?? 0;

  return (
    <div className="w-full py-6">
      {/* Header / Cover */}
      <div className="w-full h-36 md:h-44 rounded-xl bg-gradient-to-r from-[#05696b] via-[#05696b]/90 to-[#05696b]/70" />

      {/* Avatar + Name Row */}
      <div className="px-4 sm:px-6 -mt-12 md:-mt-14">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" />{email}</span>
                <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</span>
               
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile?.(true)}>
                <Edit className="w-4 h-4 mr-1" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* About */}
          <div className="rounded-xl border bg-white p-4 md:p-5">
            <div className=" grid grid-cols-1 gap-3 text-sm">
              <div className="inline-flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-600">Date of Birth:</span>
                <span className="text-gray-700">{dateOfBirth}</span>
              </div>
              {location ? (
                <div className="inline-flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-600">Address:</span>
                  <span className="text-gray-700">{address}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border bg-white p-4 md:p-5">
            <h3 className="text-base font-semibold text-gray-800">Emmergency Contact</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-700"> {emergencyContact}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-600">Phone:</span>
                <span className="text-gray-700"> {emergencyPhone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-500">Appointments</span>
                <Activity className="w-4 h-4 text-sky-500" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{totalAppointments}</div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-500">Doctors</span>
                <Users className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{doctorsVisited}</div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-500">Files</span>
                <User className="w-4 h-4 text-teal-500" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{filesUploaded}</div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="rounded-xl border bg-white p-4 md:p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <Droplet className="w-4 h-4 text-red-500" />
                <span className="font-medium text-gray-600">Blood Type:</span>
                <span className="text-gray-800">{bloodType || "Not specified"}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-gray-600">Conditions:</span>
                <span className="text-gray-800">{conditions || "None specified"}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-gray-600">Allergies:</span>
                <span className="text-gray-800">{allergies || "None specified"}</span>
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-gray-600">Gender:</span>
                <span className="text-gray-800">{gender || "None specified"}</span>
              </p>


              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}