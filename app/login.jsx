import React, { useState } from 'react'
import { 
  Image,
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  Dimensions
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'

const { height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mainContainer}>
              
              <View style={styles.brandSection}>
                <View style={styles.logoPlaceholder}> 
                  <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.brandTitle}>Mathify</Text>
              </View>

              {/* Login Card */}
              <View style={styles.loginCard}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="kristin.watson@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                  />
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                      {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.signInButton} 
                  onPress={() => router.replace('/home')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signInText}>Sign in</Text>
                </TouchableOpacity>

                <Text style={styles.dividerText}>Sign in with</Text>

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.replace('/register')}>
                    <Text style={styles.signUpLink}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImage: {
      width: 40,  
      height: 40,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  mainContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    paddingVertical: 8,
    paddingRight: 20, 
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },

  // --- BAGIAN YANG DIPERBAIKI ---
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    
    // Shadow Styling
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    
    // FIX ANDROID: Matikan elevation jika ada border width
    // Elevation + BorderWidth + Transparan = Garis Putih (Halo)
    elevation: Platform.OS === 'android' ? 0 : 5, 
    
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    
    // FIX ANDROID: Mencegah background bocor keluar border
    overflow: 'hidden', 
  },
  // -----------------------------

  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  
  // --- BAGIAN YANG DIPERBAIKI ---
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    // FIX ANDROID: Mencegah warna input bocor di pojokan
    overflow: 'hidden',
  },
  // -----------------------------

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  forgotText: {
    fontSize: 13,
    color: '#60A5FA',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  signUpLink: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '600',
  },
})