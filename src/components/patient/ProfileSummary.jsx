// components/ProfileSummary.js
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

export default function ProfileSummary({ patientData, setIsEditingProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
       
        <div className="space-y-2 text-sm">
          <p><span className="font-medium text-gray-600"></span> {patientData.about}</p>
          </div>
      </div>

     
    </div>
  );
}