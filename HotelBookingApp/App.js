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
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('onboarding_complete');
      
      if (hasLaunched === 'true') {
        setIsFirstLaunch(false);
      } else {
        setIsFirstLaunch(true);
        if (hasLaunched === null) {
          await AsyncStorage.setItem('onboarding_complete', 'true');
        }
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Show onboarding ONLY on first launch when user is NOT logged in */}
        {isFirstLaunch && !user ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        
        {/* If user is logged in, go directly to MainApp */}
        {user ? (
          <Stack.Screen name="MainApp" component={MainApp} />
        ) : (
          // If user is not logged in, show Auth screen
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
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