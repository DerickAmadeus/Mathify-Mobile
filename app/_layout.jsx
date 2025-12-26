import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        // 1. Ubah warna background container agar tidak ada flash putih
        contentStyle: { backgroundColor: '#0f0c29' }, 
        // 2. Opsional: Memperhalus animasi (slide dari kanan standar iOS/Android modern)
        animation: 'slide_from_right', 
      }}
    >
      {/* Stack mendeteksi file otomatis */}
    </Stack>
  );
}