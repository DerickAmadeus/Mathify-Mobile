import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, Alert, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';

// --- DATA SOAL DUMMY ---
const soalList = [
  {
    question: 'Akar persamaan kuadrat',
    // Nanti ini diganti URL image atau path local
    latexPlaceholder: '[ Image: x^2 - 3x - 4 = 0 ]', 
    inputLabel: 'Tentukan akar-akar persamaan',
    id: 1,
  },
  {
    question: 'Integral sederhana',
    latexPlaceholder: '[ Image: ∫ x dx ]',
    inputLabel: 'Hasil integral',
    id: 2,
  },
];

// --- WARNA TEMA (Mirip Referensi) ---
const COLORS = {
  bg: '#0f111a',           // Background paling belakang (Dark Navy)
  card: '#1f213a',         // Warna kartu/container
  primary: '#6C5DD3',      // Ungu tombol/aksen
  primaryDark: '#564ab1',
  text: '#ffffff',
  textMuted: '#8f91ac',
  border: '#2f3252',
  green: '#3AC78B',        // Warna sukses/finish
  red: '#FF5B5B',          // Warna flag/timer
  inputBg: '#151725',
};

const SoalScreen = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(soalList.length).fill(''));
  const [timer, setTimer] = useState(8 * 60); 

  // --- LOGIC (Sama seperti sebelumnya) ---
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Lagi Ujian!',
        'Kamu tidak bisa kembali sebelum menyelesaikan quiz.',
        [
          { text: 'Lanjut', onPress: () => {}, style: 'cancel' },
          { text: 'Keluar (Finish)', onPress: () => router.replace('/modul') },
        ]
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (text) => {
    const newAns = [...answers];
    newAns[current] = text;
    setAnswers(newAns);
  };

  const handleNav = (idx) => setCurrent(idx);
  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min(soalList.length - 1, c + 1));

  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');

  // --- COMPONENT PLACEHOLDER ---
  
  // Placeholder untuk Gambar Rumus Matematika
  const MathPlaceholder = ({ label }) => (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderBox}>
        {/* Nanti ganti <Image source={...} style={{width: '100%', height: '100%'}} resizeMode="contain" /> */}
        <Text style={styles.placeholderText}>MATH PNG HERE</Text>
        <Text style={styles.placeholderSubText}>{label}</Text>
      </View>
    </View>
  );

  // Placeholder untuk Grafik
  const GraphPreview = () => (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Graph Preview</Text>
        <Text style={styles.cardStatus}>Displaying</Text>
      </View>
      <View style={styles.graphPlaceholderBox}>
        {/* Simulasi Grid Garis */}
        <View style={styles.gridLineVertical} />
        <View style={styles.gridLineHorizontal} />
        {/* Nanti ganti component Chart atau Image */}
        <Text style={styles.placeholderText}>GRAPH PNG HERE</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Apps */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Persamaan Kuadrat</Text>
        <Text style={styles.headerSubtitle}>Home &gt; Modules &gt; Quiz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- MAIN QUESTION CARD --- */}
        <View style={styles.card}>
          {/* Header Soal: Nomor & Flag */}
          <View style={styles.questionMetaRow}>
            <View>
              <Text style={styles.questionNumber}>Question {current + 1}</Text>
              <View style={[styles.statusBadge, answers[current] ? styles.badgeAnswered : styles.badgeUnanswered]}>
                <Text style={styles.statusText}>{answers[current] ? 'Answered' : 'Not yet answered'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.flagBtn}>
               {/* Icon Flag sederhana pake Text atau bisa ganti Icon Library */}
              <Text style={styles.flagText}>🚩 Flag question</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Isi Soal */}
          <Text style={styles.questionText}>{soalList[current].question}</Text>
          
          {/* MATH PLACEHOLDER (Sesuai request) */}
          <MathPlaceholder label={soalList[current].latexPlaceholder} />

          {/* Input Jawaban */}
          <Text style={styles.inputLabel}>{soalList[current].inputLabel}</Text>
          <TextInput
            style={styles.textInput}
            value={answers[current]}
            onChangeText={handleAnswer}
            placeholder="Ketik jawabanmu..."
            placeholderTextColor={COLORS.textMuted}
            keyboardType="default"
          />
        </View>

        {/* --- GRAPH PREVIEW CARD --- */}
        <GraphPreview />

        {/* --- NAVIGATION BUTTONS (Prev/Next) --- */}
        <View style={styles.navActionRow}>
          <TouchableOpacity 
            style={[styles.navBtnMain, current === 0 && styles.navBtnDisabled]} 
            onPress={handlePrev} 
            disabled={current === 0}
          >
            <Text style={styles.navBtnText}>← Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navBtnMain, current === soalList.length - 1 && styles.navBtnDisabled]} 
            onPress={handleNext} 
            disabled={current === soalList.length - 1}
          >
            <Text style={styles.navBtnText}>Next page →</Text>
          </TouchableOpacity>
        </View>

        {/* --- QUIZ NAVIGATION & TIMER --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quiz Navigation</Text>
          
          {/* Grid Nomor */}
          <View style={styles.gridContainer}>
            {soalList.map((_, idx) => {
              const isActive = current === idx;
              const isAnswered = !!answers[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.gridItem,
                    isActive && styles.gridItemActive,
                    isAnswered && !isActive && styles.gridItemAnswered
                  ]}
                  onPress={() => handleNav(idx)}
                >
                  {isActive && <View style={styles.gridItemActiveIndicator} />}
                  <Text style={[styles.gridText, isActive && { fontWeight: 'bold' }]}>{idx + 1}</Text>
                  {isAnswered && <View style={styles.gridAnsweredUnderline} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.finishBtn} onPress={() => router.replace('/modul')}>
            <Text style={styles.finishBtnText}>Finish attempt ...</Text>
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time left</Text>
            <View style={styles.timerBox}>
              <Text style={styles.timerDigit}>{min}:{sec}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Layout Dasar
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.bg,
    fontSize: 30,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },

  // Kartu Umum (Card)
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    // Shadow halus
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  cardStatus: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  // Bagian Question
  questionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionNumber: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeAnswered: { backgroundColor: 'rgba(58, 199, 139, 0.2)' }, // Transparan green
  badgeUnanswered: { backgroundColor: 'rgba(255, 91, 91, 0.1)' },
  statusText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    color: COLORS.red,
    fontSize: 12,
  },
  questionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    lineHeight: 24,
  },

  // Placeholder Images
  placeholderContainer: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed', // Garis putus-putus biar keliatan placeholder
  },
  placeholderBox: {
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  placeholderSubText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
  },

  // Input Jawaban
  inputLabel: {
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 14,
  },
  textInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },

  // Graph Preview
  graphPlaceholderBox: {
    height: 200,
    backgroundColor: '#121320',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: '#2f3252',
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#2f3252',
  },

  // Tombol Navigasi Next/Prev
  navActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  navBtnMain: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  navBtnDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  navBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Grid Navigasi (Kotak-kotak nomor)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  gridItemActive: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.bg, // Active di gambar referensi background gelap tapi border putih tebal
    borderWidth: 2,
  },
  gridItemAnswered: {
    backgroundColor: '#182f2a', // Agak kehijauan dikit
  },
  gridText: {
    color: COLORS.text,
    fontSize: 14,
  },
  gridItemActiveIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: COLORS.text,
    borderTopColor: 'transparent',
    transform: [{ rotate: '90deg' }]
  },
  gridAnsweredUnderline: {
    position: 'absolute',
    bottom: 4,
    width: '50%',
    height: 3,
    backgroundColor: COLORS.text,
  },

  // Tombol Finish & Timer
  finishBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  finishBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    color: COLORS.text,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  timerBox: {
    backgroundColor: '#2a1616', // Latar merah gelap
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  timerDigit: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: 18,
    fontVariant: ['tabular-nums'], // Supaya angka tidak goyang
  },
});

export default SoalScreen;