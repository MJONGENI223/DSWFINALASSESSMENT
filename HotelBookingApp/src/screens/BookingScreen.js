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
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/firestoreService';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;
  const { user } = useAuth();
  
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    guests: '1',
    rooms: '1',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentDateType, setCurrentDateType] = useState(null);

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
        checkIn: bookingData.checkIn.toISOString(),
        checkOut: bookingData.checkOut.toISOString(),
        guests: parseInt(bookingData.guests),
        rooms: parseInt(bookingData.rooms),
        specialRequests: bookingData.specialRequests,
        total: calculateTotal,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        bookingId: `BKG${Date.now()}`, 
      };

     
      const booking = await bookingService.createBooking(user.uid, bookingDetails);
      
      console.log('Booking saved to database:', booking);
      
      
      navigation.replace('BookingConfirmation', { 
        booking: bookingDetails
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showDatePickerModal = (type) => {
    setCurrentDateType(type);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      if (currentDateType === 'checkIn') {
        setBookingData({...bookingData, checkIn: selectedDate});
      } else if (currentDateType === 'checkOut') {
        setBookingData({...bookingData, checkOut: selectedDate});
      }
    }
    setCurrentDateType(null);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
        </View>

        <View style={styles.bookingForm}>
          {/* Check-in Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-in Date</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => showDatePickerModal('checkIn')}
            >
              <Text style={bookingData.checkIn ? styles.dateText : styles.placeholderText}>
                {bookingData.checkIn ? formatDate(bookingData.checkIn) : 'Select check-in date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Check-out Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-out Date</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => showDatePickerModal('checkOut')}
            >
              <Text style={bookingData.checkOut ? styles.dateText : styles.placeholderText}>
                {bookingData.checkOut ? formatDate(bookingData.checkOut) : 'Select check-out date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Number of Guests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
              style={styles.input}
              value={bookingData.guests}
              onChangeText={(text) => setBookingData({...bookingData, guests: text.replace(/[^0-9]/g, '')})}
              keyboardType="numeric"
              placeholder="Enter number of guests"
              maxLength={2}
            />
          </View>

          {/* Number of Rooms */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Rooms</Text>
            <TextInput
              style={styles.input}
              value={bookingData.rooms}
              onChangeText={(text) => setBookingData({...bookingData, rooms: text.replace(/[^0-9]/g, '')})}
              keyboardType="numeric"
              placeholder="Enter number of rooms"
              maxLength={2}
            />
          </View>

          {/* Special Requests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Requests</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bookingData.specialRequests}
              onChangeText={(text) => setBookingData({...bookingData, specialRequests: text})}
              placeholder="Any special requests?"
              multiline
              numberOfLines={4}
            />
          </View>
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
          {bookingData.checkIn && bookingData.checkOut && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nights</Text>
              <Text style={styles.summaryValue}>
                {Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.total}>${calculateTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={currentDateType === 'checkIn' && bookingData.checkIn ? bookingData.checkIn : 
                 currentDateType === 'checkOut' && bookingData.checkOut ? bookingData.checkOut : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={currentDateType === 'checkOut' && bookingData.checkIn ? 
                      new Date(bookingData.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
        />
      )}

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666',
  },
  bookingForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summary: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingScreen;