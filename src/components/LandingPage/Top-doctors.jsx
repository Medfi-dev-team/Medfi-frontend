"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import Link from "next/link"

export default function TopDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Fetch verified doctors from Firebase
  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        setLoading(true);
        const doctorsRef = collection(db, "doctors");
        const q = query(
          doctorsRef, 
          where("status", "==", "approved"),
          // Remove orderBy temporarily to test
          limit(4)
        );
        
        const querySnapshot = await getDocs(q)
        const doctorsData = []
        
        querySnapshot.forEach((doc) => {
          doctorsData.push({ 
            id: doc.id, 
            ...doc.data() 
          })
        })
        
        setDoctors(doctorsData)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopDoctors()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="md:text-4xl text-3xl font-serif font-bold text-foreground mb-4">
              Top Doctors to Book
            </h2>
            <p className="md:text-xl text-md text-muted-foreground max-w-2xl mx-auto">
              Simply browse through our extensive list of trusted doctors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="h-full border-border bg-white rounded-lg">
                <div className="animate-pulse">
                  <div className="w-full h-72 bg-gray-300"></div>
                  <CardContent className="px-6 pb-4">
                    <div className="w-20 h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="w-32 h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="md:text-4xl text-3xl font-serif font-bold text-foreground mb-4">
            Top Doctors to Book
          </h2>
          <p className="md:text-xl text-md text-muted-foreground max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </motion.div>

        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Doctors Available</h3>
            <p className="text-gray-500">Check back later for verified healthcare professionals.</p>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                
              >
                <Link href={`/doctors/${doctor.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border group cursor-pointer overflow-hidden bg-white rounded-lg">
                    <div className="relative ">
                      <img
                        src={doctor.profileImage || "/doctor-placeholder.png"}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-60 object-contain   group-hover:scale-105 transition-transform duration-300"
                      />
                         </div>
                    <CardContent className="px-6 pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-[#05696b] rounded-full"></div>
                        <span className="text-sm text-[#05696b] font-medium">Available</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-muted-foreground">{doctor.specialty}</p>
                      
                     
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Doctors Button */}
        {doctors.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              href="/doctors"
              className="inline-flex items-center gap-2 bg-[#05696b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#05696b]/90 transition-colors duration-300"
            >
              View All Doctors
              
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}