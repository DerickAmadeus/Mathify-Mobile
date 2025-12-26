import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  Modal, 
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { WebView } from 'react-native-webview';

// --- HTML GRAPH ENGINE ---
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
                // Regex untuk implicit multiplication (2x -> 2*x)
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

            // --- DRAW GRID & NUMBERS ---
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "10px sans-serif";
            const gridSize = scale; 

            // Vertical Grid & Labels
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

            // Horizontal Grid & Labels
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
            
            // Center '0'
            ctx.fillStyle = "#fff";
            ctx.fillText("0", cx - 5, cy + 5);

            // --- JIKA INPUT KOSONG, BERHENTI DI SINI ---
            if (!currentFunc || currentFunc.trim() === '') return;

            // --- DRAW FUNCTION ---
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

        // Touch gesture variables
        let touches = [];
        let lastDistance = 0;
        let lastCenter = { x: 0, y: 0 };
        let isDragging = false;
        let lastTouch = { x: 0, y: 0 };

        // Touch event handlers
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touches = Array.from(e.touches);
            
            if (touches.length === 1) {
                // Single touch - prepare for dragging
                isDragging = true;
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
            } else if (touches.length === 2) {
                // Two touches - prepare for pinch zoom
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
                // Single touch - drag/pan
                const deltaX = touches[0].clientX - lastTouch.x;
                const deltaY = touches[0].clientY - lastTouch.y;
                
                offsetX += deltaX;
                offsetY += deltaY;
                
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
                draw();
            } else if (touches.length === 2) {
                // Two touches - pinch zoom
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const centerX = (touches[0].clientX + touches[1].clientX) / 2;
                const centerY = (touches[0].clientY + touches[1].clientY) / 2;

                if (lastDistance > 0) {
                    // Calculate zoom factor
                    const zoomFactor = distance / lastDistance;
                    const newScale = scale * zoomFactor;
                    
                    // Limit zoom range
                    if (newScale >= 5 && newScale <= 200) {
                        scale = newScale;
                        
                        // Zoom towards center of pinch
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
                // Switch back to single touch mode
                isDragging = true;
                lastTouch.x = touches[0].clientX;
                lastTouch.y = touches[0].clientY;
                lastDistance = 0;
            }
        });

        // Handle messages from React Native
        window.addEventListener('message', function(event) {
            console.log('WebView received message:', event.data);
            try {
                const data = JSON.parse(event.data);
                console.log('Parsed data:', data);
                if (data.type === 'PLOT') {
                    currentFunc = data.value;
                    console.log('Setting function:', currentFunc);
                    draw();
                } else if (data.type === 'ZOOM_IN') {
                    scale *= 1.2;
                    draw();
                } else if (data.type === 'ZOOM_OUT') {
                    scale /= 1.2;
                    draw();
                } else if (data.type === 'RESET') {
                    scale = 40;
                    offsetX = 0;
                    offsetY = 0;
                    draw();
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        });
        
        // Also handle document message for compatibility
        document.addEventListener('message', function(event) {
            window.postMessage(event.data, '*');
        });
        setTimeout(resize, 100);
    </script>
</body>
</html>
`;

const Graph = () => {
  const router = useRouter();
  const pathname = usePathname();
  const webViewRef = useRef(null);
  
  // State
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  
  const [functionInput, setFunctionInput] = useState(''); // Default Kosong
  const [history, setHistory] = useState([]);

  // Mock User Data
  const userData = { username: "User123", email: "user@example.com" };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.replace('/') }
    ]);
  };

  const sendToWeb = (type, value = null) => {
    if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type, value }));
    }
  };

  const handlePlot = () => {
    Keyboard.dismiss();
    sendToWeb('PLOT', functionInput);
    if (!history.includes(functionInput) && functionInput.trim() !== '') {
        setHistory(prev => [functionInput, ...prev].slice(0, 15));
    }
  };

  const handlePreset = (func) => {
      setFunctionInput(func);
      setTimeout(() => {
        sendToWeb('PLOT', func);
      }, 100);
  };

  const SidebarItem = ({ icon, text, path }) => {
    const isActive = pathname === path;
    return (
      <TouchableOpacity 
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => {
          setSidebarVisible(false);
          if (!isActive) router.push(path); 
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

          {/* Right Side */}
          <View style={styles.topBarRight}>
            <TouchableOpacity onPress={() => setHistoryModalVisible(true)} style={styles.iconBtn}>
               <Feather name="clock" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.profileBtn} 
                onPress={() => setProfileMenuVisible(!profileMenuVisible)}
            >
                <View style={styles.avatar}>
                  <Feather name="user" size={16} color="#302b63" />
                </View>
                {/* CHEVRON DOWN ADDED HERE */}
                <Feather name="chevron-down" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PROFILE DROPDOWN */}
        {profileMenuVisible && (
            <TouchableWithoutFeedback onPress={() => setProfileMenuVisible(false)}>
                <View style={styles.dropdownOverlay}>
                     <View style={styles.dropdownMenu}>
                        <View style={styles.dropdownHeader}>
                            <Text style={styles.dropdownUser}>{userData.username}</Text>
                            <Text style={styles.dropdownEmail}>{userData.email}</Text>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                            <Feather name="log-out" size={18} color="#ff6b6b" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )}

        {/* === MAIN CONTENT === */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* 1. GRAPH SECTION */}
            <View style={styles.graphWrapper}>
                <View style={styles.canvasContainer}>
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: graphHTML }}
                        style={styles.webview}
                        scrollEnabled={false}
                    />
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
                <TouchableOpacity style={styles.plotBtn} onPress={handlePlot}>
                    <Text style={styles.plotBtnText}>Plot Graph</Text>
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
                        { label: "Tangent: tan(x)", val: "tan(x)" },
                        { label: "Exp: e^x", val: "e^x" },
                        { label: "Reciprocal: 1/x", val: "1/x" },
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
                    <Text style={styles.infoText}>• Operations: +, -, *, /, sqrt(), abs()</Text>
                </View>
            </View>

            <View style={{height: 30}} />
        </ScrollView>

        {/* === SIDEBAR & HISTORY MODALS === */}
        <Modal visible={sidebarVisible} transparent={true} animationType="fade" onRequestClose={() => setSidebarVisible(false)}>
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
                  <View style={styles.sidebarFooter}><Text style={styles.sidebarFooterText}>Ver 1.0.0</Text></View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal visible={historyModalVisible} transparent={true} animationType="slide" onRequestClose={() => setHistoryModalVisible(false)}>
          <View style={styles.historyOverlay}>
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Graph History</Text>
                <View style={styles.historyActions}>
                    <TouchableOpacity onPress={() => setHistory([])} style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                        <Feather name="x" size={24} color="white" />
                    </TouchableOpacity>
                </View>
              </View>
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                {history.length === 0 ? (
                    <Text style={{color:'#888', textAlign:'center'}}>No history yet.</Text>
                ) : (
                    history.map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.historyItem} onPress={() => { handlePreset(item); setHistoryModalVisible(false); }}>
                        <Text style={styles.historyRes}>y = {item}</Text>
                        </TouchableOpacity>
                    ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: { flex: 1 },
  // TopBar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, zIndex: 20 },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 5 },
  
  // UPDATED PROFILE BUTTON STYLE
  profileBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    padding: 5, 
    paddingRight: 10, // Sedikit padding kanan agar chevron tidak mepet
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 20 
  },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'white', justifyContent:'center', alignItems:'center'},

  // Dropdown Menu
  dropdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  dropdownMenu: { position: 'absolute', top: 70, right: 20, backgroundColor: '#24243e', borderRadius: 12, padding: 15, width: 200, borderWidth:1, borderColor:'rgba(255,255,255,0.1)', shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.3, shadowRadius:10, elevation:10 },
  dropdownHeader: { marginBottom: 10 },
  dropdownUser: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dropdownEmail: { color: '#aaa', fontSize: 12 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 10 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  logoutText: { color: '#ff6b6b', fontWeight: '600' },

  // Scroll Content
  scrollContent: { paddingHorizontal: 20 },

  // Graph
  graphWrapper: { marginBottom: 20 },
  canvasContainer: { height: 350, width: '100%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', position: 'relative' },
  webview: { backgroundColor: 'transparent' },
  zoomOverlay: { position: 'absolute', bottom: 15, right: 15, gap: 10 },
  zoomCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', elevation: 5 },

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
    backgroundColor: '#6c5ce7', 
    borderRadius: 10, 
    paddingVertical: 12, 
    alignItems: 'center',
    shadowColor: "#6c5ce7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  plotBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Presets
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  presetScroll: { flexDirection: 'row' },
  presetBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  presetText: { color: '#a5a1c9', fontSize: 13, fontWeight: '500' },

  // Tips
  infoBox: { backgroundColor: 'rgba(255, 235, 59, 0.05)', borderColor: 'rgba(255, 235, 59, 0.2)', borderWidth: 1, borderRadius: 10, padding: 15 },
  infoTitle: { color: '#f1c40f', fontWeight: 'bold', marginBottom: 5 },
  infoList: { marginLeft: 5 },
  infoText: { color: '#ccc', fontSize: 13, lineHeight: 20 },

  // Modals
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

  historyOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  historyContainer: { height: '50%', backgroundColor: '#24243e', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  historyTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  clearBtn: { backgroundColor: '#ff6b6b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  clearBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  historyItem: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 5 },
  historyRes: { color: 'white', fontSize: 18, fontWeight: '500' },
});