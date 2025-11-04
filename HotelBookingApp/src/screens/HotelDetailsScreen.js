import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { weatherAPI } from '../services/apiService';


const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();
  
  const [reviews] = useState([
    {
      id: '1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Amazing hotel with great service and comfortable rooms! Would definitely stay again.',
      date: '2024-01-15',
    },
    {
      id: '2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Good location and friendly staff. The room was clean and comfortable.',
      date: '2024-01-10',
    },
  ]);

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

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Beautiful {hotel.name.toLowerCase()} with amazing amenities and great service. Perfect for your next vacation or business trip.
          </Text>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingContainer}>
            <Text style={styles.price}>${hotel.price}</Text>
            <Text style={styles.priceLabel}>per night</Text>
          </View>
        </View>

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

export default HotelDetailsScreen;
