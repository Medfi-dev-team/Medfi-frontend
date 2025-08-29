"use client"
import { useState } from "react"
import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import Image from "next/image"
import OnboardingModal from "@/components/Onboarding/Onboarding"
import { client } from "@/app/providers"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [hasShownOnboarding, setHasShownOnboarding] = useState(false)
  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()
  const { disconnect } = useDisconnect()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleGetStarted = () => {
    setShowOnboarding(true)
    setIsMobileMenuOpen(false)
  }

  const handleGoToDashboard = () => {
    setShowOnboarding(true)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect(activeWallet || undefined)
      setOnboarded(false)
      setHasShownOnboarding(false)
      setShowOnboarding(false)
    } catch (error) {
      console.error("Error disconnecting:", error)
    }
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
    setOnboarded(true)
    setHasShownOnboarding(true)

  }

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#professionals", label: "Professionals" },
    { href: "#about", label: "About" }
  ]

  return (
    <>
      <motion.header
        className="border-b border-border bg-white sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4  lg:px-0 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="MedFi Logo" width={50} height={50} className="w-12 sm:w-16" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-all duration-500 ease-out group overflow-hidden rounded-lg"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">{item.label}</span>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#05696b] transform scale-x-0 group-hover:scale-x-100 origin-left"
                  initial={false}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-[#05696b]/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out rounded-lg" />
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {activeAccount ? (
              <>
                <Button 
                  size="lg" 
                  className="hover:scale-105 hover:bg-[#05696b]/90 hover:shadow-lg bg-[#05696b] text-white transition-all duration-400 ease-out hover:-translate-y-1 active:scale-105 active:translate-y-0"
                  onClick={handleGoToDashboard}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-red-100 hover:scale-105 hover:shadow-lg bg-white text-red-600 border-red-200 transition-all duration-400 ease-out hover:-translate-y-1 active:scale-105 active:translate-y-0 flex items-center gap-2"
                  onClick={handleDisconnect}
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </Button>
              </>
            ) : (
              <>
               
                <ConnectButton 
                  client={client}
                  theme="light"
                  modalTitle= "Login to MedFi"
                  connectButton={{
                    label: "Connect Wallet",
                    className: "w-full !rounded-md",
                    style: { backgroundColor: "#05696b", color: "#ffffff", padding: "0rem" }
                  }}
                  wallets={[
                    inAppWallet({ auth: { options: ["email", "google", "apple"] } }),
                    createWallet("io.metamask"),
                    createWallet("com.coinbase.wallet"),
                    createWallet("me.rainbow")
                  ]}
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-[#05696b]/10 hover:scale-110 transition-all duration-300 ease-out"
            aria-label="Toggle mobile menu"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#05696b]" />
              ) : (
                <Menu className="w-6 h-6 text-[#05696b]" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="border-t border-border bg-card/90 backdrop-blur-sm">
            <nav className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="relative block px-4 py-3 text-muted-foreground hover:text-foreground transition-all duration-500 ease-out group overflow-hidden rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 font-medium">{item.label}</span>
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#05696b] transform scale-x-0 group-hover:scale-x-100 origin-left"
                    initial={false}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-[#05696b]/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out rounded-lg" />
                </motion.a>
              ))}
              
              {/* Mobile Buttons */}
              <motion.div
                className="pt-6 border-t border-border space-y-3 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {activeAccount ? (
                  <>
                    <Button 
                      size="lg"
                      className="w-full hover:scale-105 hover:bg-[#05696b]/90 hover:shadow-lg bg-[#05696b] text-white transition-all duration-400 ease-out hover:-translate-y-0.5 active:scale-100 active:translate-y-0"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleGoToDashboard()
                      }}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full hover:bg-red-100 hover:scale-105 hover:shadow-lg bg-white text-red-600 border-red-200 transition-all duration-400 ease-out hover:-translate-y-0.5 active:scale-100 active:translate-y-0 flex items-center justify-center gap-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleDisconnect()
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    
                    <ConnectButton client={client}
                      theme="light"
                      connectButton={{
                        label: "Connect Wallet",
                        className: "w-full !rounded-md",
                        style: { backgroundColor: "#05696b", color: "#ffffff", padding: "0rem" }
                      }}
                      wallets={[
                        inAppWallet({ auth: { options: ["email", "google", "apple"] } }),
                        createWallet("io.metamask"),
                        createWallet("com.coinbase.wallet"),
                        createWallet("me.rainbow")
                      ]}
                      modalTitle="Login to MedFi"
                    />
                  </>
                )}
              </motion.div>
            </nav>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose} 
      />
    </>
  )
}