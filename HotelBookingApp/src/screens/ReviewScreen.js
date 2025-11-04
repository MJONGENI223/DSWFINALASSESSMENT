import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;

  const [review, setReview] = useState({
    rating: 0,
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (review.rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!review.comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    // In a real app, you would save this to your backend
    setSubmitted(true);
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setReview({ ...review, rating: index + 1 })}
      >
        <Text style={styles.star}>
          {index < review.rating ? '⭐' : '☆'}
        </Text>
      </TouchableOpacity>
    ));
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your review has been submitted successfully.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.headerTitle}>Write a Review</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Your Rating</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <Text style={styles.ratingText}>
            {review.rating > 0 ? `${review.rating} out of 5 stars` : 'Tap to rate'}
          </Text>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your experience with this hotel..."
            multiline
            numberOfLines={6}
            value={review.comment}
            onChangeText={(text) => setReview({ ...review, comment: text })}
          />
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Review Tips</Text>
          <Text style={styles.tip}>• Be specific about what you liked or didn't like</Text>
          <Text style={styles.tip}>• Mention the service, cleanliness, and location</Text>
          <Text style={styles.tip}>• Share if you would recommend this hotel to others</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (review.rating === 0 || !review.comment.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitReview}
          disabled={review.rating === 0 || !review.comment.trim()}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  commentSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 120,
    textAlignVertical: 'top',
  },
  tipsSection: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ReviewScreen;