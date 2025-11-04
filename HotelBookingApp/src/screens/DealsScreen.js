import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { recommendationsService } from '../services/apiService';

const DealsScreen = () => {
  const navigation = useNavigation();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setError('');
      const dealsData = await recommendationsService.getDeals();
      setDeals(dealsData);
    } catch (error) {
      setError('Failed to load deals. Please try again.');
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeals();
  };

  const navigateToHotelDetails = (hotel) => {
    navigation.navigate('HotelDetails', { 
      hotel: {
        ...hotel,
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym'], // Default amenities
      }
    });
  };

  const renderDealCard = ({ item }) => (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={() => navigateToHotelDetails(item)}
    >
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      
      <View style={styles.dealBadge}>
        <Text style={styles.dealBadgeText}>HOT DEAL</Text>
      </View>

      <View style={styles.dealInfo}>
        <Text style={styles.dealName}>{item.name}</Text>
        <Text style={styles.dealLocation}>{item.location}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceWrapper}>
            <Text style={styles.currentPrice}>${item.price}</Text>
            <Text style={styles.priceLabel}>/night</Text>
          </View>
          <Text style={styles.originalPrice}>${item.originalPrice}</Text>
        </View>

        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>
            Save ${item.originalPrice - item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Deals Available</Text>
      <Text style={styles.emptyText}>
        Check back later for amazing hotel deals!
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadDeals}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading amazing deals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && deals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Special Deals</Text>
        <Text style={styles.headerSubtitle}>
          Limited time offers on amazing hotels
        </Text>
      </View>

      <FlatList
        data={deals}
        renderItem={renderDealCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  dealBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dealBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealInfo: {
    padding: 15,
  },
  dealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dealLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#ff9500',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  dealDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
    marginBottom: 8,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  savingsText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DealsScreen;