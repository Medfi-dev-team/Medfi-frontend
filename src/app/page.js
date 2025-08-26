import FindBySpeciality from "@/components/LandingPage/Find-by-category";
import HeroSection from "@/components/LandingPage/HeroSection";
import TopDoctors from "@/components/LandingPage/Top-doctors";
import AppointmentBookingSection from "@/components/LandingPage/Appointment";
import TrustAndCTASection from "@/components/LandingPage/Security";
export default function Home() {
  return (
   <div>
     <HeroSection />
     <FindBySpeciality />
     <TopDoctors />
     <AppointmentBookingSection />
     <TrustAndCTASection/>
   </div>
  );
}
