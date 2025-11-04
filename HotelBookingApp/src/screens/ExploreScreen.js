import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(false);

  const sampleHotels = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      location: 'New York, NY',
      rating: 4.5,
      price: 299,
      image: 'Group 10117.png',
      description: 'Luxury hotel in the heart of Manhattan',
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
    },
    {
      id: '2',
      name: 'Seaside Resort',
      location: 'Miami, FL',
      rating: 4.2,
      price: 199,
      image: 'Group 10118.png',
      description: 'Beautiful beachfront resort with ocean views',
      amenities: ['Beach', 'Pool', 'Restaurant', 'Bar'],
    },
    {
      id: '3',
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      rating: 4.7,
      price: 349,
      image: 'Group 10127.png',
      description: 'Cozy lodge with stunning mountain views',
      amenities: ['Fireplace', 'Ski-in/Ski-out', 'Hot Tub', 'Restaurant'],
    },
    {
      id: '4',
      name: 'City View Hotel',
      location: 'Chicago, IL',
      rating: 4.0,
      price: 179,
      image: 'image-1-3.png',
      description: 'Modern hotel with panoramic city views',
      amenities: ['WiFi', 'Gym', 'Business Center', 'Restaurant'],
    },
  ];

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = sampleHotels;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        hotel =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort hotels
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [searchQuery, sortBy]);

  const navigateToHotelDetails = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => navigateToHotelDetails(item)}
    >
      <View style={styles.hotelImage}>
        <Text style={styles.hotelEmoji}>{item.image}</Text>
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <Text style={styles.hotelDescription}>{item.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.priceLabel}>/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hotels found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your search or filter criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Stay</Text>
        <Text style={styles.headerSubtitle}>
          Discover amazing hotels and resorts
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <View style={styles.filterButtons}>
          {[
            { key: 'default', label: 'Default' },
            { key: 'price-low', label: 'Price: Low to High' },
            { key: 'price-high', label: 'Price: High to Low' },
            { key: 'rating', label: 'Rating' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                sortBy === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSortBy(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  sortBy === filter.key && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading hotels...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedHotels}
          renderItem={renderHotelCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
        />
      )}
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
  searchContainer: {
    padding: 20,
    paddingTop: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    padding: 20,
    paddingTop: 0,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  hotelCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  hotelEmoji: {
    fontSize: 40,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: '#ff9500',
    fontWeight: '600',
  },
  hotelDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
});

export default ExploreScreen;