import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/firestoreService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
  });
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUserData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      loadUserBookings();
      
      
      const unsubscribe = bookingService.subscribeToUserBookings(user.uid, (bookings) => {
        setUserBookings(bookings);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [user]);

  const loadUserBookings = async () => {
    try {
      const bookings = await bookingService.getUserBookings(user.uid);
      setUserBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setUpdating(true);
    try {
      await updateUserProfile({
        name: userData.name,
        phone: userData.phone,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editButton}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.infoText}>{userData.name}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.infoText}>{userProfile.email}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoText}>
                {userData.phone || 'Not provided'}
              </Text>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={[styles.saveButton, updating && styles.saveButtonDisabled]} 
              onPress={handleSaveProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Bookings</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
          ) : userBookings.length === 0 ? (
            <View style={styles.emptyBookings}>
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>
                Start exploring hotels to make your first booking!
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('ExploreTab')}
              >
                <Text style={styles.exploreButtonText}>Explore Hotels</Text>
              </TouchableOpacity>
            </View>
          ) : (
            userBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingHotel}>{booking.hotel.name}</Text>
                  <Text style={[
                    styles.bookingStatus,
                    booking.status === 'confirmed' && styles.statusConfirmed,
                    booking.status === 'cancelled' && styles.statusCancelled,
                  ]}>
                    {booking.status}
                  </Text>
                </View>
                <View style={styles.bookingDates}>
                  <Text style={styles.bookingDate}>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </Text>
                </View>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingDetail}>
                    {booking.guests} guest{booking.guests > 1 ? 's' : ''} • {booking.rooms} room{booking.rooms > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingTotal}>${booking.total}</Text>
                  <TouchableOpacity style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
 
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  statusConfirmed: {
    color: '#34C759',
  },
  statusCancelled: {
    color: '#FF3B30',
  },
  bookingDetails: {
    marginBottom: 8,
  },
  bookingDetail: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;