import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import { useLayoutContext } from '../components/context/LayoutContext';

// Force reload comment - updated Dec 27, 2025
const Calculator = () => {
  const { updateLayoutProps } = useLayoutContext();
  
  // --- STATE CALCULATOR ---
  const [input, setInput] = useState('0'); 
  const [result, setResult] = useState('');  
  const [history, setHistory] = useState([]);
  
  // STATE BARU: Penanda bahwa kalkulasi baru saja selesai
  const [isCalculated, setIsCalculated] = useState(false);

  // Setup layout props hanya sekali saat component mount
  useEffect(() => {
    updateLayoutProps({
      history: [],
      onClearHistory: () => setHistory([]),
    });
  }, [updateLayoutProps]); 

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
      const newHistoryItem = { exp: input, res: finalRes };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
      
      // Update context dengan history baru
      updateLayoutProps({
        history: [newHistoryItem, ...history].slice(0, 20),
      });
      
      setIsCalculated(true); 
    } catch (error) {
      setResult('Error');
    }
  };

  // CalcBtn Component Helper
  const CalcBtn = ({ label, type = 'number', color }) => (
    <Button 
      label={label} 
      onPress={() => handlePress(label, type)} 
      color={color}
    />
  );

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
      <View style={styles.mainContent}>
        {/* DISPLAY */}
        <View style={styles.displayContainer}>
        <Text 
          style={styles.inputText} 
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
    </LinearGradient>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  // GRADIENT BACKGROUND
  gradientBackground: {
    flex: 1,
  },
  // CONTENT
  mainContent: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    paddingBottom: 20,
    backgroundColor: 'transparent' // Ensure background is transparent to show gradient
  },
  displayContainer: {
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
    paddingHorizontal: 20, 
    paddingBottom: 20
  },
  inputText: { 
    color: 'white', 
    fontSize: 40, 
    fontWeight: '300', 
    textAlign: 'right' 
  },
  resultText: { 
    color: '#4facfe', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 5 
  },

  // KEYPAD
  keypad: { 
    paddingHorizontal: 10, 
    gap: 10 
  },
  row: { 
    flexDirection: 'row', 
    gap: 10, 
    height: 60 
  },
});