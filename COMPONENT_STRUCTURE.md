# Fixed Layout - Component Structure

## 📁 Struktur Folder Components

```
components/
├── layout/
│   ├── AppLayout.jsx       # Main layout wrapper dengan gradient & SafeAreaView
│   ├── TopBar.jsx          # Header/navbar dengan menu, logo, dan profile
│   ├── Sidebar.jsx         # Navigation sidebar dengan menu items
│   └── ProfileMenu.jsx     # Dropdown menu profile dengan user info
├── modals/
│   └── HistoryModal.jsx    # Modal untuk menampilkan history kalkulasi
├── ui/
│   └── Button.jsx          # Reusable button component untuk calculator
└── index.js               # Export barrel file
```

## 🔧 Cara Penggunaan

### 1. Import Components
```jsx
import { AppLayout, Button } from '../components';
// atau
import AppLayout from '../components/layout/AppLayout';
```

### 2. AppLayout (Main Wrapper)
```jsx
<AppLayout
  showHistory={true}              // Tampilkan tombol history di topbar
  history={historyArray}          // Array history untuk modal
  onClearHistory={() => setHistory([])}  // Handler clear history
>
  {/* Your page content */}
</AppLayout>
```

### 3. Button Component
```jsx
<Button
  label="7"                       // Text yang ditampilkan
  type="number"                   // number | operator | function | action | equal
  color="#ff6b6b"                // Custom color (optional)
  flex={1}                        // Flex value (default: 1)
  onPress={() => handlePress("7", "number")}
/>
```

## 🎨 Button Types & Styles

- **number**: Default button (putih dengan background transparan)
- **operator**: Operator buttons (+, -, ×, ÷) dengan background biru
- **function**: Function buttons (sin, cos, ln) dengan background abu-abu
- **action**: Action buttons (AC, DEL) dengan background merah muda
- **equal**: Tombol sama dengan (=) dengan background putih

## 📱 Features

### AppLayout Features:
- ✅ Gradient background (biru ke ungu)
- ✅ SafeAreaView untuk iOS notch compatibility
- ✅ TopBar dengan logo, menu, dan profile dropdown
- ✅ Sidebar navigation (Home, Calculator, Graph, Modul)
- ✅ History modal (jika showHistory=true)
- ✅ Auto logout functionality

### Responsive Design:
- ✅ Tombol history hanya muncul jika showHistory=true
- ✅ Profile dropdown dengan animasi
- ✅ Sidebar dengan overlay dan smooth animation
- ✅ Modal history dengan slide animation

## 🔄 Navigation Routes

Sidebar menu mengarah ke:
- **Home**: `/` 
- **Calculator**: `/calculator`
- **Graph**: `/graph`
- **Modul**: `/modul`

## 🎯 Benefits

1. **Reusable**: Komponen bisa dipakai di semua page
2. **Maintainable**: Logic terpisah, mudah maintenance
3. **Consistent**: UI konsisten di semua halaman
4. **Scalable**: Mudah ditambah fitur baru
5. **Clean Code**: Tidak ada duplicate code

## 📝 Next Steps

- [ ] Tambahkan Input component di `ui/`
- [ ] Buat theme system untuk colors
- [ ] Tambahkan animation utilities
- [ ] Implementasikan context untuk global state
- [ ] Tambahkan unit tests