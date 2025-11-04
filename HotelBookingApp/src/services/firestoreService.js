import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    addDoc,
    onSnapshot
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { COLLECTIONS } from '../config/constants';
  
  // User operations
  export const userService = {
    // Create or update user profile
    createUserProfile: async (userId, userData) => {
      try {
        await setDoc(doc(db, COLLECTIONS.USERS, userId), {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    },
  
    // Get user profile
    getUserProfile: async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
        return userDoc.exists() ? userDoc.data() : null;
      } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
      }
    },
  
    // Update user profile
    updateUserProfile: async (userId, updates) => {
      try {
        await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    },
  };
  
  // Booking operations
  export const bookingService = {
    // Create a new booking
    createBooking: async (userId, bookingData) => {
      try {
        const bookingRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BOOKINGS);
        const booking = {
          ...bookingData,
          userId,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const docRef = await addDoc(bookingRef, booking);
        return { id: docRef.id, ...booking };
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
    },
  
    // Get user bookings
    getUserBookings: async (userId) => {
      try {
        const bookingsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BOOKINGS);
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting user bookings:', error);
        throw error;
      }
    },
  
    // Real-time listener for user bookings
    subscribeToUserBookings: (userId, callback) => {
      const bookingsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.BOOKINGS);
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(bookings);
      });
    },
  
    // Update booking status
    updateBookingStatus: async (userId, bookingId, status) => {
      try {
        const bookingRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.BOOKINGS, bookingId);
        await updateDoc(bookingRef, {
          status,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
      }
    },
  };
  
  // Review operations
  export const reviewService = {
    // Add a review for a hotel
    addReview: async (hotelId, reviewData) => {
      try {
        const reviewsRef = collection(db, COLLECTIONS.HOTELS, hotelId, COLLECTIONS.REVIEWS);
        const review = {
          ...reviewData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const docRef = await addDoc(reviewsRef, review);
        return { id: docRef.id, ...review };
      } catch (error) {
        console.error('Error adding review:', error);
        throw error;
      }
    },
  
    // Get reviews for a hotel
    getHotelReviews: async (hotelId) => {
      try {
        const reviewsRef = collection(db, COLLECTIONS.HOTELS, hotelId, COLLECTIONS.REVIEWS);
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting hotel reviews:', error);
        throw error;
      }
    },
  
    // Real-time listener for hotel reviews
    subscribeToHotelReviews: (hotelId, callback) => {
      const reviewsRef = collection(db, COLLECTIONS.HOTELS, hotelId, COLLECTIONS.REVIEWS);
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (querySnapshot) => {
        const reviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(reviews);
      });
    },
  
    // Check if user has already reviewed a hotel
    getUserReviewForHotel: async (hotelId, userId) => {
      try {
        const reviewsRef = collection(db, COLLECTIONS.HOTELS, hotelId, COLLECTIONS.REVIEWS);
        const q = query(reviewsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) return null;
        
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        console.error('Error getting user review:', error);
        throw error;
      }
    },
  };
  
  // Hotel operations
  export const hotelService = {
    // Get all hotels
    getHotels: async () => {
      try {
        const hotelsRef = collection(db, COLLECTIONS.HOTELS);
        const querySnapshot = await getDocs(hotelsRef);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting hotels:', error);
        throw error;
      }
    },
  
    // Get hotel by ID
    getHotelById: async (hotelId) => {
      try {
        const hotelDoc = await getDoc(doc(db, COLLECTIONS.HOTELS, hotelId));
        return hotelDoc.exists() ? { id: hotelDoc.id, ...hotelDoc.data() } : null;
      } catch (error) {
        console.error('Error getting hotel:', error);
        throw error;
      }
    },
  
    // Real-time listener for hotels
    subscribeToHotels: (callback) => {
      const hotelsRef = collection(db, COLLECTIONS.HOTELS);
      
      return onSnapshot(hotelsRef, (querySnapshot) => {
        const hotels = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(hotels);
      });
    },
  };