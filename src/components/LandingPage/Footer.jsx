export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
            </div>
  
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} MedFi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }