import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const SidebarItem = ({ icon, text, path, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
      onPress={onPress}
    >
      <Feather name={icon} size={20} color={isActive ? "white" : "#a5a1c9"} />
      <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const Sidebar = ({ visible, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: "home", text: "Home", path: "/" },
    { icon: "grid", text: "Calculator", path: "/calculator" },
    { icon: "activity", text: "Graph", path: "/graph" },
    { icon: "book", text: "Soal / Modul", path: "/modul" },
  ];

  const handleNavigate = (path) => {
    onClose();
    router.push(path);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sidebar}>
              <View style={styles.sidebarHeader}>
                <Feather name="box" size={30} color="white" />
                <Text style={styles.sidebarTitle}>Mathify</Text>
              </View>
              
              <View style={styles.sidebarContent}>
                {menuItems.map((item, index) => (
                  <SidebarItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    path={item.path}
                    isActive={pathname === item.path}
                    onPress={() => handleNavigate(item.path)}
                  />
                ))}
              </View>
              
              <View style={styles.sidebarFooter}>
                <Text style={styles.sidebarFooterText}>Ver 1.0.0</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  sidebar: {
    width: '75%',
    height: '100%',
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 50,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  sidebarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sidebarContent: {
    gap: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sidebarItemActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sidebarText: {
    color: '#a5a1c9',
    fontSize: 16,
  },
  sidebarTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  sidebarFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
  },
  sidebarFooterText: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Sidebar;