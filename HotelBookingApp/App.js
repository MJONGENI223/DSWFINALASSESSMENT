import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainApp from './src/navigation/MainApp';

const Stack = createStackNavigator();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('@onboarding_completed');
      setIsOnboardingCompleted(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    }
  };

  // Show loading screen while checking auth and onboarding status
  if (loading || isOnboardingCompleted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Determine the initial route based on user authentication and onboarding status
  let initialRouteName = 'Onboarding';
  
  if (user) {
    initialRouteName = 'MainApp';
  } else if (isOnboardingCompleted) {
    initialRouteName = 'Auth';
  }

  console.log('Navigation Status:', { user: !!user, onboarding: isOnboardingCompleted, initialRoute: initialRouteName });

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}