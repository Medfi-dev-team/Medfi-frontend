"use client"
import { ThirdwebProvider } from "@thirdweb-dev/react"

export function Providers({ children }) {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId="6770beb40d16e6b81ce8b6adda324bc8"
    >
      {children}
    </ThirdwebProvider>
  )
}