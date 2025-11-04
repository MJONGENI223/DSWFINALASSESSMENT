import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { bookingService } from '../services/firestoreService';
import ExploreScreen from '../screens/ExploreScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import DealsScreen from '../screens/DealsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import { Image } from 'react-native';
import { weatherAPI } from '../services/apiService';
import DealDetailsScreen from '../screens/DealDetailsScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

<Stack.Screen 
  name="DealDetails" 
  component={DealDetailsScreen}
  options={{ title: 'Deal Details' }}
/>



const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [reviews] = useState([
    { id: '1', userName: 'John Doe', rating: 5, comment: 'Amazing hotel with great service and comfortable rooms!', date: '2024-01-15' },
    { id: '2', userName: 'Jane Smith', rating: 4, comment: 'Good location and friendly staff.', date: '2024-01-10' },
  ]);

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);


  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        const data = await weatherAPI.getWeatherByCity(hotel.location.split(',')[0]); 
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [hotel.location]);

  const handleBookNow = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a hotel',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') },
        ]
      );
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to add a review');
      return;
    }
    navigation.navigate('Review', { hotel });
  };

  const renderStars = (rating) => '⭐'.repeat(rating);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hotel Header */}
        <View style={styles.header}>
          <View style={styles.hotelImage}>
            <Image
              source={hotel.image}
              style={{ width: 120, height: 120, borderRadius: 12 }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelLocation}>{hotel.location}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {hotel.rating}</Text>
            </View>

            {/* Weather Section */}
            {loadingWeather ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 8 }} />
            ) : weather ? (
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherText}>
                  🌤️ {weather.weather[0].main}, {Math.round(weather.main.temp)}°C
                </Text>
                <Text style={styles.weatherSubText}>
                  Feels like {Math.round(weather.main.feels_like)}°C | Humidity: {weather.main.humidity}%
                </Text>
              </View>
            ) : (
              <Text style={styles.weatherText}>Weather unavailable</Text>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Beautiful {hotel.name.toLowerCase()} with amazing amenities and great service. Perfect for your next vacation or business trip.
          </Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {hotel.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenity}>
                <Text style={styles.amenityText}>✓ {amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingContainer}>
            <Text style={styles.price}>${hotel.price}</Text>
            <Text style={styles.priceLabel}>per night</Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            <TouchableOpacity onPress={handleAddReview}>
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.map((review) => (
            <View key={review.id} style={styles.review}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Booking */}
      <View style={styles.footer}>
        <View style={styles.priceFooter}>
          <Text style={styles.totalPrice}>${hotel.price}</Text>
          <Text style={styles.totalLabel}>per night</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Fetching bookings for user:', user.uid);
      const userBookings = await bookingService.getUserBookings(user.uid);
      console.log('✅ Retrieved bookings:', userBookings);
      setBookings(userBookings);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingHotel}>{item.hotel?.name || 'Unknown Hotel'}</Text>
        <Text style={[styles.bookingStatus, styles.statusConfirmed]}>
          {item.status || 'confirmed'}
        </Text>
      </View>
      
      <View style={styles.bookingDates}>
        <Text style={styles.bookingDate}>
          Check-in: {item.checkIn ? new Date(item.checkIn).toLocaleDateString() : 'N/A'}
        </Text>
        <Text style={styles.bookingDate}>
          Check-out: {item.checkOut ? new Date(item.checkOut).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingDetail}>Guests: {item.guests || 'N/A'}</Text>
        <Text style={styles.bookingDetail}>Rooms: {item.rooms || 'N/A'}</Text>
      </View>
      
      <View style={styles.bookingFooter}>
        <Text style={styles.bookingTotal}>Total: ${item.total || '0'}</Text>
        {item.bookingId && (
          <Text style={styles.bookingId}>ID: {item.bookingId}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      
      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Your upcoming stays will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id || item.bookingId || Math.random().toString()}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};


const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [userBookings] = useState([
    {
      id: '1',
      hotelName: 'Grand Plaza Hotel',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      total: 897,
      status: 'confirmed',
    },
  ]);

  const handleMenuPress = (item) => {
    Alert.alert(item, 'This feature will be implemented soon!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => handleMenuPress('Edit Profile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Bookings</Text>
          {userBookings.length === 0 ? (
            <View style={styles.emptyBookings}>
              <Text style={styles.emptyText}>No bookings yet</Text>
              <Text style={styles.emptySubtext}>
                Start exploring hotels to make your first booking!
              </Text>
            </View>
          ) : (
            userBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingHotel}>{booking.hotelName}</Text>
                  <Text style={[styles.bookingStatus, styles.statusConfirmed]}>
                    {booking.status}
                  </Text>
                </View>
                <View style={styles.bookingDates}>
                  <Text style={styles.bookingDate}>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </Text>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingTotal}>${booking.total}</Text>
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => handleMenuPress('Booking Details')}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.menu}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('Payment Methods')}
          >
            <Text style={styles.menuText}>Payment Methods</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('Settings')}
          >
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('Help & Support')}
          >
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const ExploreStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ExploreMain" 
      component={ExploreScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="HotelDetails" 
      component={HotelDetailsScreen}
      options={{ title: 'Hotel Details' }}
    />
    <Stack.Screen 
      name="Booking" 
      component={BookingScreen}
      options={{ title: 'Book Your Stay' }}
    />
    <Stack.Screen 
      name="BookingConfirmation" 
      component={BookingConfirmationScreen}
      options={{ title: 'Booking Confirmed', headerLeft: null }}
    />
    <Stack.Screen 
      name="Review" 
      component={ReviewScreen}
      options={{ title: 'Write a Review' }}
    />
  </Stack.Navigator>
);


const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
  name="ExploreTab" 
  component={ExploreStack}
  options={{
    title: 'Explore',
    headerShown: false,
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons 
        name={focused ? "search" : "search-outline"} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
<Tab.Screen 
  name="Bookings" 
  component={BookingsScreen}
  options={{
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons 
        name={focused ? "calendar" : "calendar-outline"} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
<Tab.Screen 
  name="Deals" 
  component={DealsScreen}
  options={{
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons 
        name={focused ? "pricetag" : "pricetag-outline"} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
<Tab.Screen 
  name="Profile" 
  component={ProfileScreen}
  options={{
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons 
        name={focused ? "person" : "person-outline"} 
        size={size} 
        color={color} 
      />
    ),
  }}
/>
</Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    padding: 20,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  hotelEmoji: {
    fontSize: 80,
  },
  hotelHeader: {
    alignItems: 'center',
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#ff9500',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  amenityText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reviewsSection: {
    padding: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addReviewText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  review: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    fontSize: 14,
  },
  reviewText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  priceFooter: {
    flex: 1,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    padding: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingHotel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  bookingStatus: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusConfirmed: {
    color: '#34C759',
  },
  bookingDates: {
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bookingDetail: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookingId: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
 
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  emptyBookings: {
    alignItems: 'center',
    padding: 20,
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#e3f2fd',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainApp;