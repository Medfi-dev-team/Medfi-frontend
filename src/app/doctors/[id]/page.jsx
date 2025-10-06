'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faStar, faMapMarkerAlt, faPhone, faHospital } from '@fortawesome/free-solid-svg-icons';
import { CheckCircle, Calendar, Clock , ShieldCheck} from 'lucide-react';
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";

import Link from 'next/link';

function DoctorsDetails() {
  const { id } = useParams(); // Next.js useParams
  const router = useRouter(); // Next.js useRouter instead of useNavigate
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch doctor data from Firebase
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        
        // Fetch main doctor data
        const docRef = doc(db, "doctors", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().status === 'approved') {
          const doctorData = { id: docSnap.id, ...docSnap.data() };
          setDoctor(doctorData);
          
          // Fetch related doctors (same specialty)
          const doctorsRef = collection(db, "doctors");
          const q = query(
            doctorsRef, 
            where("status", "==", "approved"),
            where("specialty", "==", doctorData.specialty),
            where("__name__", "!=", id),
            limit(4)
          );
          
          const querySnapshot = await getDocs(q);
          const relatedDocs = [];
          querySnapshot.forEach((doc) => {
            relatedDocs.push({ id: doc.id, ...doc.data() });
          });
          setRelatedDoctors(relatedDocs);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: date.getMonth() + 1,
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Handle booking navigation with state
  const handleBookAppointment = () => {
    // Using URLSearchParams to pass state in Next.js
    const params = new URLSearchParams({
      doctorId: doctor.id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      fee: doctor.consultationFee || '50'
    });

    router.push(`/booking?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="md:pt-[13%] pt-[33%]">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0EBE7F] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="md:pt-[13%] pt-[33%]">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-gray-400 text-xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500">The doctor you're looking for is not available.</p>
          <Link 
            href="/doctors"
            className="mt-4 bg-[#0EBE7F] text-white py-2 px-6 rounded-full hover:bg-[#0daa70] transition-colors inline-block"
          >
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='md:pt-[8%] pt-[33%]'>
      <div className='md:px-8 px-6'>
        {/* Main Doctor Info */}
        <div className='flex items-center md:items-start justify-center md:flex-row flex-col md:gap-8 gap-6'>
          {/* Doctor Image */}
          <div className='flex-shrink-0'>
            <div className='bg-[#05696b]/10 shadow rounded-lg p-6'>
              <img 
                src={doctor.profileImage || '/doctor-placeholder.png'} 
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                className='w-64 h-80 rounded-lg object-center object-cover  mx-auto'
              />
            </div>
          </div>

          {/* Doctor Details */}
          <div className='md:w-3/6 w-full'>
            <div className='bg-white p-6 md:p-8 shadow rounded-lg'>
              {/* Name and Verification */}
              <div className='flex items-center gap-3 mb-4'>
                <h2 className='font-bold text-2xl text-gray-900'>
                  Dr. {doctor.firstName} {doctor.lastName}
                </h2>
                <div className="flex items-center gap-1 text-[#0EBE7F]">
                <ShieldCheck className="w-6 h-6 text-white" fill="#05696b" />
                 
                </div>
              </div>

              {/* Specialty and Experience */}
              <div className='flex flex-col md:flex-row md:items-center gap-2 mb-4'>
                <p className='font-semibold text-gray-900 text-lg'>{doctor.specialty}</p>
                <span className='text-gray-500 py-1 px-3 border rounded-full text-sm w-fit'>
                  {doctor.yearsExperience || '0'} Years Experience
                </span>
              </div>

              {/* Hospital/Clinic */}
              {doctor.hospital && (
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <FontAwesomeIcon icon={faHospital} className="w-4 h-4" />
                  <span className="text-sm">{doctor.hospital}</span>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                )}
                {doctor.country && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                    <span className="text-sm">{doctor.country}</span>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div className='mb-4'>
                <h5 className='text-gray-900 font-medium text-lg mb-2 flex items-center gap-2'>
                  <FontAwesomeIcon icon={faCircleExclamation} className='w-4' />
                  About
                </h5>
                <p className='text-sm text-gray-800 leading-relaxed'>
                  {doctor.bio || `${doctor.firstName} is a dedicated ${doctor.specialty} with ${doctor.yearsExperience || 'several'} years of experience. Committed to providing comprehensive medical care with a focus on preventive medicine, early diagnosis, and effective treatment strategies.`}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-4 h-4" />
                  <span className="font-medium text-gray-700">
                    {doctor.rating || '5.0'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({doctor.reviews || 0} reviews)
                </span>
              </div>

              {/* Consultation Fee */}
              <h5 className='pt-2 font-bold text-gray-600'>
                Consultation Fee: <span className='text-gray-950'>${doctor.consultationFee || '50'}</span>
              </h5>
            </div>

            {/* Booking Section */}
            <div className="mt-6">
              <h5 className='font-bold text-lg mb-4'>Book Appointment</h5>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h6 className="font-semibold text-gray-700 mb-3">Select Date</h6>
                <div className='grid grid-cols-4 md:grid-cols-7 gap-2'>
                  {dates.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date.fullDate)}
                      className={`border rounded-lg p-3 flex flex-col items-center justify-center gap-1 transition-colors ${
                        selectedDate === date.fullDate 
                          ? 'bg-[#05696b] text-white border-[#05696b]' 
                          : 'text-gray-600 hover:border-[#05696b]'
                      }`}
                    >
                      <span className="text-xs font-medium">{date.day}</span>
                      <span className="text-sm font-semibold">{date.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <h6 className="font-semibold text-gray-700 mb-3">Available Time Slots</h6>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={`border rounded-full py-2 px-3 text-sm transition-colors ${
                        selectedTime === time 
                          ? 'bg-[#05696b] text-white border-[#05696b]' 
                          : 'text-gray-600 hover:border-[#05696b]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBookAppointment}
                className='text-lg bg-[#05696b] text-white py-3 px-8 rounded-full hover:bg-[#05696b] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                disabled={!selectedTime}
              >
                Book Appointment - ${doctor.consultationFee || '50'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Doctors */}
        {relatedDoctors.length > 0 && (
          <div className='pt-12 pb-8'>
            <h3 className='text-center font-bold text-2xl mb-2'>Related Doctors</h3>
            <p className='text-center text-sm text-gray-600 mb-6'>
              Other specialists in {doctor.specialty}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDoctors.map((relatedDoctor) => (
                <Link 
                  key={relatedDoctor.id}
                  href={`/doctors/${relatedDoctor.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  <div className="flex justify-center bg-[#05696b]/10 p-4 rounded-t-lg">
                    <img
                      src={relatedDoctor.profileImage || '/doctor-placeholder.png'}
                      alt={`Dr. ${relatedDoctor.firstName} ${relatedDoctor.lastName}`}
                      className="w-36 h-36 rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">
                        Dr. {relatedDoctor.firstName} {relatedDoctor.lastName}
                      </h4>
                      <ShieldCheck className="w-6 h-6 text-white" fill="#05696b" />
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{relatedDoctor.specialty}</p>
                  
                    <div className="flex items-center gap-1 mt-2">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-3 h-3" />
                      <span className="text-xs font-medium text-gray-700">
                        {relatedDoctor.rating || '5.0'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
  
    </div>
  );
}

export default DoctorsDetails;