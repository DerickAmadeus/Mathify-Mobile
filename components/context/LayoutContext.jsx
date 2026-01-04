import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LayoutContext = createContext();

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within LayoutProvider');
  }
  return context;
};

export const LayoutProvider = ({ children }) => {
  const [layoutProps, setLayoutProps] = useState({
    showHistory: false,
    history: [],
    historyType: 'calculator',
    onClearHistory: null,
    onHistoryItemPress: null,
  });

  // User state management
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for saved login on app start
  useEffect(() => {
    checkSavedLogin();
  }, []);

  const checkSavedLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking saved login:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('authToken', token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving login data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateLayoutProps = useCallback((props) => {
    setLayoutProps(prev => ({ ...prev, ...props }));
  }, []);

  return (
    <LayoutContext.Provider value={{ 
      layoutProps, 
      updateLayoutProps,
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;