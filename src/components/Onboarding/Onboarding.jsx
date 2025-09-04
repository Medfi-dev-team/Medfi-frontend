"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User, UserCheck, ArrowRight, X } from "lucide-react"

export default function OnboardingModal({ isOpen, onClose }) {
  const [selectedUserType, setSelectedUserType] = useState(null)

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type)
    if (type === 'patient') {
      window.location.href = '/personal-profile/patient-profile'
    } else {
      window.location.href = '/personal-profile/doctors-verification'
    }
    onClose()
  }

  // FIX: Always render AnimatePresence at the top level
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="onboarding-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Join MedFi</h2>
              <p className="text-gray-600">Select your role to get started</p>
            </div>

            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => handleUserTypeSelect('patient')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#05696b] hover:bg-[#05696b]/5 transition-all duration-300 flex items-center justify-start gap-4 text-left"
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Patient</h3>
                    <p className="text-sm text-gray-600">Access healthcare services</p>
                  </div>
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => handleUserTypeSelect('doctor')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#05696b] hover:bg-[#05696b]/5 transition-all duration-300 flex items-center justify-start gap-4 text-left"
                >
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Doctor/Consultant</h3>
                    <p className="text-sm text-gray-600">Provide medical services</p>
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}