"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AppointmentBookingSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <section className="py-10 md:w-[90%] mx-auto md:rounded-2xl text-white bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
      
      <div className="absolute inset-0 -z-10">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source
            src="/video.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>
      <div className="container mx-auto px-4 md:px-0">
        <motion.div
          className=" md:w-[90%] mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Left side - Content */}
          <motion.div variants={fadeInUp} className="space-y-8 flex justify-between items-center md:flex-row flex-col">
            <div>
              <h2 className="md:text-5xl text-3xl font-serif font-bold text-white mb-6 leading-tight">
               Book Appointment
                <br />
                <span className="">With 100+ Trusted Doctors</span>
              </h2>
              <p className="md:text-xl text-md text-gray-200 mb-8 leading-relaxed">
                We know how large objects will act, but things on a small scale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 bg-[#05696b] hover:bg-[#05696b]/90">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                 Join the waitlist
                </Button>
              </div>
            </div>

            {/* Appointment Form */}
            <Card className="border-border shadow-lg md:w-[40%] py-6">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-center">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name *</Label>
                  <Input id="fullName" placeholder="Full Name *" readOnly className="h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address *</Label>
                  <Input id="email" type="email" placeholder="example@gmail.com" readOnly className="h-12" />
                </div>

               <div className="flex items-center justify-between">
                 <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select disabled>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Select disabled>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="4:00 Available" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
               </div>

                <Button  className="w-full h-12 text-lg bg-[#05696b] hover:bg-[#05696b]/90">Book Appointment</Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
