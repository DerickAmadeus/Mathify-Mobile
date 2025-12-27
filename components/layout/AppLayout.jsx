import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import HistoryModal from '../modals/HistoryModal';
import { useLayoutContext } from '../context/LayoutContext';

const AppLayout = ({ 
  children, 
  showHistory = false, 
  historyType = "calculator"
}) => {
  const router = useRouter();
  const { layoutProps } = useLayoutContext();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const handleLogout = () => {
    setProfileMenuVisible(false);
    router.replace('/login');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        
        <TopBar
          onMenuPress={() => setSidebarVisible(true)}
          onHistoryPress={showHistory ? () => setHistoryModalVisible(true) : null}
          profileMenuVisible={profileMenuVisible}
          onProfileMenuToggle={() => setProfileMenuVisible(!profileMenuVisible)}
          onLogout={handleLogout}
        />

        {children}

        <Sidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />

        {showHistory && (
          <HistoryModal
            visible={historyModalVisible}
            onClose={() => setHistoryModalVisible(false)}
            history={layoutProps.history || []}
            onClearHistory={layoutProps.onClearHistory}
            type={historyType}
            onHistoryItemPress={layoutProps.onHistoryItemPress}
          />
        )}

      </SafeAreaView>
    </>
  );
};

export default AppLayout;