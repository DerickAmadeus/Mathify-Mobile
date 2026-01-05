import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useLayoutContext } from '../components/context/LayoutContext';
import { apiClient } from '../lib/api'; // Import apiClient seperti di Login.js
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

// --- HTML GRAPH ENGINE (TIDAK BERUBAH) ---
const graphHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <style>
        body { margin: 0; padding: 0; background-color: #1a1a2e; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; touch-action: none; }
        canvas { display: block; width: 100%; height: 100%; touch-action: none; }
    </style>
</head>
<body>
    <canvas id="graphCanvas"></canvas>
    <script>
        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        
        let currentFunc = ''; 
        let scale = 40; 
        let offsetX = 0;
        let offsetY = 0;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
        }
        window.addEventListener('resize', resize);

        function parseFunction(expr, x) {
            try {
                if (!expr || expr.trim() === '') return NaN;
                let safeExpr = expr.toLowerCase();
                safeExpr = safeExpr.replace(/(\\d)([a-z(])/g, '$1*$2');
                safeExpr = safeExpr
                    .replace(/x/g, '(' + x + ')')
                    .replace(/\\^/g, '**')
                    .replace(/pi/g, Math.PI)
                    .replace(/e/g, Math.E)
                    .replace(/sin\\(/g, 'Math.sin(')
                    .replace(/cos\\(/g, 'Math.cos(')
                    .replace(/tan\\(/g, 'Math.tan(')
                    .replace(/log\\(/g, 'Math.log10(')
                    .replace(/ln\\(/g, 'Math.log(')
                    .replace(/sqrt\\(/g, 'Math.sqrt(')
                    .replace(/abs\\(/g, 'Math.abs(');
                return eval(safeExpr);
            } catch (e) { return NaN; }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2 + offsetX;
            const cy = height / 2 + offsetY;

            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "10px sans-serif";
            const gridSize = scale; 

            for (let i = cx % gridSize; i < width; i += gridSize) {
                ctx.strokeStyle = (Math.abs(i - cx) < 1) ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = (Math.abs(i - cx) < 1) ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(i, 0); ctx.lineTo(i, height);
                ctx.stroke();
                if (Math.abs(i - cx) > 1) { 
                    let val = Math.round((i - cx) / scale);
                    ctx.fillStyle = "#aaa";
                    ctx.fillText(val, i, cy + 5);
                }
            }

            ctx.textBaseline = "middle";
            ctx.textAlign = "right";
            for (let i = cy % gridSize; i < height; i += gridSize) {
                ctx.strokeStyle = (Math.abs(i - cy) < 1) ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = (Math.abs(i - cy) < 1) ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(0, i); ctx.lineTo(width, i);
                ctx.stroke();
                if (Math.abs(i - cy) > 1) {
                    let val = Math.round((cy - i) / scale);
                    ctx.fillStyle = "#aaa";
                    ctx.fillText(val, cx - 5, i);
                }
            }
            
            ctx.fillStyle = "#fff";
            ctx.fillText("0", cx - 5, cy + 5);

            if (!currentFunc || currentFunc.trim() === '') return;

            ctx.strokeStyle = '#4facfe';
            ctx.lineWidth = 3;
            ctx.beginPath();

            let firstPoint = true;
            for (let px = 0; px < width; px+=2) { 
                const x = (px - cx) / scale;
                const y = parseFunction(currentFunc, x);
                const py = cy - (y * scale);

                if (isNaN(y) || Math.abs(py) > height * 10) { 
                    firstPoint = true; 
                } else {
                    if (firstPoint) {
                        ctx.moveTo(px, py);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
            }
            ctx.stroke();
        }

        // --- Touch logic remains same ---
        let touches = [];
        let lastDistance = 0;
        let lastCenter = { x: 0, y: 0 };
        let isDragging = false;
        let lastTouch = { x: 0, y: 0 };

        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touches = Array.from(e.touches);
            if (touches.length === 1) {
                isDragging = true;
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
            } else if (touches.length === 2) {
                isDragging = false;
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                lastDistance = Math.sqrt(dx * dx + dy * dy);
                lastCenter.x = (touches[0].clientX + touches[1].clientX) / 2;
                lastCenter.y = (touches[0].clientY + touches[1].clientY) / 2;
            }
        });

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            touches = Array.from(e.touches);
            if (touches.length === 1 && isDragging) {
                const deltaX = touches[0].clientX - lastTouch.x;
                const deltaY = touches[0].clientY - lastTouch.y;
                offsetX += deltaX;
                offsetY += deltaY;
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
                draw();
            } else if (touches.length === 2) {
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const centerX = (touches[0].clientX + touches[1].clientX) / 2;
                const centerY = (touches[0].clientY + touches[1].clientY) / 2;
                if (lastDistance > 0) {
                    const zoomFactor = distance / lastDistance;
                    const newScale = scale * zoomFactor;
                    if (newScale >= 5 && newScale <= 200) {
                        scale = newScale;
                        const zoomCenterX = centerX - width / 2;
                        const zoomCenterY = centerY - height / 2;
                        offsetX = offsetX * zoomFactor + zoomCenterX * (1 - zoomFactor);
                        offsetY = offsetY * zoomFactor + zoomCenterY * (1 - zoomFactor);
                        draw();
                    }
                }
                lastDistance = distance;
                lastCenter.x = centerX;
                lastCenter.y = centerY;
            }
        });

        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            touches = Array.from(e.touches);
            if (touches.length === 0) {
                isDragging = false;
                lastDistance = 0;
            } else if (touches.length === 1) {
                isDragging = true;
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
                lastDistance = 0;
            }
        });

        window.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'PLOT') {
                    currentFunc = data.value;
                    draw();
                } else if (data.type === 'ZOOM_IN') {
                    scale *= 1.2;
                    draw();
                } else if (data.type === 'ZOOM_OUT') {
                    scale /= 1.2;
                    draw();
                } else if (data.type === 'RESET') {
                    scale = 40; offsetX = 0; offsetY = 0;
                    draw();
                }
            } catch (e) { console.error(e); }
        });
        
        document.addEventListener('message', function(event) {
            window.postMessage(event.data, '*');
        });
        setTimeout(resize, 100);
    </script>
</body>
</html>
`;

const Graph = () => {
  const insets = useSafeAreaInsets();

  // Ambil user dari Context yang sudah login
  const { updateLayoutProps, user } = useLayoutContext(); 
  const webViewRef = useRef(null);
  
  // State
  const [functionInput, setFunctionInput] = useState('');
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  // --- API INTEGRATION ---

  // 1. Fetch History
  const fetchHistory = useCallback(async () => {
    // Pastikan user ada (sudah login)
    if (!user || !user.id) return;

    try {
      // Panggil API endpoint (GET /api/graph/history?user_id=1)
      const response = await apiClient.get(`/api/graph/history?user_id=${user.id}`);
      
      // Jika response array (langsung dari controller), mapping datanya
      // Backend: [{id: 1, function_expression: 'x^2'}, ...]
      // Frontend UI: ['x^2', ...]
      if (Array.isArray(response)) {
        const historyList = response.map(item => item.function_expression);
        setHistory(historyList);
        // Update Sidebar Context
        updateLayoutProps({ history: historyList });
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, [user, updateLayoutProps]);

  // 2. Save History
  const saveToHistory = async (func) => {
    if (!user || !user.id) return;
    
    try {
      await apiClient.post('/api/graph/history', {
        user_id: user.id,
        function_expression: func
      });
      // Refresh history agar sinkron dengan database
      fetchHistory();
    } catch (error) {
      console.error('Failed to save history:', error);
      Alert.alert('Error', 'Gagal menyimpan history');
    }
  };

  // 3. Clear History
  const clearHistory = useCallback(async () => {
    if (!user || !user.id) return;

    // Konfirmasi sebelum hapus
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all graph history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/api/graph/history?user_id=${user.id}`);
              setHistory([]);
              updateLayoutProps({ history: [] });
              Alert.alert('Success', 'History berhasil dihapus');
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

  // --- LIFECYCLE & HANDLERS ---

  // Load history saat pertama kali buka
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Update layout props (Sidebar logic)
  useEffect(() => {
    const handleHistoryItemPress = (item) => {
      // Handle jika item object (dari API) atau string
      const val = typeof item === 'object' ? item.value : item;
      handlePreset(val);
    };
    
    updateLayoutProps({
      history: history,
      onClearHistory: clearHistory,
      onHistoryItemPress: handleHistoryItemPress,
    });
  }, [updateLayoutProps, clearHistory, history]);

  const sendToWeb = (type, value = null) => {
    if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type, value }));
    }
  };

  const handlePlot = () => {
    Keyboard.dismiss();
    const funcToPlot = functionInput.trim();
    if (!funcToPlot) return;

    sendToWeb('PLOT', funcToPlot);

    // Cek duplikasi di local state untuk UX instan, lalu simpan ke DB
    if (!history.includes(funcToPlot)) {
       saveToHistory(funcToPlot);
    }
  };

  const handlePreset = (func) => {
      setFunctionInput(func);
      setTimeout(() => {
        sendToWeb('PLOT', func);
        // Simpan ke history jika belum ada
        if (!history.includes(func) && func.trim() !== '') {
           saveToHistory(func);
        }
      }, 100);
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradientBackground}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { backgroundColor: 'transparent', paddingBottom: Math.max(insets.bottom, 20) }]}
        keyboardShouldPersistTaps="handled"
      >
            
            {/* 1. GRAPH SECTION */}
            <View style={styles.graphWrapper}>
                <View style={styles.canvasContainer}>
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: graphHTML }}
                        style={styles.webview}
                        scrollEnabled={false}
                        onMessage={(event) => console.log('WebView msg:', event.nativeEvent.data)}
                    />
                    {/* Zoom Controls */}
                    <View style={styles.zoomOverlay}>
                        <TouchableOpacity onPress={() => sendToWeb('ZOOM_IN')} style={styles.zoomCircle}>
                            <Feather name="plus" size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendToWeb('ZOOM_OUT')} style={styles.zoomCircle}>
                            <Feather name="minus" size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendToWeb('RESET')} style={styles.zoomCircle}>
                            <Feather name="maximize" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 2. INPUT SECTION */}
            <View style={styles.sectionContainer}>
                <Text style={styles.label}>Function (y = )</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.funcInput}
                        value={functionInput}
                        onChangeText={setFunctionInput}
                        placeholder="e.g. x^2, 2x+3"
                        placeholderTextColor="rgba(255,255,255,0.4)" 
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={handlePlot}
                    />
                </View>
                
                <TouchableOpacity 
                    style={[styles.plotBtn, loading && styles.disabledBtn]} 
                    onPress={handlePlot}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                         <ActivityIndicator color="white" size="small" />
                    ) : (
                         <Text style={styles.plotBtnText}>Plot Graph</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* 3. QUICK EXAMPLES */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Quick Examples:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
                    {[
                        { label: "Quadratic: x²", val: "x^2" },
                        { label: "Sine: sin(x)", val: "sin(x)" },
                        { label: "Cosine: cos(x)", val: "cos(x)" },
                        { label: "Exp: e^x", val: "e^x" },
                        { label: "Linear: 2x+3", val: "2x+3" }
                    ].map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.presetBtn} onPress={() => handlePreset(item.val)}>
                            <Text style={styles.presetText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 4. TIPS SECTION */}
            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Tips:</Text>
                <View style={styles.infoList}>
                    <Text style={styles.infoText}>• Use ^ for exponents (e.g., x^2)</Text>
                    <Text style={styles.infoText}>• Trig functions: sin(x), cos(x)</Text>
                    <Text style={styles.infoText}>• Constants: pi, e</Text>
                </View>
            </View>

            <View style={{height: 30}} />
      </ScrollView>
    </LinearGradient>
  );
};

export default Graph;

const styles = StyleSheet.create({
  // Gradient Background
  gradientBackground: {
    flex: 1,
  },
  scrollContent: { 
    paddingHorizontal: 20,
    paddingTop: 36 
  },
  // Graph
  graphWrapper: { marginBottom: 20 },
  canvasContainer: { 
    height: 350, 
    width: '100%', 
    borderRadius: 12, 
    overflow: 'hidden', 
    backgroundColor: '#1a1a2e', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)', 
    position: 'relative'
  },
  webview: { backgroundColor: 'transparent' },
  zoomOverlay: { position: 'absolute', bottom: 15, right: 15, gap: 10 },
  zoomCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    elevation: 5 
  },
  // Input Section
  sectionContainer: { marginBottom: 20 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 8, marginLeft: 2 },
  inputRow: { marginBottom: 10 },
  funcInput: { 
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white', 
    padding: 14, 
    borderRadius: 10, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)' 
  },
  plotBtn: { 
    backgroundColor: 'rgba(108, 92, 231, 1)', 
    borderRadius: 10, 
    paddingVertical: 12, 
    alignItems: 'center',
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  disabledBtn: {
    backgroundColor: 'rgba(108, 92, 231, 0.5)',
  },
  plotBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Presets
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  presetScroll: { flexDirection: 'row' },
  presetBtn: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 8, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  presetText: { color: '#a5a1c9', fontSize: 13, fontWeight: '500' },

  // Tips
  infoBox: { 
    backgroundColor: 'rgba(255, 235, 59, 0.05)', 
    borderColor: 'rgba(255, 235, 59, 0.2)', 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 15 
  },
  infoTitle: { color: '#f1c40f', fontWeight: 'bold', marginBottom: 5 },
  infoList: { marginLeft: 5 },
  infoText: { color: '#ccc', fontSize: 13, lineHeight: 20 },
});