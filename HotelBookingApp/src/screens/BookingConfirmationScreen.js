import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;

  const handleViewBookings = () => {
   
    navigation.navigate('Bookings');
  };

  const handleClose = () => {
    
    navigation.goBack();
    
   
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleClose}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmed</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successMessage}>
          Your booking at {booking.hotel.name} has been successfully confirmed.
        </Text>

        <View style={styles.bookingDetails}>
          <Text style={styles.detailsTitle}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hotel:</Text>
            <Text style={styles.detailValue}>{booking.hotel.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{booking.hotel.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-in:</Text>
            <Text style={styles.detailValue}>
              {new Date(booking.checkIn).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Check-out:</Text>
            <Text style={styles.detailValue}>
              {new Date(booking.checkOut).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guests:</Text>
            <Text style={styles.detailValue}>{booking.guests}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rooms:</Text>
            <Text style={styles.detailValue}>{booking.rooms}</Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${booking.total}</Text>
          </View>
        </View>

        {booking.specialRequests && (
          <View style={styles.specialRequests}>
            <Text style={styles.requestsLabel}>Special Requests:</Text>
            <Text style={styles.requestsValue}>{booking.specialRequests}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookingsButton}
          onPress={handleViewBookings}
        >
          <Text style={styles.bookingsButtonText}>View My Bookings</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  bookingDetails: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  specialRequests: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  requestsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requestsValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookingsButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingConfirmationScreen;