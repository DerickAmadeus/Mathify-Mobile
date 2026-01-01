import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import ProfileMenu from './ProfileMenu';

const TopBar = ({ 
  onMenuPress, 
  onHistoryPress, 
  profileMenuVisible, 
  onProfileMenuToggle,
  onLogout 
}) => {
  return (
    <LinearGradient 
      colors={['#000000ff', '#252525ff']} 
      style={styles.topBar}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.topBarLeft}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.logoGroup}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
          <Text style={styles.brandTitle}>Mathify</Text>
        </View>
      </View>

      <View style={styles.topBarRight}>
        {onHistoryPress && (
          <TouchableOpacity onPress={onHistoryPress} style={styles.iconBtn}>
            <Feather name="clock" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        <ProfileMenu
          visible={profileMenuVisible}
          onToggle={onProfileMenuToggle}
          onLogout={onLogout}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    paddingHorizontal: 20,
    paddingTop: 20, // Padding top besar untuk menutupi status bar
    paddingBottom: 20,
    zIndex: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
      width: 24,  
      height: 24,
      marginRight: 8, 
  },
  brandTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBtn: {
    padding: 5,
  },
});

export default TopBar;