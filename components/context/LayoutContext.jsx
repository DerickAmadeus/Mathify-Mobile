import React, { createContext, useContext, useState, useCallback } from 'react';

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

  const updateLayoutProps = useCallback((props) => {
    setLayoutProps(prev => ({ ...prev, ...props }));
  }, []);

  return (
    <LayoutContext.Provider value={{ layoutProps, updateLayoutProps }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;