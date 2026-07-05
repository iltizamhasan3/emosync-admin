<h1 align="center">🎨 EmoSync — Admin Panel</h1>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
</div>

<br/>

<p align="center">
  🖥️ Admin SPA untuk kelola konten EmoSync &nbsp;·&nbsp; 🔐 Sanctum auth &nbsp;·&nbsp; 📊 Dashboard &nbsp;·&nbsp; 📝 CRUD konten &nbsp;·&nbsp; ☁️ Upload file
</p>

<hr/>

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Login Admin** | Autentikasi via Sanctum token |
| 📊 **Dashboard** | Ringkasan total konten + tabel konten terbaru |
| 📝 **Kelola Konten** | CRUD Artikel, Video, Kutipan |
| 🔍 **Cari & Filter** | Cari judul + filter tipe konten |
| 📄 **Paginasi** | Navigasi halaman konten |
| 🖼️ **Upload File** | Upload thumbnail & video |
| ⚠️ **Error Boundary** | Tangkapan error render otomatis |
| 🔔 **Toast Notification** | Notifikasi sukses/gagal |

<hr/>

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vitejs.dev/) | Build tool & HMR |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS |
| [React Router v7](https://reactrouter.com/) | Routing SPA |
| [Axios](https://axios-http.com/) | HTTP client + interceptor |
| [Oxlint](https://oxc.rs/) | Linter (Rust-based) |

<hr/>

## 📁 Struktur Project

```
src/
├── api/              # Axios client & API modules
│   ├── client.js     # Instance Axios + interceptor auth
│   ├── auth.js       # Admin login/profile
│   ├── content.js    # CRUD konten
│   └── upload.js     # Upload file
├── components/       # Shared components
│   ├── AdminLayout   # Layout sidebar + main
│   ├── ErrorBoundary # Error fallback
│   ├── Header        # Page title + description
│   ├── ProtectedRoute# Redirect if unauthenticated
│   └── Sidebar       # Navigasi + user info
├── context/          # React context
│   ├── AuthContext    # Login state + token management
│   └── ToastContext   # Toast notification system
├── pages/            # Halaman
│   ├── contents/     # Content CRUD pages
│   └── DashboardPage # Statistik
├── utils/            # Constants
└── App.jsx           # Route definitions
```

<hr/>

## 🖥️ Running Locally

### Prasyarat
- Node.js >= 18
- npm

### Setup

```bash
git clone https://github.com/iltizamhasan3/emosync-admin.git
cd emosync-admin

npm install
npm run dev
# SPA aktif di http://localhost:5173
```

### Setup Backend

Admin panel butuh backend API berjalan. Clone & jalankan backend lokal:

```bash
git clone https://github.com/iltizamhasan3/emosync-backend.git
cd emosync-backend

composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=PemicuSeeder
php artisan serve
# API aktif di http://localhost:8000/api
```

Buat file `.env.local` di folder admin:

```bash
VITE_API_URL=http://localhost:8000/api
```

### Build Produksi

```bash
npm run build       # Build ke dist/
npm run preview     # Preview build lokal
npm run lint        # Oxlint check
```

<hr/>

<div align="center">
  <p>Bagian dari ekosistem EmoSync — mood tracking & mental health app</p>
  <p>
    <a href="https://github.com/iltizamhasan3/emosync">Frontend (Flutter)</a> •
    <a href="https://github.com/iltizamhasan3/emosync-backend">Backend API</a> •
    <a href="https://github.com/iltizamhasan3/emosync-admin">Admin Panel</a>
  </p>
</div>
