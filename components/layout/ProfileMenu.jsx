import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLayoutContext } from '../context/LayoutContext';

const ProfileMenu = ({ visible, onToggle, onLogout }) => {
  const { user } = useLayoutContext();

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

      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onToggle}
      >
        <Pressable style={styles.modalOverlay} onPress={onToggle}>
          <View style={styles.dropdownMenu}>
            <Text style={styles.dropdownUser}>{user?.full_name || 'User'}</Text>
            <Text style={styles.dropdownEmail}>{user?.email || 'user@example.com'}</Text>
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
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownMenu: {
    width: 200,
    backgroundColor: '#24243e',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
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