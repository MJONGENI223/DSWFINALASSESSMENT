import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_dTumlvVJhYSZy-OZixW974Vkxgsrftw",
  authDomain: "hotelbookingapp-ecb05.firebaseapp.com",
  projectId: "hotelbookingapp-ecb05",
  storageBucket: "hotelbookingapp-ecb05.firebasestorage.app",
  messagingSenderId: "837098017167",
  appId: "1:837098017167:web:9a623da6826692ba177bfa"
};


let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;