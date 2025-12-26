import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  Modal, 
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const Calculator = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // --- STATE UI ---
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  // --- STATE CALCULATOR ---
  const [input, setInput] = useState('0'); 
  const [result, setResult] = useState('');  
  const [history, setHistory] = useState([]);
  
  // STATE BARU: Penanda bahwa kalkulasi baru saja selesai
  const [isCalculated, setIsCalculated] = useState(false); 

  // --- LOGIC: HELPER ---
  const isOperator = (char) => ['+', '-', '×', '÷', '^', '%', '(', ')', '°'].includes(char);
  
  const handlePress = (val, type) => {
    // 1. Reset (AC)
    if (val === 'AC') {
      setInput('0');
      setResult('');
      setIsCalculated(false); // Reset flag
      return;
    }

    // 2. Delete (DEL)
    if (val === 'DEL') {
      setIsCalculated(false); // Reset flag jika user hapus manual
      if (input.length <= 1 || (input.length === 2 && input.startsWith('-'))) {
        setInput('0');
      } else {
        setInput(input.slice(0, -1));
      }
      return;
    }

    // 3. Sama Dengan (=)
    if (val === '=') {
      calculateResult();
      return;
    }

    // 4. Logic Input Pintar
    let newVal = val;
    
    // Auto-kurung untuk function (sin, cos, log)
    if (type === 'function' && !['e', 'π'].includes(val)) {
      newVal = val + '(';
    }

    // --- LOGIC BARU: CHAINING VS RESET ---
    if (isCalculated) {
      // Jika baru saja selesai hitung...
      
      if (isOperator(val)) {
        // SKENARIO A: User tekan Operator (+, -, *, dll)
        // Lanjutkan angka hasil sebelumnya
        // Contoh: Hasil 18, tekan +, jadi "18+"
        
        // Cek jika result error, jangan dilanjut
        if (result === 'Error') {
          setInput(newVal);
        } else {
          setInput(result + newVal); 
        }
        setResult(''); // Bersihkan hasil kecil di bawah
        setIsCalculated(false); // Reset flag agar bisa ngetik lanjutannya
        return;

      } else {
        // SKENARIO B: User tekan Angka/Fungsi (6, sin, dll)
        // Mulai baru dari awal
        // Contoh: Hasil 18, tekan 6, jadi "6" (18 hilang)
        setInput(newVal);
        setResult('');
        setIsCalculated(false);
        return;
      }
    }
    // -------------------------------------

    // Handling angka 0 di awal (Normal Mode)
    if (input === '0') {
      if (isOperator(val) || val === '.') {
        setInput(input + newVal);
      } else {
        setInput(newVal);
      }
    } else {
      setInput(input + newVal);
    }
  };

 // --- LOGIC: ENGINE MATEMATIKA ---
  const calculateResult = () => {
    try {
      let expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**') 
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/°/g, '') 
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/√(\d+)/g, 'Math.sqrt($1)')
        
        // --- PERBAIKAN DI SINI (URUTAN DITUKAR) ---
        // 1. Ganti 'log' duluan agar tidak memakan hasil 'ln'
        .replace(/log₁₀\(/g, 'Math.log10(')
        // 2. Baru ganti 'ln' (Natural Log)
        .replace(/ln\(/g, 'Math.log(')    
        
        // Logic Trigonometri
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * (Math.PI/180))')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * (Math.PI/180))')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * (Math.PI/180))');

      // Cek apakah kurung lengkap (Opsional tapi membantu mencegah error)
      // Jika kurung buka '(' lebih banyak dari ')', tambahkan sisa ')'
      const openBrackets = (expression.match(/\(/g) || []).length;
      const closeBrackets = (expression.match(/\)/g) || []).length;
      if (openBrackets > closeBrackets) {
        expression += ')'.repeat(openBrackets - closeBrackets);
      }

      // eslint-disable-next-line no-new-func
      const evalResult = new Function('return ' + expression)();

      if (!isFinite(evalResult) || isNaN(evalResult)) {
        setResult('Error');
        return; 
      }

      let finalRes = parseFloat(evalResult.toFixed(8)).toString();
      
      setResult(finalRes);
      setHistory(prev => [{ exp: input, res: finalRes }, ...prev].slice(0, 20));
      
      setIsCalculated(true); 

    } catch (err) {
      // console.log(err); // Uncomment untuk lihat detail error di terminal
      setResult('Error');
    }
  };

  // --- UI COMPONENTS ---
  const CalcBtn = ({ label, type = 'number', color, flex = 1 }) => {
    let bgStyle = styles.btnNumber;
    let textStyle = styles.btnText;

    if (type === 'operator') {
      bgStyle = styles.btnOperator;
      textStyle = styles.btnTextOperator;
    } else if (type === 'function') {
      bgStyle = styles.btnFunction;
      textStyle = styles.btnTextFunction;
    } else if (type === 'action') { 
      bgStyle = styles.btnAction;
      textStyle = styles.btnTextAction;
    } else if (type === 'equal') {
      bgStyle = styles.btnEqual;
      textStyle = styles.btnTextEqual;
    }

    return (
      <TouchableOpacity 
        style={[styles.button, bgStyle, { flex }]} 
        onPress={() => handlePress(label, type)}
        activeOpacity={0.7}
      >
        <Text style={[textStyle, color && { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const SidebarItem = ({ icon, text, path }) => {
    const isActive = pathname === path;
    return (
      <TouchableOpacity 
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => {
          setSidebarVisible(false);
          router.push(path); 
        }}
      >
        <Feather name={icon} size={20} color={isActive ? "white" : "#a5a1c9"} />
        <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* === TOP BAR === */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.iconBtn}>
              <Feather name="menu" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.logoGroup}>
              <Feather name="box" size={20} color="white" />
              <Text style={styles.brandTitle}>Mathify</Text>
            </View>
          </View>

          <View style={styles.topBarRight}>
             <TouchableOpacity onPress={() => setHistoryModalVisible(true)} style={styles.iconBtn}>
              <Feather name="clock" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <View style={{ position: 'relative' }}>
              <TouchableOpacity 
                style={styles.profileBtn}
                onPress={() => setProfileMenuVisible(!profileMenuVisible)}
              >
                <View style={styles.avatar}>
                  <Feather name="user" size={16} color="#302b63" />
                </View>
                <Feather name="chevron-down" size={16} color="white" />
              </TouchableOpacity>

              {/* DROPDOWN MENU */}
              {profileMenuVisible && (
                <View style={styles.dropdownMenu}>
                  <Text style={styles.dropdownUser}>Username</Text>
                  <Text style={styles.dropdownEmail}>user@example.com</Text>
                  <View style={styles.divider} />
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setProfileMenuVisible(false);
                      router.replace('/login'); 
                    }}
                  >
                    <Feather name="log-out" size={14} color="#ff6b6b" />
                    <Text style={styles.dropdownLogout}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* === MAIN CONTENT === */}
        <View style={styles.mainContent}>
          {/* DISPLAY */}
          <View style={styles.displayContainer}>
            <Text 
              style={[styles.inputText, input.length > 15 && { fontSize: 30 }]} 
              numberOfLines={2} 
              adjustsFontSizeToFit
            >
              {input}
            </Text>
            {result !== '' && (
              <Text style={styles.resultText}>= {result}</Text>
            )}
          </View>

          {/* KEYPAD GRID */}
          <View style={styles.keypad}>
            {/* Row 1 */}
            <View style={styles.row}>
              <CalcBtn label="sin" type="function" />
              <CalcBtn label="cos" type="function" />
              <CalcBtn label="tan" type="function" />
              <CalcBtn label="AC" type="action" color="#ff6b6b" />
              <CalcBtn label="DEL" type="action" color="#ff6b6b" />
            </View>
            {/* Row 2 */}
            <View style={styles.row}>
              <CalcBtn label="ln" type="function" />
              <CalcBtn label="log₁₀" type="function" />
              <CalcBtn label="(" type="operator" /> 
              <CalcBtn label=")" type="operator" />
              <CalcBtn label="÷" type="operator" />
            </View>
            {/* Row 3 */}
            <View style={styles.row}>
              <CalcBtn label="^" type="function" />
              <CalcBtn label="7" />
              <CalcBtn label="8" />
              <CalcBtn label="9" />
              <CalcBtn label="×" type="operator" />
            </View>
            {/* Row 4 */}
            <View style={styles.row}>
              <CalcBtn label="√" type="function" />
              <CalcBtn label="4" />
              <CalcBtn label="5" />
              <CalcBtn label="6" />
              <CalcBtn label="-" type="operator" />
            </View>
            {/* Row 5 */}
            <View style={styles.row}>
              <CalcBtn label="π" type="function" />
              <CalcBtn label="1" />
              <CalcBtn label="2" />
              <CalcBtn label="3" />
              <CalcBtn label="+" type="operator" />
            </View>
            {/* Row 6 */}
            <View style={styles.row}>
              <CalcBtn label="e" type="function" />
              <CalcBtn label="." />
              <CalcBtn label="0" />
              <CalcBtn label="°" type="number" /> 
              <CalcBtn label="=" type="equal" />
            </View>
          </View>
        </View>

        {/* === SIDEBAR === */}
        <Modal
          visible={sidebarVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSidebarVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.sidebar}>
                  <View style={styles.sidebarHeader}>
                    <Feather name="box" size={30} color="white" />
                    <Text style={styles.sidebarTitle}>Mathify</Text>
                  </View>
                  <View style={styles.sidebarContent}>
                    <SidebarItem icon="home" text="Home" path="/dashboard" />
                    <SidebarItem icon="grid" text="Calculator" path="/calculator" />
                    <SidebarItem icon="activity" text="Graph" path="/graph" />
                    <SidebarItem icon="book" text="Soal / Modul" path="/modules" />
                  </View>
                  <View style={styles.sidebarFooter}>
                    <Text style={styles.sidebarFooterText}>Ver 1.0.0</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* === HISTORY MODAL === */}
        <Modal
          visible={historyModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setHistoryModalVisible(false)}
        >
          <View style={styles.historyOverlay}>
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>History</Text>
                <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                  <Feather name="x" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                {history.length === 0 ? (
                  <Text style={{ color: '#aaa', textAlign: 'center' }}>No history yet</Text>
                ) : (
                  history.map((item, idx) => (
                    <View key={idx} style={styles.historyItem}>
                      <Text style={styles.historyExp}>{item.exp}</Text>
                      <Text style={styles.historyRes}>= {item.res}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              {history.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setHistory([])}>
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // TOP BAR
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, zIndex: 10,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 5 },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 , backgroundColor: 'rgba(255,255,255,0.1)', paddingRight: 10, borderRadius: 20, padding: 5},
  avatar: { width: 28, height: 28, borderRadius: 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  
  // DROPDOWN
  dropdownMenu: {
    position: 'absolute', top: 45, right: 0, width: 180,
    backgroundColor: '#24243e', borderRadius: 12, padding: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    elevation: 8, zIndex: 999
  },
  dropdownUser: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  dropdownEmail: { color: '#aaa', fontSize: 12, marginBottom: 10 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 10 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropdownLogout: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 14 },

  // CONTENT
  mainContent: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  displayContainer: {
    flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end',
    paddingHorizontal: 20, paddingBottom: 20
  },
  inputText: { color: 'white', fontSize: 40, fontWeight: '300', textAlign: 'right' },
  resultText: { color: '#4facfe', fontSize: 28, fontWeight: 'bold', marginTop: 5 },

  // KEYPAD
  keypad: { paddingHorizontal: 10, gap: 10 },
  row: { flexDirection: 'row', gap: 10, height: 60 },
  
  button: {
    justifyContent: 'center', alignItems: 'center', borderRadius: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  btnNumber: { backgroundColor: 'rgba(255,255,255,0.05)' },
  btnText: { color: 'white', fontSize: 22 },
  
  btnFunction: { backgroundColor: 'rgba(255,255,255,0.02)' },
  btnTextFunction: { color: '#a5a1c9', fontSize: 14, fontWeight: 'bold' },
  
  btnOperator: { backgroundColor: 'rgba(48, 43, 99, 0.8)' },
  btnTextOperator: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  
  btnAction: { backgroundColor: 'rgba(255, 107, 107, 0.15)' },
  btnTextAction: { color: '#ff6b6b', fontSize: 16, fontWeight: 'bold' },
  
  btnEqual: { backgroundColor: 'white' },
  btnTextEqual: { color: '#302b63', fontSize: 24, fontWeight: 'bold' },

  // SIDEBAR
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  sidebar: { width: '75%', height: '100%', backgroundColor: '#1a1a2e', padding: 20, paddingTop: 50 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  sidebarTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  sidebarContent: { gap: 10 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10 },
  sidebarItemActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  sidebarText: { color: '#a5a1c9', fontSize: 16 },
  sidebarTextActive: { color: 'white', fontWeight: 'bold' },
  sidebarFooter: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 20 },
  sidebarFooterText: { color: '#555', fontSize: 12, textAlign: 'center' },

  // HISTORY
  historyOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  historyContainer: { height: '50%', backgroundColor: '#24243e', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  historyTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  historyItem: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 5 },
  historyExp: { color: '#aaa', fontSize: 14, textAlign: 'right' },
  historyRes: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'right' },
  clearBtn: { backgroundColor: 'rgba(255, 107, 107, 0.2)', margin: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  clearBtnText: { color: '#ff6b6b', fontWeight: 'bold' }
});