// Environment variables (in production, use react-native-config or similar)
export const API_KEYS = {
    WEATHER_API: process.env.WEATHER_API_KEY || "your-weather-api-key",
    FAKE_STORE_API: "https://fakestoreapi.com",
  };
  
 
  export const COLLECTIONS = {
    USERS: 'users',
    BOOKINGS: 'bookings',
    REVIEWS: 'reviews',
    HOTELS: 'hotels',
  };
  

  export const STORAGE_KEYS = {
    ONBOARDING_COMPLETE: 'onboarding_complete',
    USER_TOKEN: 'user_token',
  };