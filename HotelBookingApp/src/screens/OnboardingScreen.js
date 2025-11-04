import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const slides = [
    {
      id: 1,
      title: 'Discover Amazing Hotels',
      description: 'Find and book the perfect hotel for your next trip with our extensive collection',
      image: require('../../assets/Images/OnboardingPage/Onboarding1.png'), 
    },
    {
      id: 2,
      title: 'Easy Booking Process',
      description: 'Book your stay in just a few simple steps with our intuitive interface',
      image: require('../../assets/Images/OnboardingPage/Onboarding2.png'), 
    },
    {
      id: 3,
      title: 'Read Genuine Reviews',
      description: 'Make informed decisions with real guest reviews and ratings',
      image: require('../../assets/Images/OnboardingPage/Onboarding3.png'), 
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      navigation.navigate('Auth'); 
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        {/* Image */}
        <Image 
          source={slides[currentSlide].image} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
        
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlide === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;