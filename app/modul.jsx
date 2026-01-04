import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
// UPDATE: Tambahkan 'Linking' dan 'Alert'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useLayoutContext } from '../components/context/LayoutContext';
import { API } from '../lib/api';

const Modul = () => {
  const { updateLayoutProps } = useLayoutContext();
  const isKerjaSoal = false;
  const router = useRouter();
  
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.modules.getAll();
      const modulesData = response?.data || response;
      const modules = Array.isArray(modulesData) ? modulesData : [];
      setModules(modules);
    } catch (err) {
      console.error('Error loading modules:', err);
      setError('Gagal memuat data modul. Silakan coba lagi.');
      setModules([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLayoutProps({
      history: [],
      onClearHistory: () => {},
    });
    loadModules();
  }, [updateLayoutProps]); 

  // LOGIC BARU: Fungsi untuk membuka link
  const handleOpenMaterial = async (link) => {
    if (!link) {
      Alert.alert("Info", "Materi modul ini belum tersedia.");
      return;
    }

    try {
      // Cek apakah HP bisa membuka link ini
      const supported = await Linking.canOpenURL(link);

      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert("Error", "Tidak dapat membuka link materi ini.");
      }
    } catch (error) {
      console.error("Gagal membuka link:", error);
      Alert.alert("Error", "Terjadi kesalahan saat membuka materi.");
    }
  };

  const SoalContainer = ({ 
    title, 
    difficulty, 
    description, 
    duration, 
    materialLink, // UPDATE: Terima props materialLink
    onPress 
  }) => (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['rgba(79, 172, 254, 0.1)', 'rgba(79, 172, 254, 0.05)', 'transparent']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
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
        
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.durationContainer}>
            <Feather name="clock" size={16} color="#4facfe" />
            <Text style={styles.durationText} numberOfLines={1}>{duration}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            {/* UPDATE: Panggil handleOpenMaterial di tombol Buka */}
            <TouchableOpacity 
              style={styles.bookButton} 
              onPress={() => handleOpenMaterial(materialLink)}
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
          <View><Text style={styles.subtitle}>Modul Kerja Soal Aktif</Text></View>
        </LinearGradient>
      );
    } else {
      return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#4facfe" />
              <Text style={styles.loadingText}>Memuat modul...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadModules}>
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView 
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {modules && modules.length > 0 ? modules.map((module) => {
                return (
                  <SoalContainer
                    key={module.id}
                    title={module.title}
                    difficulty={module.difficulty || 'medium'}
                    description={module.description || 'Deskripsi tidak tersedia'}
                    duration={`${module.duration_minutes || 20} menit`}
                    // UPDATE: Passing data link dari Supabase ke Component
                    materialLink={module.material_link} 
                    onPress={() => {
                      router.push(`/soal?moduleId=${module.id}`);
                    }}
                  />
                );
              }) : (
                 <View style={styles.centerContainer}>
                  <Text style={styles.emptyText}>Belum ada modul tersedia</Text>
                </View>
              )}
            </ScrollView>
          )}
        </LinearGradient>
      );
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  // ... Styles kamu yang lama tetap sama, tidak perlu diubah ...
  // Copy-paste saja styles dari file sebelumnya
    gradientBackground: { flex: 1 },
    container: { flex: 1, backgroundColor: 'transparent' },
    contentContainer: { padding: 20, paddingTop: 36, paddingBottom: 40 },
    cardWrapper: { marginBottom: 20, borderRadius: 16, shadowColor: '#4facfe', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, backgroundColor: '#1e293b' },
    cardGradient: { borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(79, 172, 254, 0.3)', overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', flex: 1, marginRight: 8 },
    difficultyTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
    easyTag: { backgroundColor: '#4ade80' },
    mediumTag: { backgroundColor: '#fb923c' },
    hardTag: { backgroundColor: '#f87171' },
    difficultyText: { color: 'white', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    cardDescription: { fontSize: 14, color: '#b0b0b0', marginBottom: 20, lineHeight: 20 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    durationContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10, flexShrink: 0 },
    durationText: { color: '#4facfe', fontSize: 14, fontWeight: '500', marginLeft: 6 },
    buttonContainer: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, justifyContent: 'flex-end' },
    bookButton: { borderRadius: 18, overflow: 'hidden', marginRight: 8 },
    bookButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
    bookButtonText: { color: 'white', fontSize: 13, fontWeight: '600', marginRight: 4 },
    startButton: { borderRadius: 20, overflow: 'hidden' },
    startButtonGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
    startButtonText: { color: 'white', fontSize: 14, fontWeight: '600', marginRight: 6 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { color: '#4facfe', fontSize: 16, marginTop: 10, textAlign: 'center' },
    errorText: { color: '#f87171', fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
    emptyText: { color: '#b0b0b0', fontSize: 16, textAlign: 'center' },
    retryButton: { backgroundColor: 'rgba(79, 172, 254, 0.2)', borderWidth: 1, borderColor: '#4facfe', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
    retryButtonText: { color: '#4facfe', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});

export default Modul;