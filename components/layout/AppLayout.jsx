import React, { useState } from 'react';
import { StatusBar, View, Alert } from 'react-native';
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
  const { layoutProps, logout } = useLayoutContext();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah kamu yakin ingin logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setProfileMenuVisible(false);
            await logout();
            // ProtectedRoute akan otomatis redirect ke login
          }
        }
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#323232ff" translucent />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000ff' }} edges={['top']}>
        
        <TopBar
          onMenuPress={() => setSidebarVisible(true)}
          onHistoryPress={showHistory ? () => setHistoryModalVisible(true) : null}
          profileMenuVisible={profileMenuVisible}
          onProfileMenuToggle={() => setProfileMenuVisible(!profileMenuVisible)}
          onLogout={handleLogout}
        />

        {/* --- PERUBAHAN DI SINI --- */}
        {/* Bungkus children dengan View dan beri paddingTop */}
        <View style={{ flex: 1 }}> 
          {children}
        </View>
        {/* ------------------------- */}

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