// services/firebaseService.js
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
  } from 'firebase/firestore';
 import { db } from '@/lib/firebase';

  
  const DOCTORS_COLLECTION = 'doctors';
  
  // Save or update doctor data
  export const saveDoctorData = async (walletAddress, doctorData) => {
    try {
      const doctorRef = doc(db, DOCTORS_COLLECTION, walletAddress);
      await setDoc(doctorRef, {
        ...doctorData,
        updatedAt: serverTimestamp(),
        walletAddress: walletAddress
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error saving doctor data:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Get doctor data by wallet address
  export const getDoctorData = async (walletAddress) => {
    try {
      const doctorRef = doc(db, DOCTORS_COLLECTION, walletAddress);
      const doctorSnap = await getDoc(doctorRef);
      
      if (doctorSnap.exists()) {
        return { 
          success: true, 
          data: doctorSnap.data() 
        };
      } else {
        return { 
          success: false, 
          error: 'No doctor data found' 
        };
      }
    } catch (error) {
      console.error('Error getting doctor data:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Update verification status
  export const updateVerificationStatus = async (walletAddress, status) => {
    try {
      const doctorRef = doc(db, DOCTORS_COLLECTION, walletAddress);
      await updateDoc(doctorRef, {
        status: status,
        updatedAt: serverTimestamp(),
        ...(status === 'pending' && { submittedAt: serverTimestamp() })
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating verification status:', error);
      return { success: false, error: error.message };
    }
  };