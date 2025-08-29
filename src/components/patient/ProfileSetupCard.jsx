// components/ProfileSetupCard.js
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";


export default function ProfileSetupCard({ setIsEditingProfile }) {
  return (
   <div>

     <div className="bg-gradient-to-br pt-8  border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#05696b] p-2 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Complete Your Profile</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Set up your medical profile to get personalized healthcare services and better treatment recommendations.
      </p>
      <Button 
        onClick={() => setIsEditingProfile(true)}
        className="bg-[#05696b] hover:bg-[#05696b]/90"
      >
        Set Up Profile
      </Button>
    </div>
   </div>
  );
}