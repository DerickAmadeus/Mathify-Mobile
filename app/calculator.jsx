import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import { useLayoutContext } from '../components/context/LayoutContext';
import { apiClient } from '../lib/api'; // Pastikan path ini benar

const Calculator = () => {
  const { updateLayoutProps, user } = useLayoutContext();
  
  // State
  const [input, setInput] = useState('0'); 
  const [result, setResult] = useState('');   
  const [history, setHistory] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- API OPERATIONS ---

  // 1. Fetch History (DIPERBAIKI: Mapping Data)
  const fetchHistory = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const response = await apiClient.get(`/api/calculator/history?user_id=${user.id}`);
      
      if (Array.isArray(response)) {
        // Lakukan MAPPING di sini:
        // Ubah format API (expression, result) menjadi format UI (exp, res)
        const formattedHistory = response.map(item => ({
          id: item.id,
          exp: item.expression, // Mapping: expression -> exp
          res: item.result      // Mapping: result -> res
        }));

        setHistory(formattedHistory);
        updateLayoutProps({ history: formattedHistory });
      }
    } catch (error) {
      console.error('Failed to fetch calculator history:', error);
    }
  }, [user, updateLayoutProps]);

  // 2. Save History (DIPERBAIKI: Refresh yang benar)
  const saveToHistory = async (expression, calcResult) => {
    if (!user || !user.id) return;

    // Simpan ke State Lokal Dulu (Supaya UI instan update tanpa nunggu API)
    // Gunakan format 'exp' dan 'res' agar Sidebar langsung bisa baca
    const newLocalItem = { exp: expression, res: calcResult };
    const updatedHistory = [newLocalItem, ...history].slice(0, 20); // Limit 20
    
    setHistory(updatedHistory);
    updateLayoutProps({ history: updatedHistory });

    try {
      // Kirim ke API (Background process)
      await apiClient.post('/api/calculator/history', {
        user_id: user.id,
        expression: expression,
        result: parseFloat(calcResult)
      });
      
      // Opsional: Fetch ulang untuk memastikan sinkronisasi ID dsb
      // fetchHistory(); 
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  };

  // 3. Clear History (Tetap sama, tapi update state kosong)
  const clearHistory = useCallback(async () => {
    if (!user || !user.id) return;

    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all calculation history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/api/calculator/history?user_id=${user.id}`);
              setHistory([]);
              updateLayoutProps({ history: [] });
            } catch (error) {
              console.error('Failed to clear history:', error);
              Alert.alert('Error', 'Gagal menghapus history');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  }, [user, updateLayoutProps]);

  // --- LIFECYCLE ---

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Update layout props untuk Sidebar (DIPERBAIKI)
  useEffect(() => {
    const handleHistoryItemPress = (item) => {
      // Cek kedua kemungkinan format key (dari API atau Local)
      const val = item.res || item.result; 
      
      if (val !== undefined) {
        setInput(val.toString());
        setIsCalculated(true);
      }
    };

    updateLayoutProps({
      history: history,
      onClearHistory: clearHistory,
      onHistoryItemPress: handleHistoryItemPress,
      // Tambahkan renderer explisit sebagai cadangan
      renderHistoryItem: (item) => {
        // Handle render untuk kedua format
        const expression = item.exp || item.expression;
        const result = item.res || item.result;
        return `${expression} = ${result}`;
      }
    });
  }, [updateLayoutProps, clearHistory, history]);

  // ... (Sisa kode logic handlePress, calculateResult, dan return JSX tetap sama)
  
  // Logic Calculator tidak perlu diubah, pastikan calculateResult memanggil saveToHistory
  const isOperator = (char) => ['+', '-', '×', '÷', '^', '%', '(', ')', '°'].includes(char);
  
  const handlePress = (val, type) => {
     // ... logic sama ...
     if (val === 'AC') {
      setInput('0');
      setResult('');
      setIsCalculated(false);
      return;
    }

    if (val === 'DEL') {
      setIsCalculated(false);
      if (input.length <= 1 || (input.length === 2 && input.startsWith('-'))) {
        setInput('0');
      } else {
        setInput(input.slice(0, -1));
      }
      return;
    }

    if (val === '=') {
      calculateResult();
      return;
    }
    
    // ... logic input pintar sama ...
    let newVal = val;
    if (type === 'function' && !['e', 'π'].includes(val)) {
      newVal = val + '(';
    }
    
    if (isCalculated) {
        if (isOperator(val)) {
             if (result === 'Error') { setInput(newVal); } 
             else { setInput(result + newVal); }
             setResult(''); setIsCalculated(false); return;
        } else {
             setInput(newVal); setResult(''); setIsCalculated(false); return;
        }
    }

    if (input === '0') {
      if (isOperator(val) || val === '.') { setInput(input + newVal); } 
      else { setInput(newVal); }
    } else {
      setInput(input + newVal);
    }
  };

  const calculateResult = () => {
    try {
      // ... logic replace string sama ...
      let expression = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**') 
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/°/g, '') 
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/√(\d+)/g, 'Math.sqrt($1)')
        .replace(/log₁₀\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')    
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * (Math.PI/180))')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * (Math.PI/180))')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * (Math.PI/180))');

       const openBrackets = (expression.match(/\(/g) || []).length;
       const closeBrackets = (expression.match(/\)/g) || []).length;
       if (openBrackets > closeBrackets) { expression += ')'.repeat(openBrackets - closeBrackets); }

      // eslint-disable-next-line no-new-func
      const evalResult = new Function('return ' + expression)();

      if (!isFinite(evalResult) || isNaN(evalResult)) {
        setResult('Error');
        return; 
      }

      let finalRes = parseFloat(evalResult.toFixed(8)).toString();
      setResult(finalRes);
      
      // Panggil fungsi save yang sudah diperbaiki
      saveToHistory(input, finalRes);
      
      setIsCalculated(true); 
    } catch (error) {
      setResult('Error');
    }
  };

  // Helper & Return JSX sama seperti sebelumnya
  const CalcBtn = ({ label, type = 'number', color }) => (
    <Button label={label} onPress={() => handlePress(label, type)} color={color} />
  );

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
      <View style={styles.mainContent}>
        {loading && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#4facfe" />
            </View>
        )}
        <View style={styles.displayContainer}>
            <Text style={styles.inputText} numberOfLines={2} adjustsFontSizeToFit>{input}</Text>
            {result !== '' && <Text style={styles.resultText}>= {result}</Text>}
        </View>
        <View style={styles.keypad}>
            {/* ... tombol keypad sama ... */}
            <View style={styles.row}>
                <CalcBtn label="sin" type="function" />
                <CalcBtn label="cos" type="function" />
                <CalcBtn label="tan" type="function" />
                <CalcBtn label="AC" type="action" color="#ff6b6b" />
                <CalcBtn label="DEL" type="action" color="#ff6b6b" />
            </View>
            <View style={styles.row}>
                <CalcBtn label="ln" type="function" />
                <CalcBtn label="log₁₀" type="function" />
                <CalcBtn label="(" type="operator" /> 
                <CalcBtn label=")" type="operator" />
                <CalcBtn label="÷" type="operator" />
            </View>
            <View style={styles.row}>
                <CalcBtn label="^" type="function" />
                <CalcBtn label="7" />
                <CalcBtn label="8" />
                <CalcBtn label="9" />
                <CalcBtn label="×" type="operator" />
            </View>
            <View style={styles.row}>
                <CalcBtn label="√" type="function" />
                <CalcBtn label="4" />
                <CalcBtn label="5" />
                <CalcBtn label="6" />
                <CalcBtn label="-" type="operator" />
            </View>
            <View style={styles.row}>
                <CalcBtn label="π" type="function" />
                <CalcBtn label="1" />
                <CalcBtn label="2" />
                <CalcBtn label="3" />
                <CalcBtn label="+" type="operator" />
            </View>
            <View style={styles.row}>
                <CalcBtn label="e" type="function" />
                <CalcBtn label="." />
                <CalcBtn label="0" />
                <CalcBtn label="°" type="number" /> 
                <CalcBtn label="=" type="equal" />
            </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  mainContent: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20, backgroundColor: 'transparent' },
  loadingOverlay: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, alignItems: 'center' },
  displayContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 20 },
  inputText: { color: 'white', fontSize: 40, fontWeight: '300', textAlign: 'right' },
  resultText: { color: '#4facfe', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  keypad: { paddingHorizontal: 10, gap: 10 },
  row: { flexDirection: 'row', gap: 10, height: 60 },
});