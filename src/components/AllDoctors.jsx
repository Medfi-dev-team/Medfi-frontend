"use client"

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { User, Star, CheckCircle,  ShieldCheck } from "lucide-react";
import Hero from "./Re-usuable-hero/hero";

function AllDoctors() {
  const activeAccount = useActiveAccount();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [accessWarning, setAccessWarning] = useState("");
  const [accessStatus, setAccessStatus] = useState(""); // "disconnected" | "unregistered" | "error" | ""

  // Shared categories and mapping to specialties
  const categories = [
    "All",
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
    "Category 6",
    "Category 7",
  ];

  const categoryMap = {
    "Category 1": "General Physician",
    "Category 2": "Gynecologist",
    "Category 3": "Dermatologist",
    "Category 4": "Pediatrician",
    "Category 5": "Neurologist",
    "Category 6": "Gastroenterologist",
    "Category 7": "Family Medicine",
  };

  // Fetch verified doctors from Firebase
  useEffect(() => {
    const fetchVerifiedDoctors = async () => {
      try {
        setLoading(true);
        const doctorsRef = collection(db, "doctors");
        const q = query(doctorsRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        
        const doctorsData = [];
        querySnapshot.forEach((doc) => {
          doctorsData.push({ id: doc.id, ...doc.data() });
        });
        
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedDoctors();
  }, []);

  // Check patient registration on wallet changes
  useEffect(() => {
    const verifyPatient = async () => {
      const address = activeAccount?.address;
      if (!address) {
        setAccessWarning("Wallet disconnected. Please connect your wallet to view doctors.");
        setAccessStatus("disconnected");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "patients", address));
        if (!snap.exists()) {
          setAccessWarning("This wallet is not registered as a patient. Complete your patient profile to continue.");
          setAccessStatus("unregistered");
          return;
        }
        setAccessWarning("");
        setAccessStatus("");
      } catch (err) {
        console.error("Error verifying patient:", err);
        setAccessWarning("Unable to verify patient profile. Please try again or refresh.");
        setAccessStatus("error");
      }
    };

    verifyPatient();
  }, [activeAccount]);

  const handleNavbarClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter doctors based on selected category
  const filteredDoctors = selectedCategory === "All" 
    ? doctors 
    : doctors.filter((doctor) => {
        return doctor.specialty === categoryMap[selectedCategory];
      });

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleCombinedClick = (category) => {
    closeNavbar();
    handleNavbarClick(category);
  };

  // Default placeholder image
  const defaultImage = "/doctor-placeholder.png";

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05696b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  // Block content if access is invalid (wallet disconnected or not registered)
  if (accessWarning) {
    const title = accessStatus === "disconnected"
      ? "Wallet Disconnected"
      : accessStatus === "unregistered"
        ? "Patient Profile Required"
        : "Verification Error";
    const description = accessStatus === "disconnected"
      ? "Connect your wallet to continue. For your security, doctor listings are only available to authenticated patients."
      : accessStatus === "unregistered"
        ? "This wallet doesn't have a patient profile yet. Create your patient profile to access verified doctors."
        : "We couldn't verify your patient profile right now. Please refresh the page or try again shortly.";

    return (
      <div className=" flex items-center justify-center pt-16 md:pt-32 px-6">
        <div className="w-full max-w-xl bg-white  border border-red-100 shadow-sm rounded-lg p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-700">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
          <p className="mt-1 text-sm text-gray-500">{accessWarning}</p>

          
          {accessStatus === "disconnected" && (
            <p className="mt-3 text-xs text-gray-500">Use the wallet connection button in the header to reconnect.</p>
          )}
        </div>
      </div>
    );
  }

  return (
   <div>
 <Hero 
        backgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGFmcmljYSUyMG1lZGljYWwlMjBjb25zdWx0YXRpb258ZW58MHx8MHx8fDA%3D"
        title="Our Doctors"
        subtitle="Book appointments with verified healthcare professionals"
        showCTA={false}
      />
<div className="md:mx-8 mx-4  pb-14">
        
      <div className=" md:px-8 pt-8">
        {accessWarning && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded">
            {accessWarning}
          </div>
        )}
        <div className="flex md:flex-row gap-6 flex-col justify-center">
          {/* Sidebar Filters */}
          <nav className="pb-4 pt-10 px-6 bg-white md:px-8 start-0">
            <h4 className="pb-3 text-md">
              Browse through the doctors specialist.
            </h4>
            
            {/* Mobile Filter Button */}
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                onClick={toggleNavbar}
                className="inline-flex items-center p-2 w-30 h-fit border justify-center text-sm text-gray-100 rounded-lg md:hidden bg-[#05696b] focus:outline-none focus:ring-0 focus:ring-gray-200"
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span className="text-lg px-2">Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            <div
              className={`items-center justify-between ${
                isOpen ? "block" : "hidden"
              } w-full md:flex doctor-nav md:w-auto md:order-1`}
              id="navbar-sticky"
            >
              <ul className="flex flex-col mt-4 font-medium md:flex-col md:mt-0">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => handleCombinedClick(cat)}
                      className="block mt-3 border py-2 px-6 text-left w-full text-gray-500 rounded-full hover:bg-gray-100"
                    >
                      {cat === "All" ? "All Specialties" : categoryMap[cat]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Doctors Grid */}
          <div className="flex-1">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500">
                  {selectedCategory === "All" 
                    ? "No verified doctors available at the moment." 
                    : `No ${selectedCategory.replace("Category ", "")} doctors found.`
                  }
                </p>
              </div>
            ) : (
              <div className="image-container mt-4 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    className="doctor-hover rounded-lg shadow transition hover:shadow-lg"
                    key={doctor.id}
                  >
                    <Link href={`/doctors/${doctor.id}`} className="block">
                      <div className="flex justify-center doctor-hover3 bg-[#05696b]/10 p-6">
                        <img
                          src={doctor.profileImage || defaultImage}
                          alt={`Dr. ${doctor.firstName}`}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                      </div>
                      <div className="bg-white px-6 pt-4 pb-5">
                        <div className="flex items-center gap-1 mb-2">
                          <h2 className="font-bold text-lg">
                            Dr. {doctor.firstName} 
                          </h2>
                          <div className=" text-white">
                            <ShieldCheck className="w-6 h-6 text-white" fill="#05696b" />
                           
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {doctor.specialty}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">
                              {doctor.rating || "5.0"}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({doctor.reviews || 0} reviews)
                            </span>
                          </div>
                          
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
   </div>

  );
}

export default AllDoctors;