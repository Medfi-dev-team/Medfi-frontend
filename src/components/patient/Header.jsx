// components/Header.js
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

export default function Header({ 
  address,
}) {
  const activeAccount = useActiveAccount();
  const resolvedAddress = address || activeAccount?.address || "";
  const shortAddress = resolvedAddress
    ? `${resolvedAddress.slice(0, 8)}...${resolvedAddress.slice(-6)}`
    : null;
  return (
    <div className="bg-whit  pb-6 pt-12 px-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Profile</h1>
          <p className="text-gray-600">
            Welcome to MedFi
          </p>
          
          <p className="text-sm text-gray-500 mt-1">
            {shortAddress ? `Wallet Address: ${shortAddress}` : "Wallet: Not connected"}
          </p>
        </div>
        {/* Quick Stats */}
        <div className="hidden md:flex gap-4">
          <div className="text-center ">
            <div className="bg-blue-100 p-3 w-fit mx-auto rounded-full mb-1">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-600">Appointments</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 w-fit mx-auto rounded-full mb-1">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-600">Records</p>
          </div>
        </div>
      </div>
    </div>
  );
}