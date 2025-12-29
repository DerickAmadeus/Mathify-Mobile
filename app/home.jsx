import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLayoutContext } from '../components/context/LayoutContext';

const Home = () => {
  const router = useRouter();
  const { updateLayoutProps } = useLayoutContext();

  // 1. Sinkronisasi LayoutContext
  useEffect(() => {
    updateLayoutProps({
      history: [], 
      onClearHistory: () => {},
    });
  }, [updateLayoutProps]);

  // 2. Komponen Kartu Fitur
  const FeatureCard = ({ title, description, icon, route, btnText }) => (
    <View style={styles.cardWrapper}>
      <LinearGradient
        // Background kartu tetap ungu sangat transparan (chill)
        colors={['rgba(142, 68, 173, 0.15)', 'rgba(142, 68, 173, 0.05)', 'transparent']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            {/* Ikon Utama: Ungu medium agar bentuknya tetap tegas */}
            <Feather name={icon} size={24} color="#d8b4fe" />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        <Text style={styles.cardDescription}>
          {description}
        </Text>

        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => router.push(route)}
        >
          <LinearGradient
            // Background tombol: Lebih transparan agar tidak "berat"
            colors={['rgba(142, 68, 173, 0.2)', 'rgba(142, 68, 173, 0.1)']}
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
          >
            {/* Teks & Ikon Panah: Warna Lavender (Soft Purple) */}
            <Text style={styles.actionButtonText}>{btnText}</Text>
            <Feather name="arrow-right" size={16} color="#d8b4fe" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* FIXED HEADER SECTION */}
      <View style={styles.fixedHeader}>
        <Text style={styles.welcomeTitle}>Mathify's Virtual Lab</Text>
        <Text style={styles.welcomeSubtitle}>Laboratorium virtual pribadi untuk semua kebutuhan hitunganmu</Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FeatureCard 
          title="Calculator" 
          description="Kalkulator ilmiah untuk perhitungan dasar hingga kompleks."
          icon="grid"
          route="/calculator"
          btnText="Buka Kalkulator"
        />

        <FeatureCard 
          title="Graphing Tool" 
          description="Visualisasikan fungsi matematika dan plot grafik secara instan."
          icon="activity"
          route="/graph"
          btnText="Buat Grafik"
        />

        <FeatureCard 
          title="Modul & Latihan" 
          description="Kumpulan soal dan materi pembelajaran terstruktur."
          icon="book"
          route="/modul" 
          btnText="Lihat Modul"
        />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  // --- CONTAINER UTAMA ---
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // --- HEADER SECTION ---
  fixedHeader: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 5,
    textAlign: 'center',
  },

  // --- SCROLL AREA ---
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // --- CARD STYLES ---
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    // Shadow diperhalus
    shadowColor: '#d8b4fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Opacity dikurangi biar ga terlalu glowing tajam
    shadowRadius: 8,
    elevation: 4, 
    backgroundColor: '#1e293b', 
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(165, 94, 234, 0.2)', // Border lebih soft
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(165, 94, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 20,
  },
  
  // --- BUTTON STYLES ---
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#d8b4fe', 
    fontSize: 14,
    fontWeight: '600',
  },
});