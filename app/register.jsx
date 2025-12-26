import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  // Image, <-- Hapus Image jika tidak dipakai
  // ScrollView <-- Hapus ScrollView dari import
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 

const Register = () => {
  const router = useRouter();
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        
        <View style={styles.mainContainer}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <View style={styles.backButtonInner}>
              <Text style={styles.backText}>← Back</Text>
            </View>
          </TouchableOpacity>
          
          {/* Bagian 1: Branding (Logo) */}
          <View style={styles.brandSection}>
            <View style={styles.logoPlaceholder}> 
               <Feather name="box" size={40} color="white" /> 
            </View>
            <Text style={styles.brandTitle}>Mathify</Text>
          </View>

          {/* Bagian 2: Register Form */}
          <View style={styles.formSection}>
            <View style={styles.headerForm}>
              <Text style={styles.headerTitle}>Create account</Text>
              <Text style={styles.headerSubtitle}>Sign up to join Mathify</Text>
            </View>

            {/* Input: Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={15} color="#aaa" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Choose a username"
                  placeholderTextColor="#aaa"
                  value={form.username}
                  onChangeText={(text) => setForm({...form, username: text})}
                />
              </View>
            </View>

            {/* Input: Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={15} color="#aaa" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => setForm({...form, email: text})}
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
                  placeholder="Create a password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={true}      
                  autoCapitalize="none"       
                  autoCorrect={false}         
                  textContentType="password"  
                  value={form.password}
                  onChangeText={(text) => setForm({...form, password: text})}
                />
              </View>
            </View>

            {/* Input: Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="check-circle" size={15} color="#aaa" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Repeat your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(text) => setForm({...form, confirmPassword: text})}
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={() => {
                console.log(form); // (Opsional) Tetap log data form buat debugging
                router.replace('/calculator'); 
              }}>
              <Text style={styles.registerButtonText}>Register</Text>
              <Feather name="arrow-right" size={15} color="#302b63" />
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLinkHighlight}>Sign in</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- Style Pengganti ScrollContent ---
  mainContainer: {
    flex: 1, // Agar memenuhi layar
    padding: 24,
    justifyContent: 'center', // Konten selalu di tengah vertikal
  },
  
  // --- Styling Branding ---
  brandSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30, 
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },

  // --- Styling Form ---
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
    marginBottom: 10,
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
  registerButton: {
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
  registerButtonText: {
    color: '#302b63',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // --- Login Link ---
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  loginLinkHighlight: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    textDecorationLine: 'underline',
  },

  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});