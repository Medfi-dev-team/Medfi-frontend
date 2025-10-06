'use client'

import Hero from "@/components/Re-usuable-hero/hero"
import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  return (
    <div>
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1666886573516-69191667b004?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGFmcmljYSUyMG1lZGljYWwlMjBjb25zdWx0YXRpb258ZW58MHx8MHx8fDA%3D"
        title="Get In Touch"
        subtitle="We're here to help you with any questions about MedFi"
        showCTA={false}
        
      />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="">
         

          {/* Contact Form */}
          <div className="bg-white md:max-w-[70%] mx-auto rounded-2xl shadow border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you soon.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300  rounded-xl focus:ring-0 outline-0 focus:ring-blue-500  transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-0 outline-0 focus:ring-blue-500  transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-0 outline-0 focus:ring-blue-500  transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#05696b] text-white font-semibold py-4 px-6 rounded-xl  transition-all duration-300 transform hover:scale-[1.02]"
              >
                Send Message
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our privacy policy.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Quick answers to common questions about MedFi and our services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How does MedFi ensure data privacy?",
                answer: "We use blockchain technology to encrypt and secure your medical data, giving you complete control over who can access it."
              },
              {
                question: "Is MedFi available in my country?",
                answer: "MedFi is currently available in most countries. Contact us to check availability in your region."
              },
              {
                question: "How do I become a verified healthcare provider?",
                answer: "Healthcare providers can apply through our verification process which includes credential checks and hospital affiliation."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We use USDC for secure, transparent payments. Traditional payment options are also available in some regions."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}