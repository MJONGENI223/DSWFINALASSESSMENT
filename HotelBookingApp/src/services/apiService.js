import axios from 'axios';

const FAKE_STORE_BASE_URL = 'https://fakestoreapi.com';
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_WEATHER_API_KEY = '22ddf770e4fc75bc8a794d8e9d24c1eb'; 

export const fakeStoreAPI = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${FAKE_STORE_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await axios.get(`${FAKE_STORE_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${FAKE_STORE_BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

export const weatherAPI = {
  getWeatherByCity: async (city) => {
    try {
      console.log('Attempting to fetch real weather for:', city);
      
     
      const response = await axios.get(
        `${OPEN_WEATHER_BASE_URL}/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
      );
      console.log('Real weather data received');
      return response.data;
    } catch (error) {
      console.log('Real API failed, using mock data');
      
      
      const mockWeatherData = {
        main: {
          temp: Math.random() * 25 + 15, 
          feels_like: Math.random() * 25 + 15,
          humidity: Math.floor(Math.random() * 50 + 30), 
          pressure: Math.floor(Math.random() * 50 + 1000), 
        },
        weather: [
          {
            main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
            description: ['sunny', 'cloudy', 'light rain', 'clear sky'][Math.floor(Math.random() * 4)],
          }
        ],
        wind: {
          speed: (Math.random() * 10).toFixed(1),
        },
        name: city,
      };

      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockWeatherData;
    }
  },

  getWeatherByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${OPEN_WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      
     
      const mockWeatherData = {
        main: {
          temp: 22.5,
          feels_like: 24.3,
          humidity: 65,
          pressure: 1013,
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
          }
        ],
        wind: {
          speed: 3.5,
        },
      };

      await new Promise(resolve => setTimeout(resolve, 800));
      return mockWeatherData;
    }
  },
};