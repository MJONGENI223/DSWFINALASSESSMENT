import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fakeStoreAPI } from '../services/apiService';

const DealsScreen = ({ navigation }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeals = async () => {
    try {
      setError(null);
      const products = await fakeStoreAPI.getProducts();
      
      
      const transformedDeals = products.map(product => ({
        id: product.id.toString(),
        name: product.title,
        location: getRandomCity(),
        rating: (Math.random() * 2 + 3).toFixed(1), 
        price: Math.round(product.price * 10), 
        originalPrice: Math.round(product.price * 15),
        image: product.image,
        category: product.category,
        description: product.description,
        amenities: getRandomAmenities(),
        discount: Math.round(Math.random() * 30 + 10), 
      }));
      
      setDeals(transformedDeals);
    } catch (err) {
      setError('Failed to load deals. Please try again.');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getRandomCity = () => {
    const cities = ['New York', 'Miami', 'Los Angeles', 'Chicago', 'Las Vegas', 'San Francisco', 'Orlando', 'Seattle'];
    return cities[Math.floor(Math.random() * cities.length)];
  };

  const getRandomAmenities = () => {
    const allAmenities = ['WiFi', 'Pool', 'Spa', 'Gym', 'Breakfast', 'Parking', 'Restaurant', 'Bar'];
    return allAmenities.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeals();
  };

  const renderDealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={() => navigation.navigate('DealDetails', { deal: item })}
    >
      <View style={styles.dealHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount}%</Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.dealImage} />
      </View>
      
      <View style={styles.dealInfo}>
        <Text style={styles.dealName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.dealLocation}>{item.location}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenity}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.priceContainer}>
          <View style={styles.priceWrapper}>
            <Text style={styles.currentPrice}>${item.price}</Text>
            <Text style={styles.originalPrice}>${item.originalPrice}</Text>
            <Text style={styles.nightLabel}>/night</Text>
          </View>
          <Text style={styles.dealTag}>Special Deal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003580" />
        <Text style={styles.loadingText}>Loading amazing deals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="sad-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDeals}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Special Deals</Text>
        <Text style={styles.subtitle}>Limited time offers on amazing hotels</Text>
      </View>

      <FlatList
        data={deals}
        renderItem={renderDealItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#003580']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#003580',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#003580',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e6f2ff',
  },
  listContent: {
    padding: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  dealHeader: {
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealImage: {
    width: '100%',
    height: 200,
  },
  dealInfo: {
    padding: 16,
  },
  dealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
  },
  dealLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  amenity: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 12,
    color: '#003580',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003580',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  nightLabel: {
    fontSize: 12,
    color: '#666',
  },
  dealTag: {
    backgroundColor: '#e6f7ee',
    color: '#009944',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DealsScreen;