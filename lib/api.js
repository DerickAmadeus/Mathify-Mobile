// lib/api.js
import Constants from 'expo-constants';

// Dynamic API URL based on environment
const getApiUrl = () => {
  // In development
  if (__DEV__) {
    // Use local IP for Expo Go on real device
    const localIP = Constants.expoConfig?.hostUri?.split(':')[0];
    return localIP ? `http://${localIP}:5000` : 'http://localhost:5000';
  }
  
  // In production (after expo build)
  return Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'https://your-app.vercel.app';
};

export const API_BASE_URL = getApiUrl();

// API client helper
export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

console.log('🔗 API URL:', API_BASE_URL);