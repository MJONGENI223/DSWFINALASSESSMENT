import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DealDetailsScreen = ({ route, navigation }) => {
  const { deal } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: deal.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{deal.name}</Text>
        <Text style={styles.location}>{deal.location}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{deal.rating}</Text>
        </View>
        
        <Text style={styles.description}>{deal.description}</Text>
        
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {deal.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenity}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${deal.price}</Text>
            <Text style={styles.originalPrice}>${deal.originalPrice}</Text>
            <Text style={styles.nightLabel}>/night</Text>
          </View>
          <Text style={styles.discount}>-{deal.discount}% OFF</Text>
        </View>
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  amenitiesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 12,
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
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#003580',
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003580',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  nightLabel: {
    fontSize: 14,
    color: '#666',
  },
  discount: {
    backgroundColor: '#FF3B30',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#003580',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DealDetailsScreen;