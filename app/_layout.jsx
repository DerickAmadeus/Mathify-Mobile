import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppLayout, LayoutProvider } from '../components'
import { usePathname } from 'expo-router'

function StackLayout() {
  const pathname = usePathname();
  
  // Pages yang membutuhkan AppLayout dengan gradient background
  const layoutPages = ['/home', '/calculator', '/graph', '/modul'];
  
  // History icon HANYA muncul di calculator dan graph saja
  const showHistory = pathname === '/calculator' || pathname === '/graph';
  const historyType = pathname === '/graph' ? 'graph' : 'calculator';
  
  const shouldShowAppLayout = layoutPages.includes(pathname);
  
  if (shouldShowAppLayout) {
    return (
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
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
      </LinearGradient>
    );
  }

  // Pages without AppLayout (login, register)
  return (
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