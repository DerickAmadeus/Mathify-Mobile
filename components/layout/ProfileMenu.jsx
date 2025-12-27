import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ProfileMenu = ({ visible, onToggle, onLogout }) => {
  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity 
        style={styles.profileBtn}
        onPress={onToggle}
      >
        <View style={styles.avatar}>
          <Feather name="user" size={16} color="#302b63" />
        </View>
        <Feather name="chevron-down" size={16} color="white" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownMenu}>
          <Text style={styles.dropdownUser}>Username</Text>
          <Text style={styles.dropdownEmail}>user@example.com</Text>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={() => {
              onToggle();
              onLogout();
            }}
          >
            <Feather name="log-out" size={14} color="#ff6b6b" />
            <Text style={styles.dropdownLogout}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingRight: 10,
    borderRadius: 20,
    padding: 5,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    width: 180,
    backgroundColor: '#24243e',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 8,
    zIndex: 999,
  },
  dropdownUser: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dropdownEmail: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownLogout: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProfileMenu;