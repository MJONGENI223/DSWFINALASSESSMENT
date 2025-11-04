import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
          await AsyncStorage.setItem('user_token', await user.getIdToken());
        } else {
          setUser(null);
          setUserProfile(null);
          await AsyncStorage.removeItem('user_token');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        Alert.alert('Error', 'Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

   
      await updateProfile(user, {
        displayName: name
      });

   
      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUserProfile(userProfile);

      return user;
    } catch (error) {
      let errorMessage = 'Sign up failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Sign Up Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      let errorMessage = 'Sign in failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Sign In Error', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      await AsyncStorage.removeItem('user_token');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }
      
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'Password reset link sent to your email');
      return true;
    } catch (error) {
      let errorMessage = 'Password reset failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Password Reset Error', errorMessage);
      throw new Error(errorMessage);
    }
  };

  
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      Alert.alert('Coming Soon', 'Google Sign-In will be implemented next!');
      
      
      const mockUser = {
        uid: 'google-mock-1',
        email: 'google.user@example.com',
        displayName: 'Google User'
      };
      
      return mockUser;
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      Alert.alert('Coming Soon', 'Apple Sign-In will be implemented next!');
      
      
      const mockUser = {
        uid: 'apple-mock-1',
        email: 'apple.user@example.com',
        displayName: 'Apple User'
      };
      
      return mockUser;
    } catch (error) {
      Alert.alert('Apple Sign-In Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      
      if (updates.name) {
        await updateProfile(user, {
          displayName: updates.name
        });
      }

      
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile);

      return updatedProfile;
    } catch (error) {
      Alert.alert('Profile Update Error', error.message);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    updateUserProfile,
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};