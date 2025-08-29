'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Shield, Users, Star, Zap } from "lucide-react"

export default function TrustAndCTASection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    viewport: { once: true, margin: "-100px" }
  }

  const staggerChildren = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    viewport: { once: true }
  }

  const childVariant = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const stats = [
    { number: "5,800+", label: "Verified Professionals", icon: Users },
    { number: "50,000+", label: "Secure Transactions", icon: Shield },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ]

  const features = [
    "Hospital verification and professional registration validation",
    "Smart contract escrow for secure payment protection", 
    "Encrypted medical records with patient-controlled access",
    "Transparent rating system for quality assurance"
  ]

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#05696b]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#edb23d]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative">
        {/* Trust Section */}
        <motion.div className="flex justify-center w-[90%] mx-auto items-center mb-24" {...fadeInUp}>
          <div className="space-y-8">
            <div className="space-y-6">
              <motion.div
                className="flex justify-center w-fit mx-auto items-center gap-2 px-4 py-2 bg-[#05696b]/10 text-[#05696b] rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-4 h-4" />
                Blockchain Security
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl text-center font-serif font-bold text-gray-900 leading-tight">
                Built on Trust & 
                <span className="text-[#05696b]"> Security</span>
              </h2>
              
              <p className="md:text-xl text-md text-center md:w-[80%] mx-auto  text-gray-600 leading-relaxed">
                Every healthcare professional on MedFi is verified through our rigorous blockchain-based registry
                system, ensuring you receive care from legitimate, qualified providers.
              </p>
            </div>

            <motion.div className="space-y-4" variants={staggerChildren}>
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex  md:w-[50%] mx-auto gap-4 group"
                  variants={childVariant}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-6 h-6 text-[#05696b] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

         
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center space-y-8" {...fadeInUp}>
          <div className="space-y-6 max-w-4xl mx-auto">
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Ready to Experience 
              <br />
              <span className="text-[#05696b]">Decentralized Healthcare?</span>
            </h2>
            
            <p className="md:text-xl text-md text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Join thousands of patients and healthcare professionals who trust MedFi for secure, transparent medical
              services powered by blockchain technology.
            </p>
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center pt-3 md:pt-8"
            variants={staggerChildren}
          >
            <motion.div variants={childVariant}>
              <Button 
                size="lg" 
                className="group text-lg px-10 py-4 bg-[#05696b] hover:bg-[#05696b]/90 text-white shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1 hover:scale-105"
              >
                Start as Patient
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
            
            <motion.div variants={childVariant}>
              <Button 
                variant="outline" 
                size="lg" 
                className="group text-lg px-10 py-4 bg-[#e8b43a] hover:bg-[#e8b43a]/90 text-gray-900 border-[#e8b43a] shadow-lg hover:shadow-xl transition-all duration-400 hover:-translate-y-1 hover:scale-105"
              >
                Join as Professional
                <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 pt-6 md:pt-12 opacity-60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4" />
              HIPAA Certified
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="w-4 h-4" />
              99.9% Uptime
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}