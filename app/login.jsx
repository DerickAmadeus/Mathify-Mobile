import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useLayoutContext } from '../components/context/LayoutContext';
import { apiClient } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login, isAuthenticated } = useLayoutContext();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Tolong isi username dan password');
      return;
    }

    setLoading(true);
    try {
      // Testing fallback credential for development
      if (email === 'admin' && password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: 'Administrator',
        };
        
        const sessionToken = `session_admin_${Date.now()}`;
        await login(userData, sessionToken);
        
        Alert.alert('Success', 'Login berhasil!', [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]);
        return;
      }

      const response = await apiClient.post('/api/users/auth/login', {
        username: email, // Using email field as username logic
        password: password,
      });

      if (response.success) {
        // Save user data
        const userData = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          full_name: response.user.username,
        };

        const sessionToken = `session_${response.user.id}_${Date.now()}`;
        
        await login(userData, sessionToken);
        
        Alert.alert('Success', 'Login berhasil!', [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]);
      } else {
        Alert.alert('Login Failed', response.error || 'Login gagal');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('Network request failed')) {
        Alert.alert('Info', 'Untuk testing gunakan:\nUsername: admin\nPassword: admin123');
      } else {
        Alert.alert('Error', 'Username atau password salah');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.container}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.mainContainer}>
              
              {/* Bagian 1: Branding (Sama persis dengan Register) */}
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

              {/* Bagian 2: Login Form (Styling disamakan dengan Register) */}
              <View style={styles.formSection}>
                <View style={styles.headerForm}>
                  <Text style={styles.headerTitle}>Welcome back</Text>
                  <Text style={styles.headerSubtitle}>Sign in to continue</Text>
                </View>

                {/* Input: Username */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="user" size={15} color="#aaa" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="Enter your username"
                      placeholderTextColor="#aaa"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                {/* Input: Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Feather name="lock" size={15} color="#aaa" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#aaa"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>
                </View>

                {/* Login Button (Styling putih seperti Register) */}
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.disabledButton]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#302b63" size="small" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Feather name="log-in" size={15} color="#302b63" />
                    </>
                  )}
                </TouchableOpacity>

                {/* Register Link */}
                <View style={styles.registerLinkContainer}>
                  <Text style={styles.registerLinkText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLinkHighlight}>Sign up</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  mainContainer: {
    padding: 24,
    width: '100%',
  },
  
  // --- Styling Branding ---
  logoImage: {
    width: 40,  
    height: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },

  // --- Styling Form (Konsisten dengan Register) ---
  formSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerForm: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // --- Inputs ---
  inputGroup: {
    marginBottom: 15, // Sedikit lebih renggang karena item lebih sedikit dari register
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 50,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    height: '100%',
  },

  // --- Button ---
  loginButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loginButtonText: {
    color: '#302b63',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // --- Register Link (Footer) ---
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerLinkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  registerLinkHighlight: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
});