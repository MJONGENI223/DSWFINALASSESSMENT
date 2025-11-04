import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingManager = {
  
  isOnboardingCompleted: async () => {
    try {
      const value = await AsyncStorage.getItem('@onboarding_completed');
      return value !== null;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },


  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem('@onboarding_completed');
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
  },
};