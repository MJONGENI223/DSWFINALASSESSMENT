import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/firestoreService';

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
    rooms: '1',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const calculateTotal = useMemo(() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return hotel.price;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * hotel.price * parseInt(bookingData.rooms) : hotel.price;
  }, [bookingData, hotel.price]);

  const validateBooking = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    if (checkOut <= checkIn) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return false;
    }

    if (parseInt(bookingData.guests) < 1) {
      Alert.alert('Error', 'Number of guests must be at least 1');
      return false;
    }

    if (parseInt(bookingData.rooms) < 1) {
      Alert.alert('Error', 'Number of rooms must be at least 1');
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const bookingDetails = {
        hotel: {
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          price: hotel.price,
          image: hotel.image,
        },
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        rooms: parseInt(bookingData.rooms),
        specialRequests: bookingData.specialRequests,
        total: calculateTotal,
      };

      const booking = await bookingService.createBooking(user.uid, bookingDetails);
      
      
      navigation.navigate('BookingConfirmation', { booking });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
        </View>

        <View style={styles.bookingForm}>
          {/* Form inputs remain the same */}
          {/* ... */}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Room Rate</Text>
            <Text style={styles.summaryValue}>${hotel.price}/night</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Number of Rooms</Text>
            <Text style={styles.summaryValue}>{bookingData.rooms}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.total}>${calculateTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]} 
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default BookingScreen;