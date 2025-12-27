import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useLayoutContext } from '../components/context/LayoutContext';

const Modul = () => {
  const { updateLayoutProps } = useLayoutContext();
  const isKerjaSoal = false;

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
    <View style={styles.soalContainer}>
      <LinearGradient
        colors={['rgba(79, 172, 254, 0.1)', 'rgba(79, 172, 254, 0.05)', 'transparent']}
        style={styles.soalCard}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={[styles.difficultyTag, 
            difficulty === 'easy' && styles.easyTag,
            difficulty === 'medium' && styles.mediumTag,
            difficulty === 'hard' && styles.hardTag
          ]}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription}>{description}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.durationContainer}>
            <Feather name="clock" size={16} color="#4facfe" />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.bookButton} onPress={() => console.log('Buka Buku!')}>
              <LinearGradient
                colors={['#fbbf24', '#f59e0b']}
                style={styles.bookButtonGradient}
              >
                <Text style={styles.bookButtonText}>Buka Buku</Text>
                <Feather name="book-open" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.startButton} onPress={onPress}>
              <LinearGradient
                colors={['rgba(108, 92, 231, 1)', 'rgba(81, 45, 168, 1)']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Mulai Quiz</Text>
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
      return (<View>
        <Text style={styles.subtitle}>Modul Kerja Soal Aktif</Text>
        {/* Konten kerja soal di sini */}
      </View>);
    } else {
      return (
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
            onPress={() => console.log('Start Quiz!')}
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
      );
    }
  };

  return renderContent();
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  soalContainer: {
    marginBottom: 20,
  },

  soalCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },

  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  easyTag: {
    backgroundColor: '#4ade80',
  },

  mediumTag: {
    backgroundColor: '#fb923c',
  },

  hardTag: {
    backgroundColor: '#f87171',
  },

  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  cardDescription: {
    fontSize: 16,
    color: '#b0b0b0',
    marginBottom: 20,
    lineHeight: 22,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },

  durationText: {
    color: '#4facfe',
    fontSize: 14,
    fontWeight: '500',
  },

  bookButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },

  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },

  bookButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
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
    gap: 6,
  },

  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  subtitle: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default Modul;