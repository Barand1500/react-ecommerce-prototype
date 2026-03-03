<div align="center">

# 🛒 Güzel Teknoloji — E-Commerce

### A Modern & Feature-Rich Tech Store Prototype

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12-FF4154?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br>

A fully client-side e-commerce prototype built with **React 19**, **TypeScript** and **Tailwind CSS v4**.  
No backend required — all data is stored in LocalStorage.

<br>

[🇬🇧 English](#-english) • [🇹🇷 Türkçe](#-türkçe) • [📸 Screenshots](#-screenshots)

</div>

---

## 🇬🇧 English

### ✨ Features

#### 🛍️ Shopping Experience
- **Product Catalog** — Grid/list views with advanced filtering (category, brand, price range, color, rating)
- **Product Detail** — Image gallery, variant selection (color/storage), specifications table
- **Quick View** — Modal preview without leaving the current page
- **Product Comparison** — Compare up to 4 products side by side
- **Price History Chart** — Visual price tracking over time
- **Price Alert** — Set a target price and get notified
- **Installment Calculator** — Bank-specific installment plans with monthly payments

#### 🛒 Cart & Checkout
- **Persistent Cart** — Saved to LocalStorage, survives page refresh
- **Multi-step Checkout** — Address → Payment → Confirmation flow
- **Saved Carts** — Save current cart for later and restore anytime
- **Order Summary** — Detailed breakdown with tax and shipping

#### ❤️ Favorites & Sharing
- **Wishlist** — Add/remove products with toast notifications
- **Share Wishlist** — Native Web Share API with clipboard fallback
- **Add All to Cart** — One-click to move all favorites into the cart

#### 👤 User Account
- **Auth Modal** — Login/Register with animated tab switching
- **Profile Management** — Edit personal info, avatar, addresses
- **Order History** — View past orders with status tracking
- **Account Transactions** — Balance and transaction history
- **Saved Addresses** — Multiple shipping/billing addresses
- **Invoice Management** — Personal and corporate invoice details
- **Returns & Exchanges** — Request and track returns
- **Password Change** — Secure password update

#### 🎨 UI/UX
- **Dark Mode** — System-aware theme with manual toggle
- **Fully Responsive** — Optimized for mobile, tablet, and desktop
- **Smooth Animations** — Page transitions and micro-interactions via Motion (Framer Motion)
- **Toast Notifications** — Success, error, warning, and info toasts
- **Live Chat Widget** — Floating customer support chat
- **Hero Slider** — Auto-playing banner carousel on home page
- **Mobile Store Selector** — Quick store switch on mobile devices

#### 📄 Pages
- Home, Product Detail, Checkout, Brands, FAQ, About, Contact, Comparison, My Account, Profile, 404

### 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 6.2 | Build Tool & Dev Server |
| **Tailwind CSS** | 4.1 | Utility-First Styling |
| **Motion** | 12 | Animations & Transitions |
| **Lucide React** | — | Icon Library |
| **React Icons** | — | Additional Icons |
| **Recharts** | — | Charts (Price History) |

### 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/Barand1500/react-ecommerce-prototype.git

# Navigate to the project
cd react-ecommerce-prototype

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### 🚀 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type checking |

### 📁 Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── HeroSlider.tsx     # Home page carousel
│   ├── Layout.tsx         # Header, footer, drawers, modals
│   ├── LiveChat.tsx       # Live chat widget
│   └── ProductCard.tsx    # Product card component
├── pages/                 # Page-level components
│   ├── About.tsx          # About us page
│   ├── Brands.tsx         # Brands showcase
│   ├── Checkout.tsx       # Multi-step checkout
│   ├── Comparison.tsx     # Product comparison
│   ├── Contact.tsx        # Contact page
│   ├── FAQ.tsx            # FAQ with accordion
│   ├── Home.tsx           # Home (catalog + filters)
│   ├── MyAccount.tsx      # Account dashboard
│   ├── NotFound.tsx       # 404 page
│   ├── ProductDetail.tsx  # Product detail page
│   └── Profile.tsx        # Profile settings
├── App.tsx                # Root component & state management
├── constants.ts           # Product data & store catalog
├── types.ts               # TypeScript interfaces
└── index.css              # Global styles & Tailwind imports
```

---

## 🇹🇷 Türkçe

### ✨ Özellikler

#### 🛍️ Alışveriş Deneyimi
- **Ürün Kataloğu** — Grid/liste görünüm, gelişmiş filtreleme (kategori, marka, fiyat aralığı, renk, puan)
- **Ürün Detay** — Görsel galeri, varyant seçimi (renk/depolama), teknik özellikler tablosu
- **Hızlı Önizleme** — Sayfa değiştirmeden modal ile ürün inceleme
- **Ürün Karşılaştırma** — 4 ürüne kadar yan yana karşılaştırma
- **Fiyat Geçmişi Grafiği** — Zaman içinde fiyat değişim takibi
- **Fiyat Alarmı** — Hedef fiyat belirle, bildirim al
- **Taksit Hesaplayıcı** — Bankaya özel taksit planları ve aylık ödeme detayları

#### 🛒 Sepet & Ödeme
- **Kalıcı Sepet** — LocalStorage'a kaydedilir, sayfa yenilemede kaybolmaz
- **Çok Adımlı Ödeme** — Adres → Ödeme → Onay akışı
- **Kayıtlı Sepetler** — Mevcut sepeti kaydet, istediğin zaman geri yükle
- **Sipariş Özeti** — Vergi ve kargo dahil detaylı döküm

#### ❤️ Favoriler & Paylaşım
- **Favori Listesi** — Toast bildirimleri ile ürün ekle/çıkar
- **Favorileri Paylaş** — Web Share API + panoya kopyalama
- **Tümünü Sepete Ekle** — Tek tıkla tüm favorileri sepete taşı

#### 👤 Kullanıcı Hesabı
- **Giriş/Kayıt Modalı** — Animasyonlu sekme geçişli auth
- **Profil Yönetimi** — Kişisel bilgi, avatar, adres düzenleme
- **Sipariş Geçmişi** — Durum takipli geçmiş siparişler
- **Hesap Hareketleri** — Bakiye ve işlem geçmişi
- **Kayıtlı Adresler** — Birden fazla teslimat/fatura adresi
- **Fatura Yönetimi** — Bireysel ve kurumsal fatura bilgileri
- **İade & Değişim** — İade talebi oluştur ve takip et
- **Şifre Değiştirme** — Güvenli şifre güncelleme

#### 🎨 UI/UX
- **Karanlık Mod** — Sistem ayarına duyarlı, manuel geçiş destekli
- **Tam Responsive** — Mobil, tablet ve masaüstüne özel optimizasyon
- **Akıcı Animasyonlar** — Motion (Framer Motion) ile sayfa geçişleri ve mikro-etkileşimler
- **Toast Bildirimleri** — Başarı, hata, uyarı ve bilgi toastları
- **Canlı Destek Widget'ı** — Yüzen müşteri destek sohbeti
- **Hero Slider** — Otomatik kayan banner carousel
- **Mobil Mağaza Seçici** — Mobilde hızlı mağaza değiştirme

#### 📄 Sayfalar
- Ana Sayfa, Ürün Detay, Ödeme, Markalar, SSS, Hakkımızda, İletişim, Karşılaştırma, Hesabım, Profil, 404

### 📦 Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/Barand1500/react-ecommerce-prototype.git

# Proje klasörüne gidin
cd react-ecommerce-prototype

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 🚀 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlatır (port 3000) |
| `npm run build` | Projeyi production için derler |
| `npm run preview` | Production build'i önizler |
| `npm run lint` | TypeScript tip kontrolü yapar |

---

<div align="center">

## 📸 Screenshots

> Click to expand each section / Her bölümü tıklayarak açabilirsiniz

<details>
<summary><strong>🏠 Home Page / Ana Sayfa</strong></summary>
<br>

| Hero Slider | Filter Bar |
|:-----------:|:----------:|
| <img src="screenshots/01-hero-slider.png" width="400"> | <img src="screenshots/02-filtre-cubugu.png" width="400"> |

| Filter Sidebar | Product Grid |
|:--------------:|:------------:|
| <img src="screenshots/03-filtre-sidebar.png" width="400"> | <img src="screenshots/04-urun-grid.png" width="400"> |

</details>

<details>
<summary><strong>🛍️ Product Detail / Ürün Detay</strong></summary>
<br>

| Product Overview | Quick View |
|:----------------:|:----------:|
| <img src="screenshots/05-urun-detay-ust.png" width="400"> | <img src="screenshots/05-urun-h%C4%B1zl%C4%B1-detay.png" width="400"> |

| Variants | Trust Badges |
|:--------:|:------------:|
| <img src="screenshots/06-varyantlar.png" width="400"> | <img src="screenshots/07-guven-rozetleri.png" width="400"> |

| Specifications | Installment Table |
|:--------------:|:-----------------:|
| <img src="screenshots/08-teknik-ozellikler.png" width="400"> | <img src="screenshots/09-taksit-tablosu.png" width="400"> |

| Price Chart | Price Alert |
|:-----------:|:-----------:|
| <img src="screenshots/10-fiyat-grafigi.png" width="400"> | <img src="screenshots/11-fiyat-alarmi.png" width="400"> |

</details>

<details>
<summary><strong>💳 Checkout / Ödeme</strong></summary>
<br>

| Step 1 — Info | Card Details |
|:-------------:|:------------:|
| <img src="screenshots/12-checkout-adim1.png" width="400"> | <img src="screenshots/13-checkout-kart.png" width="400"> |

| Installments | Order Confirmation |
|:------------:|:------------------:|
| <img src="screenshots/14-checkout-taksit.png" width="400"> | <img src="screenshots/15-checkout-onay.png" width="400"> |

| Order Summary | Order Detail |
|:-------------:|:------------:|
| <img src="screenshots/16-siparis-ozeti.png" width="400"> | <img src="screenshots/16-siparis-detay%C4%B1.png" width="400"> |

</details>

<details>
<summary><strong>👤 Profile / Profil</strong></summary>
<br>

| Profile Menu | Edit Profile |
|:------------:|:------------:|
| <img src="screenshots/17-profil-menu.png" width="400"> | <img src="screenshots/18-profil-duzenle.png" width="400"> |

| Transactions | Addresses |
|:------------:|:---------:|
| <img src="screenshots/19-hesap-hareketleri.png" width="400"> | <img src="screenshots/20-adreslerim.png" width="400"> |

| Invoices | Orders |
|:--------:|:------:|
| <img src="screenshots/21-fatura.png" width="400"> | <img src="screenshots/22-siparislerim.png" width="400"> |

| Saved Carts | Returns & Exchanges |
|:-----------:|:-------------------:|
| <img src="screenshots/23-kayitli-sepetler.png" width="400"> | <img src="screenshots/24-iade-degisim.png" width="400"> |

| Change Password |
|:---------------:|
| <img src="screenshots/25-sifre-degistir.png" width="400"> |

</details>

<details>
<summary><strong>📄 Pages / Sayfalar</strong></summary>
<br>

| Brands | FAQ |
|:------:|:---:|
| <img src="screenshots/26-markalar.png" width="400"> | <img src="screenshots/27-sss-hero.png" width="400"> |

| Contact | About |
|:-------:|:-----:|
| <img src="screenshots/28-ileti%C5%9Fim-accordion.png" width="400"> | <img src="screenshots/29-hakkimizda.png" width="400"> |

| About (cont.) | Comparison |
|:--------------:|:----------:|
| <img src="screenshots/29-hakkimizda2.png" width="400"> | <img src="screenshots/31-karsilastirma.png" width="400"> |

</details>

<details>
<summary><strong>🧩 UI Components / Bileşenler</strong></summary>
<br>

| Desktop Header | Mobile Header |
|:--------------:|:-------------:|
| <img src="screenshots/33-header-desktop.png" width="400"> | <img src="screenshots/34-header-mobil.png" width="400"> |

| Sidebar | Search |
|:-------:|:------:|
| <img src="screenshots/35-sidebar.png" width="400"> | <img src="screenshots/36-arama.png" width="400"> |

| Cart Drawer | Favorites Drawer |
|:-----------:|:----------------:|
| <img src="screenshots/37-sepet.png" width="400"> | <img src="screenshots/38-favoriler.png" width="400"> |

| Footer | Platforms |
|:------:|:---------:|
| <img src="screenshots/39-footer.png" width="400"> | <img src="screenshots/40-platformlar.png" width="400"> |

| Bank Cards | Product Card |
|:-----------:|:------------:|
| <img src="screenshots/41-banka-kartlari.png" width="400"> | <img src="screenshots/42-urun-karti.png" width="400"> |

| Live Chat | Auth Modal |
|:----------:|:----------:|
| <img src="screenshots/43-canli-destek.png" width="400"> | <img src="screenshots/44-auth-modal.png" width="400"> |

| Toast Notifications | Dark Mode |
|:-------------------:|:---------:|
| <img src="screenshots/46-toast.png" width="400"> | <img src="screenshots/47-dark-mode.png" width="400"> |

| Responsive | Bank Modal |
|:----------:|:----------:|
| <img src="screenshots/48-responsive.png" width="400"> | <img src="screenshots/50-banka-modal.png" width="400"> |

</details>

---

### 📄 License

MIT License — free for personal and commercial use.

---

<p>
  Made with ❤️ by <strong>Güzel Teknoloji</strong>
</p>

⭐ If you liked this project, don't forget to star it!  
⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

</div>
