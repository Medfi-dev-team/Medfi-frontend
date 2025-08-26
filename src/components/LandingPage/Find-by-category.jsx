"use client"

import { motion } from "framer-motion"
import { Stethoscope, Heart, Brain, Baby, Eye, Users } from "lucide-react"

export default function FindBySpeciality() {
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

  const specialties = [
    { name: "General physician", icon: Stethoscope, color: "bg-blue-100 hover:bg-blue-200" },
    { name: "Gynecologist", icon: Heart, color: "bg-pink-100 hover:bg-pink-200" },
    { name: "Dermatologist", icon: Eye, color: "bg-purple-100 hover:bg-purple-200" },
    { name: "Pediatricians", icon: Baby, color: "bg-yellow-100 hover:bg-yellow-200" },
    { name: "Neurologist", icon: Brain, color: "bg-indigo-100 hover:bg-indigo-200" },
    { name: "Gastroenterologist", icon: Users, color: "bg-green-100 hover:bg-green-200" },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Find by Speciality</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:w-[90%] mx-auto justify-items-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {specialties.map((specialty, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex flex-col items-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`w-20 h-20 rounded-full ${specialty.color} flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-lg`}
              >
                <specialty.icon className="w-8 h-8 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {specialty.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
