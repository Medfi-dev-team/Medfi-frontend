"use client"
import { ThirdwebProvider } from "thirdweb/react"
import { createThirdwebClient } from "thirdweb"
import { polygonAmoy } from "thirdweb/chains"

export const client = createThirdwebClient({ clientId: "6770beb40d16e6b81ce8b6adda324bc8" })

export function Providers({ children }) {
  return (
    <ThirdwebProvider
      client={client}
      chain={polygonAmoy}
    >
      {children}
    </ThirdwebProvider>
  )
}