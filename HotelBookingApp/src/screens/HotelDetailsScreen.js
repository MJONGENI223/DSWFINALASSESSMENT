import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { weatherService } from '../services/apiService';
import { reviewService } from '../services/firestoreService';

const HotelDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;
  const { user, isAuthenticated } = useAuth();
  
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    loadWeatherData();
    loadReviews();
    checkUserReview();
  }, [hotel]);

  const loadWeatherData = async () => {
    try {
      setWeatherLoading(true);
      // Extract city from location (e.g., "New York, NY" -> "New York")
      const city = hotel.location.split(',')[0].trim();
      const weatherData = await weatherService.getWeatherByCity(city);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      // In a real app, you would use the actual hotel ID
      const hotelId = hotel.id || 'default-hotel';
      const reviewsData = await reviewService.getHotelReviews(hotelId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    
    try {
      const hotelId = hotel.id || 'default-hotel';
      const review = await reviewService.getUserReviewForHotel(hotelId, user.uid);
      setUserReview(review);
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
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
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add a review',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') },
        ]
      );
      return;
    }
    navigation.navigate('Review', { hotel });
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Snow: '❄️',
      Thunderstorm: '⛈️',
      Drizzle: '🌦️',
    };
    return icons[condition] || '🌤️';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.hotelImage}>
            <Text style={styles.hotelEmoji}>{hotel.image}</Text>
          </View>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelLocation}>{hotel.location}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {hotel.rating}</Text>
            </View>
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Weather</Text>
          {weatherLoading ? (
            <View style={styles.weatherLoading}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.weatherLoadingText}>Loading weather...</Text>
            </View>
          ) : weather ? (
            <View style={styles.weatherContainer}>
              <View style={styles.weatherMain}>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(weather.weather[0].main)}
                </Text>
                <View style={styles.weatherInfo}>
                  <Text style={styles.weatherTemp}>
                    {Math.round(weather.main.temp)}°C
                  </Text>
                  <Text style={styles.weatherDescription}>
                    {weather.weather[0].description}
                  </Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>Feels like</Text>
                  <Text style={styles.weatherDetailValue}>
                    {Math.round(weather.main.feels_like)}°C
                  </Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>Humidity</Text>
                  <Text style={styles.weatherDetailValue}>
                    {weather.main.humidity}%
                  </Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Text style={styles.weatherDetailLabel}>Wind</Text>
                  <Text style={styles.weatherDetailValue}>
                    {weather.wind.speed} m/s
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.weatherUnavailable}>
              Weather information unavailable
            </Text>
          )}
        </View>

        {/* Description, Amenities, Pricing sections remain the same */}
        {/* ... */}

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            {!userReview && isAuthenticated && (
              <TouchableOpacity onPress={handleAddReview}>
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            )}
          </View>

          {userReview && (
            <View style={styles.userReviewNote}>
              <Text style={styles.userReviewNoteText}>
                ✓ You have already reviewed this hotel
              </Text>
            </View>
          )}

          {reviewsLoading ? (
            <View style={styles.reviewsLoading}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.reviewsLoadingText}>Loading reviews...</Text>
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>No reviews yet</Text>
              <Text style={styles.noReviewsSubtext}>
                Be the first to review this hotel!
              </Text>
              {isAuthenticated && (
                <TouchableOpacity 
                  style={styles.addFirstReviewButton}
                  onPress={handleAddReview}
                >
                  <Text style={styles.addFirstReviewText}>Write First Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {reviews.slice(0, 3).map((review, index) => (
                <View key={review.id || index} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
              
              {reviews.length > 3 && (
                <TouchableOpacity style={styles.viewAllReviews}>
                  <Text style={styles.viewAllReviewsText}>
                    View all {reviews.length} reviews
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceFooter}>
          <Text style={styles.totalPrice}>${hotel.price}</Text>
          <Text style={styles.totalLabel}>per night</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Add new styles for weather and enhanced reviews
const styles = StyleSheet.create({
  // ... previous styles
  weatherLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  weatherLoadingText: {
    marginLeft: 10,
    color: '#666',
  },
  weatherContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    alignItems: 'center',
  },
  weatherDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  weatherDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  weatherUnavailable: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
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
  userReviewNote: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  userReviewNoteText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  reviewsLoadingText: {
    marginLeft: 10,
    color: '#666',
  },
  noReviews: {
    alignItems: 'center',
    padding: 20,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  addFirstReviewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addFirstReviewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  viewAllReviews: {
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  viewAllReviewsText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default HotelDetailsScreen;