// lib/api.js
import Constants from 'expo-constants';

// Dynamic API URL based on environment
const getApiUrl = () => {
  // In development
  if (__DEV__) {
    // Use Vercel backend for development too since it's deployed
    return 'https://mathify-mobile-backend.vercel.app';
  }
  
  // In production - use deployed backend
  return 'https://mathify-mobile-backend.vercel.app';
};

export const API_BASE_URL = getApiUrl();

// API client helper
export const apiClient = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },
  
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};

// Specific API methods for your backend
export const API = {
  // Health check
  health: () => apiClient.get('/api/health'),
  
  // Users
  users: {
    getAll: () => apiClient.get('/api/users'),
    register: (userData) => apiClient.post('/api/users/register', userData),
    login: (credentials) => apiClient.post('/api/users/login', credentials),
  },
  
  // Calculator
  calculator: {
    getHistory: (userId) => apiClient.get(`/api/calculator/history?user_id=${userId}`),
    saveHistory: (data) => apiClient.post('/api/calculator/history', data),
    deleteHistory: (userId) => apiClient.delete(`/api/calculator/history?user_id=${userId}`),
  },
  
  // Graph
  graph: {
    generate: (data) => apiClient.post('/api/graph/generate', data),
  },
  
  // Modules
  modules: {
    getAll: () => apiClient.get('/api/modules'),
  },
  
  // Questions
  questions: {
    getAll: () => apiClient.get('/api/questions'),
    getByModule: (moduleId) => apiClient.get(`/api/questions?module_id=${moduleId}`),
  }
};

console.log('🔗 API URL:', API_BASE_URL);