# 📚 Mathify - Interactive Math Learning Platform

> **UAS Project - PAWM (Pemrograman Aplikasi Web dan Mobile)**  
> Semester 5 - Institut Teknologi Bandung

Mathify adalah platform pembelajaran matematika interaktif yang menggabungkan kalkulator pintar, visualisasi grafik, dan sistem pembelajaran modular dalam satu aplikasi web dan mobile.

![Mathify Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Mathify+-+Interactive+Math+Learning)

## ✨ Features

### 🧮 **Smart Calculator**
- Basic dan advanced mathematical operations
- History management untuk semua kalkulasi
- Real-time calculation dengan UI yang responsif

### 📊 **Graph Visualization** 
- Interactive graph plotting
- Multiple function plotting dalam satu canvas
- Export dan share graph results

### 📖 **Learning Modules**
- Structured math topics dan materi pembelajaran
- Progress tracking untuk setiap modul
- Interactive quizzes dan assessments

### 👤 **User Management**
- User registration dan authentication
- Personal dashboard dengan progress overview
- Profile management

### 🎯 **Quiz System**
- Dynamic question generation
- Real-time scoring dan feedback
- Performance analytics

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React Native dengan Expo Router
- **Styling**: React Native StyleSheet + Expo Linear Gradient  
- **Charts**: React Native Chart Kit + SVG
- **Storage**: AsyncStorage untuk local data
- **Navigation**: Expo Router untuk file-based routing

### **Backend** 
- **Runtime**: Node.js dengan Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **API Documentation**: Swagger UI
- **Deployment**: Vercel Serverless Functions

### **Development Tools**
- **Version Control**: Git
- **Package Manager**: NPM
- **Development**: Expo Dev Tools
- **API Testing**: Swagger UI integrated

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- NPM atau Yarn
- Expo CLI
- Git

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd UAS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env dengan konfigurasi Supabase kamu
   ```

4. **Start Development**
   ```bash
   # Start Expo dev server
   npm start
   
   # Atau untuk web specifically
   npm run web
   ```

## 📱 Platform Support

| Platform | Status | Command |
|----------|--------|---------|
| 🌐 **Web** | ✅ Ready | `npm run web` |
| 📱 **Android** | ✅ Ready | `npm run android` |
| 🍎 **iOS** | ✅ Ready | `npm run ios` |

## 🏗️ Project Structure

```
📦 UAS/
├── 📱 app/                    # Expo Router pages
│   ├── _layout.jsx           # Root layout
│   ├── index.jsx             # Home screen
│   ├── login.jsx             # Authentication
│   ├── calculator.jsx        # Calculator page
│   ├── graph.jsx             # Graph visualization
│   ├── modul.jsx             # Learning modules
│   └── soal.jsx              # Quiz/Questions
├── 🧩 components/            # Reusable components
│   ├── layout/               # Layout components
│   ├── modals/               # Modal components
│   └── ui/                   # UI components
├── 🔧 lib/                   # Utilities & APIs
│   └── api.js                # API client configuration
├── ⚙️ backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── models/           # Data models
│   │   └── config/           # Configuration files
│   └── vercel.json          # Backend deployment config
├── 🎨 assets/               # Images & static assets
└── 📋 vercel.json           # Frontend deployment config
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users

### Calculator
- `GET /api/calculator/history` - Get calculation history
- `POST /api/calculator/history` - Save calculation
- `DELETE /api/calculator/history` - Clear history

### Modules & Learning
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get specific module
- `GET /api/modules/:id/progress` - Get user progress
- `POST /api/modules/:id/progress` - Update progress

### Quiz System
- `GET /api/questions` - Get questions
- `GET /api/questions?module_id=:id` - Get questions by module

### Graph & Visualization
- `POST /api/graph/generate` - Generate graph data

📚 **Full API Documentation**: Available at `/api-docs` when running the backend

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build untuk production
npm run build

# Deploy ke Vercel
vercel --prod
```

### Backend (Already Deployed)
- **Production URL**: `https://mathify-mobile-backend.vercel.app`
- **API Documentation**: `https://mathify-mobile-backend.vercel.app/api-docs`

### Environment Variables
Set these in Vercel Dashboard:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 🧪 Development Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run web           # Start web development
npm run android       # Start Android development  
npm run ios           # Start iOS development

# Production
npm run build         # Build for web production
npm run vercel-build  # Build for Vercel deployment
```

## 📊 Performance & Features

- ⚡ **Fast Loading**: Optimized with Expo Web
- 📱 **Responsive Design**: Works on all screen sizes
- 🔄 **Real-time Updates**: Live calculation dan progress tracking
- 💾 **Offline Support**: Local storage untuk calculation history
- 🔐 **Secure Authentication**: JWT + Supabase integration
- 📈 **Scalable Architecture**: Serverless backend with Vercel

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Derick** - *Full-stack Development* - [@derreinn](https://github.com/derreinn)

## 🙏 Acknowledgments

- Institut Teknologi Bandung - PAWM Course
- Expo Team untuk amazing framework
- Supabase untuk backend services
- Vercel untuk deployment platform

---

<div align="center">
  <strong>🧮 Made with ❤️ for ITB PAWM UAS Assignment</strong>
</div>