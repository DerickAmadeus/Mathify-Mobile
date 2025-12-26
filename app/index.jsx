import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>MATHIFY</Text>
        </View>
        
        <View style={styles.centerContent}>
          <Text style={styles.welcomeText}>Welcome !</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </LinearGradient>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    fontFamily: 'Inter',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '300',
    color: 'white',
    fontFamily: 'Inter',
  },
  buttonContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  createAccountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#302b63',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
  }
})