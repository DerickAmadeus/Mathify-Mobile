import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useLayoutContext } from '../components/context/LayoutContext';

const Modul = () => {
  const { updateLayoutProps } = useLayoutContext();
  const isKerjaSoal = false;
  const router = useRouter();

  useEffect(() => {
    updateLayoutProps({
      history: [],
      onClearHistory: () => {},
    });
  }, [updateLayoutProps]); 

  const SoalContainer = ({ 
    title, 
    difficulty, 
    description, 
    duration, 
    onPress 
  }) => (
    // WRAPPER UTAMA: Mengurus Margin Luar & Shadow
    <View style={styles.cardWrapper}>
      {/* GRADIENT: Mengurus Border, Radius, dan Konten */}
      <LinearGradient
        colors={['rgba(79, 172, 254, 0.1)', 'rgba(79, 172, 254, 0.05)', 'transparent']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* --- HEADER --- */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          <View style={[styles.difficultyTag, 
            difficulty === 'easy' && styles.easyTag,
            difficulty === 'medium' && styles.mediumTag,
            difficulty === 'hard' && styles.hardTag
          ]}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </View>
        </View>
        
        {/* --- DESCRIPTION --- */}
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        
        {/* --- FOOTER (Bagian yang Rusak di Android) --- */}
        <View style={styles.cardFooter}>
          
          {/* Bagian KIRI: Waktu */}
          {/* flexShrink: 0 penting agar teks tidak digencet tombol */}
          <View style={styles.durationContainer}>
            <Feather name="clock" size={16} color="#4facfe" />
            <Text style={styles.durationText} numberOfLines={1}>{duration}</Text>
          </View>
          
          {/* Bagian KANAN: Tombol */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.bookButton} 
              onPress={() => console.log('Buka Buku!')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                style={styles.bookButtonGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.bookButtonText}>Buka</Text>
                <Feather name="book-open" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={onPress}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(108, 92, 231, 1)', 'rgba(81, 45, 168, 1)']}
                style={styles.startButtonGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.startButtonText}>Mulai</Text>
                <Feather name="arrow-right" size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderContent = () => {
    if (isKerjaSoal) {
      return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
          <View>
            <Text style={styles.subtitle}>Modul Kerja Soal Aktif</Text>
          </View>
        </LinearGradient>
      );
    } else {
      return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
          <SoalContainer
            title="Kalkulus I"
            difficulty="medium"
            description="Limit, turunan, dan integral dasar"
            duration="20 menit"
            onPress={() => console.log('Start Quiz!')}
          />
          <SoalContainer
            title="Aljabar Linear"
            difficulty="hard"
            description="Matriks, determinan, dan ruang vektor"
            duration="30 menit"
            onPress={() => console.log('Start Quiz!')}
          />
          <SoalContainer
            title="Geometri Analitik"
            difficulty="easy"
            description="Koordinat, garis, dan lingkaran"
            duration="15 menit"
            onPress={() => { console.log('Start Quiz!'); router.push('/soal'); }}
          />
           <SoalContainer
            title="Statistika Dasar"
            difficulty="medium"
            description="Mean, median, modus, dan standar deviasi"
            duration="25 menit"
            onPress={() => console.log('Start Quiz!')}
          />
           <SoalContainer
            title="Trigonometri"
            difficulty="hard"
            description="Fungsi trigonometri dan identitas"
            duration="30 menit"
            onPress={() => console.log('Start Quiz!')}
          />
          </ScrollView>
        </LinearGradient>
      );
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  // Gradient Background
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 36, // Tambahan padding top agar tidak mepet dengan top bar
    paddingBottom: 40,
  },
  
  // --- CARD STYLING ---
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    // iOS Shadow
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android Shadow (Elevation)
    // Di Android, elevation butuh background color solid agar terlihat benar,
    // tapi karena design transparan, kita set minimal atau gunakan View kosong di belakang jika perlu.
    elevation: 4, 
    backgroundColor: '#1e293b', // Fallback color agar shadow terlihat di Android (sesuaikan dengan tema dark mode mu)
  },
  
  cardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
    overflow: 'hidden', // PENTING: Mencegah anak elemen keluar dari border radius
  },

  // --- HEADER ---
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align start agar jika title 2 baris, tag tetap di atas
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20, // Sedikit dikecilkan untuk keamanan layout mobile kecil
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 8, // Jarak ke tag difficulty
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  easyTag: { backgroundColor: '#4ade80' },
  mediumTag: { backgroundColor: '#fb923c' },
  hardTag: { backgroundColor: '#f87171' },
  difficultyText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // --- CONTENT ---
  cardDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 20,
    lineHeight: 20,
  },

  // --- FOOTER (SOLUSI LAYOUT PECAH) ---
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Hapus gap di parent, atur manual di children
  },
  
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Memberi jarak minimal ke tombol
    flexShrink: 0,   // PENTING: Mencegah container ini digencet jadi 0 width
  },
  durationText: {
    color: '#4facfe',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6, // Pengganti gap
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, // Izinkan tombol mengecil sedikit jika layar sangat sempit, tapi idealnya tidak
    justifyContent: 'flex-end',
  },

  // --- BUTTONS ---
  bookButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 8, // Pengganti gap antar tombol
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },

  startButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  
  subtitle: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default Modul;