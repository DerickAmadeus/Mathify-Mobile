import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions, // Tambahkan ini untuk lebar layar dinamis
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

// Ambil lebar layar agar animasi lebih akurat daripada hardcode "-300"
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75; // 75% dari lebar layar

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
  // Mulai dari posisi negatif (di luar layar sebelah kiri)
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // 1. Handle Animasi SAAT BUKA (Entry)
  React.useEffect(() => {
    if (visible) {
      // Pastikan posisi awal di reset ke luar layar
      slideAnim.setValue(-SIDEBAR_WIDTH);
      // Animasi masuk ke 0 (posisi normal)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 2. Fungsi Khusus untuk Menutup (Exit Animation)
  // Kita harus jalankan animasi dulu, BARU panggil props onClose
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH, // Geser balik ke kiri
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Callback: Dijalankan setelah animasi selesai
      onClose(); 
    });
  };

  const handleNavigate = (path) => {
    // Tutup sidebar dengan animasi dulu, baru pindah halaman
    handleClose();
    // Beri sedikit delay agar user melihat animasi (opsional, tapi lebih halus)
    setTimeout(() => {
        router.push(path);
    }, 250);
  };

  const menuItems = [
    { icon: "home", text: "Home", path: "/home" },
    { icon: "grid", text: "Calculator", path: "/calculator" },
    { icon: "activity", text: "Graph", path: "/graph" },
    { icon: "book", text: "Soal / Modul", path: "/modul" },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      // Ganti ke 'none' atau 'fade' agar tidak bentrok dengan animasi geser kita
      animationType="fade" 
      // Saat tombol back ditekan (Android), jalankan animasi tutup dulu
      onRequestClose={handleClose} 
    >
      {/* Gunakan handleClose saat overlay ditekan */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.sidebar,
                {
                    width: SIDEBAR_WIDTH, // Pakai width dinamis
                    transform: [{ translateX: slideAnim }] // Ini kunci animasinya
                }
              ]}
            >
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
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ... styles sama seperti sebelumnya, sesuaikan width sidebar jika perlu
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Gelapkan background
    flexDirection: 'row',
  },
  sidebar: {
    // width dihapus disini karena sudah di-set via inline style di component
    height: '100%',
    backgroundColor: '#1e1e1ebd', // Pastikan warna solid, jangan transparan
    padding: 20,
    paddingTop: 50,
    // Tambahkan shadow agar terlihat melayang
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10, 
  },
  // ... sisa style lainnya tetap sama
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 30,
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