import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppLayout, LayoutProvider } from '../components'
import { usePathname, useRouter } from 'expo-router'
import { useLayoutContext } from '../components/context/LayoutContext'
import { useEffect } from 'react'
import { View, ActivityIndicator, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useLayoutContext()
  const router = useRouter()
  const pathname = usePathname()
  
  // Public routes yang bisa diakses tanpa login
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublicRoute) {
      router.replace('/login')
    }
  }, [isAuthenticated, loading, isPublicRoute])
  
  if (loading) {
    return (
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator color="white" size="large" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
      </LinearGradient>
    )
  }
  
  if (!isAuthenticated && !isPublicRoute) {
    return null // Will redirect to login
  }
  
  return children
}

function StackLayout() {
  const pathname = usePathname();
  
  // Pages yang membutuhkan AppLayout
  const layoutPages = ['/home', '/calculator', '/graph', '/modul'];
  
  // History icon HANYA muncul di calculator dan graph saja
  const showHistory = pathname === '/calculator' || pathname === '/graph';
  const historyType = pathname === '/graph' ? 'graph' : 'calculator';
  
  const shouldShowAppLayout = layoutPages.includes(pathname);
  
  if (shouldShowAppLayout) {
    return (
      <ProtectedRoute>
        <AppLayout 
          showHistory={showHistory}
          historyType={historyType}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'none',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="home" />
            <Stack.Screen name="calculator" />
            <Stack.Screen name="graph" />
            <Stack.Screen name="modul" />
          </Stack>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  // Pages without AppLayout (login, register)
  return (
    <ProtectedRoute>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'none'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="calculator" />
        <Stack.Screen name="graph" />
        <Stack.Screen name="modul" />
      </Stack>
    </ProtectedRoute>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LayoutProvider>
        <StatusBar style="light" />
        <StackLayout />
      </LayoutProvider>
    </SafeAreaProvider>
  )
}