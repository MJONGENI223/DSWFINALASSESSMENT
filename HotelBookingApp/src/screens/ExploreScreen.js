import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';

import grandPlaza from '../../assets/Images/ExplorePage/grand_plaza.png';
import seasideResort from '../../assets/Images/ExplorePage/seaside_resort.png';
import mountainLodge from '../../assets/Images/ExplorePage/mountain_lodge.png';
import cityView from '../../assets/Images/ExplorePage/city_view.png';
import luxuryBoutique from '../../assets/Images/ExplorePage/luxury_boutique.png';
import gardenInn from '../../assets/Images/ExplorePage/garden_inn.png';

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);

  const sampleHotels = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      location: 'New York, NY',
      rating: 4.5,
      price: 299,
      image: grandPlaza,
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
    },
    {
      id: '2',
      name: 'Seaside Resort',
      location: 'Miami, FL',
      rating: 4.2,
      price: 199,
      image: seasideResort,
      amenities: ['Beach', 'Pool', 'Restaurant'],
    },
    {
      id: '3',
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      rating: 4.7,
      price: 349,
      image: mountainLodge,
      amenities: ['Fireplace', 'Ski-in/Ski-out', 'Hot Tub'],
    },
    {
      id: '4',
      name: 'City View Hotel',
      location: 'Chicago, IL',
      rating: 4.0,
      price: 179,
      image: cityView,
      amenities: ['WiFi', 'Gym', 'Business Center'],
    },
    {
      id: '5',
      name: 'Luxury Boutique Hotel',
      location: 'San Francisco, CA',
      rating: 4.8,
      price: 399,
      image: luxuryBoutique,
      amenities: ['Spa', 'Fine Dining', 'Concierge'],
    },
    {
      id: '6',
      name: 'Garden Inn',
      location: 'Portland, OR',
      rating: 4.3,
      price: 159,
      image: gardenInn,
      amenities: ['Garden', 'Restaurant', 'Free Parking'],
    },
  ];

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = sampleHotels;

    if (searchQuery) {
      filtered = filtered.filter(
        hotel =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy === 'budget' && filtered.length > 0) {
      const avgPrice = filtered.reduce((sum, hotel) => sum + hotel.price, 0) / filtered.length;
      filtered = filtered.filter(hotel => hotel.price <= avgPrice);
    } else if (filterBy === 'luxury' && filtered.length > 0) {
      const avgPrice = filtered.reduce((sum, hotel) => sum + hotel.price, 0) / filtered.length;
      filtered = filtered.filter(hotel => hotel.price > avgPrice);
    }

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
  }, [searchQuery, sortBy, filterBy]);

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <View style={styles.hotelImage}>
        <Image
          source={item.image}
          style={{ width: 80, height: 80, borderRadius: 8 }}
          resizeMode="cover"
        />
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 2).map((amenity, index) => (
            <Text key={index} style={styles.amenity}>• {amenity}</Text>
          ))}
          {item.amenities.length > 2 && (
            <Text style={styles.moreAmenities}>+{item.amenities.length - 2} more</Text>
          )}
        </View>
        <Text style={styles.price}>${item.price}/night</Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Stay</Text>
        <Text style={styles.subtitle}>Discover amazing hotels and resorts</Text>
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

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <View style={styles.filterButtons}>
          {[
            { key: 'all', label: 'All' },
            { key: 'budget', label: 'Budget' },
            { key: 'luxury', label: 'Luxury' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                filterBy === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setFilterBy(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterBy === filter.key && styles.filterButtonTextActive,
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
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
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
    paddingTop: 10,
    paddingBottom: 0,
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
    paddingTop: 10,
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
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: '#ff9500',
    fontWeight: '600',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  amenity: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  moreAmenities: {
    fontSize: 12,
    color: '#007AFF',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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
