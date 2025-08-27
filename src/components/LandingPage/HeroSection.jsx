"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lock, Search, ArrowRight, MessageCircle } from "lucide-react"

export default function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source
            src="/video1.mp4"
            type="video/mp4"
          />
        </video>
         <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div {...fadeInUp}>
          <Badge variant="secondary" className="mb-6 bg-[#05696b]/90 text-white border-white/30">
            <Lock className="w-3 h-3 mr-1" />
           Powered by Blockchain
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            Quicker, Easier, Smarter
            <br />
            <span className="text-[#edb23d]">Decentralized Medical Care</span>
          </h1>

          <p className="text-md md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-white/90">
            MedFi streamlines your healthcare experience by connecting you with verified medical professionals through
            secure blockchain technology.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-30" />
              <Input
                placeholder="Search Doctors, Treatments, Specialists..."
                className="pl-12 py-4 md:text-md text-sm bg-white/95 backdrop-blur-sm border-white/20 text-foreground"
              />
            </div>
          </div>

         

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="text-md px-8 bg-[#05696b] hover:bg-[#05696b]/90">
              Find a Doctor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-md px-8 bg-transparent border-white/30 text-white hover:text-[#05696b] hover:bg-transparent"
            >
              Join as Professional
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
