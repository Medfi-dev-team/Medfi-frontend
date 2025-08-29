// components/ProfileForm.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadImage } from "@/lib/cloudinary";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Edit, X } from "lucide-react";

export default function ProfileForm({
  patientData,
  setPatientData,
  setIsEditingProfile,
  setHasProfile,
  address
}) {
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(patientData.profileImage || null);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setProfileImage(imageUrl);
      setPatientData({...patientData, profileImage: imageUrl});
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Prepare payload without undefined values
      const sanitized = Object.fromEntries(
        Object.entries({
          ...patientData,
          walletAddress: address,
          updatedAt: new Date(),
        }).map(([key, value]) => [key, value === undefined ? null : value])
      )

      // Ensure profileImage is not undefined (Firestore disallows undefined)
      if (sanitized.profileImage === undefined) {
        sanitized.profileImage = null
      }

      // Save to Firebase
      await setDoc(doc(db, "patients", address), sanitized);
      
      setIsEditingProfile(false);
      setHasProfile(true);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) setIsEditingProfile(false); }}>
      <DialogContent className="md:max-w-4xl max-h-[90vh]  overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Set Up Your Profile</DialogTitle>
          
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Image Upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-[#05696b] rounded-full p-1 cursor-pointer">
                <Edit className="w-4 h-4 text-white" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-gray-600">Upload a profile photo</p>
              {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">Personal Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={patientData.name || ""}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={patientData.email || ""}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={patientData.phone || ""}
                  onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0  outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={patientData.dateOfBirth || ""}
                  onChange={(e) => setPatientData({...patientData, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <Select
                  value={patientData.gender || ""}
                  onValueChange={(value) => setPatientData({ ...patientData, gender: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={patientData.address || ""}
                  onChange={(e) => setPatientData({...patientData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  value={patientData.about || ""}
                  onChange={(e) => setPatientData({ ...patientData, about: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  rows={3}
                  placeholder="Tell us a bit about yourself"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">Medical Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <Select
                  value={patientData.bloodType || ""}
                  onValueChange={(value) => setPatientData({ ...patientData, bloodType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
                <textarea
                  value={patientData.allergies || ""}
                  onChange={(e) => setPatientData({...patientData, allergies: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  rows={3}
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                <textarea
                  value={patientData.conditions || ""}
                  onChange={(e) => setPatientData({...patientData, conditions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                  rows={3}
                  placeholder="List any ongoing medical conditions"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-medium text-gray-700 border-b pb-2">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={patientData.emergencyContact || ""}
                    onChange={(e) => setPatientData({...patientData, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                    placeholder="Name of emergency contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={patientData.emergencyPhone || ""}
                    onChange={(e) => setPatientData({...patientData, emergencyPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-0 outline-0 focus:ring-blue-500 focus:border-[#05696b]"
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile}
            disabled={saving || !patientData.name || !patientData.email || !patientData.phone || !patientData.dateOfBirth}
            className="bg-[#05696b] hover:bg-[#05696b]/90"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}