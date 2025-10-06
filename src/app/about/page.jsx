import Hero from "@/components/Re-usuable-hero/hero"

export default function About() {
  return (
    <div className="min-h-screen ">
      <Hero 
        backgroundImage="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNhbCUyMGNvbnN1bHRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
        title="About MedFi"
        subtitle="Revolutionizing healthcare through blockchain technology"
      />
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
       {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <div className="relative">
              <div className=" bg-[#05696b] rounded-2xl p-1 shadow-2xl">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1661727694264-777047d6eaef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Modern Healthcare Technology"
                  className="rounded-2xl w-full h-96 object-cover"
                />
              </div>
                  </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  About Medfi
                </h3>
              <p className="text-md text-gray-700 leading-relaxed">
                Welcome to <span className="font-semibold text-gray-900">MedFi</span>, your trusted partner in 
                decentralized healthcare management. We understand the challenges individuals face when it comes to 
                scheduling doctor appointments, managing health records, and ensuring data privacy in today's digital age.
              </p>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                MedFi is committed to excellence in healthcare technology. We continuously strive to enhance our platform, 
                integrating the latest blockchain advancements to improve user experience and deliver superior, 
                trustless service. Whether you're booking your first appointment or managing ongoing care, 
                MedFi supports you every step of the way.
              </p>
            </div>

            {/* Vision Card */}
            <div className="">
              <div className="flex items-center gap-4 mb-4">
               
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-700 text-md leading-relaxed">
                Our vision at MedFi is to create a seamless, decentralized healthcare experience for every user. 
                We aim to bridge the gap between patients and healthcare providers using blockchain technology, 
                making it easier for you to access the care you need while maintaining complete control over your data.
              </p>
            </div>
          </div>
        </div>

      

        {/* CTA Section */}
        <div className="bg-[#05696b] rounded-3xl p-12 text-center text-white mb-4">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Decentralized Healthcare?
          </h3>
          <p className="text-sm mb-8 opacity-90 max-w-2xl mx-auto">
            Join MedFi today and take control of your healthcare journey with blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
             <a href="/doctors">
             Get Started
             </a>
            </button>
           
          </div>
        </div>
      </div>

 
    </div>
  )
}