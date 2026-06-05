# Chess 3D Mobile

**3D Multiplayer Chess** — a cross-platform mobile app built with Capacitor, Three.js, and Supabase. Play locally, against an AI, or online with friends. All the luxury, dark-mythological visuals from the web version, now in your pocket.

---

## ✨ Features

* **Stunning 3D Board** — hand-crafted Three.js scene with piece models, shadows, and dynamic camera
* **Three Game Modes**
    * 🥂 **Two Players** — pass-and-play on one device
    * ♟️ **vs AI** — three difficulty levels with iterative deepening search
    * 🌐 **Online** — public & private rooms, real-time sync, chat
* **Full Authentication** — email/password sign-up, login, password reset, plus Google OAuth
* **Cloud Saves** — backup offline games to Supabase and restore them later
* **State Resilience** — auto-save on exit, rejoin frozen online matches, 60-second grace period
* **Native Features** — status bar theming, landscape lock during gameplay, custom URL scheme
* **Mobile-first UI** — safe-area insets, viewport-fit cover, touch/pinch camera controls

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript, Three.js |
| **Mobile Shell** | Capacitor 6 (Android) |
| **Backend / Auth** | Supabase (PostgreSQL, Realtime, Auth, Storage) |
| **AI Engine** | Custom minimax with alpha-beta pruning & iterative deepening |
| **Bundler** | Vite |
| **CI / CD** | GitHub Actions (APK build) |

---

## 🚀 Quick Start

### Prerequisites

* **Node.js** v18+
* **npm** v9+
* **Android Studio** (for local APK builds)

### 1. Clone & Install

```bash
git clone https://github.com/brandon-300/chess-3d-mobile.git
cd chess-3d-mobile
npm install
```

### 2. Configure Environment

Copy the example file and add your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://akrxbxzcvnspbmvgdrci.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_OZxWzSoSNj9rOMIQvYZtbQ_NwNKOMlS
```
*(These are public-safe keys; the `.env` file is ignored by Git.)*

### 3. Run the Web Dev Server

```bash
npm run dev
```

Open `http://localhost:3000` to test the app in your browser.

### 4. Build the Web App

```bash
npm run build
```

This outputs static files to `dist/`.

---

## 📱 Building the APK

### Local Build (Android)

#### 1. Add the Android platform and sync:

```bash
npx cap add android
npx cap sync android
```

#### 2. Open in Android Studio or build from CLI:

```bash
npx cap open android
# or
cd android && ./gradlew assembleDebug
```

Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### GitHub Actions (CI)

The workflow `.github/workflows/build-apk.yml` automatically builds a debug APK on every push to `master`.

**Required Secrets** (set in Settings -> Secrets and variables -> Actions):

| Secret Name | Description |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable anon key |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | (optional) Firebase sender ID for push notifications |

After the workflow runs, download the APK from the **Artifacts** section of the Actions tab.

---

## 📁 Project Structure

```text
chess-3d-mobile/
├── src/
│   ├── index.html            # Application source
│   ├── user_login.html       # Main game page
│   ├── profile.html          # Login / Signup / OAuth
│   ├── forgot_password.html  # User profile editor
│   ├── reset_password.html   # Password reset request
│   ├── main.js               # New password entry
│   ├── game_engine.js        # Orchestrator & game lifecycle
│   ├── database.js           # Chess rules, AI, Three.js render
│   ├── ui_handler.js         # Supabase client & queries
│   ├── config.ts             # DOM manipulation & events
│   └── capacitor-bridge.ts   # Environment variable access
├── capacitor.config.ts       # Minimal Capacitor native bridge
├── vite.config.ts            # Vite multi-page config
├── tsconfig.json             # TypeScript compiler options
├── package.json              # Dependencies & scripts
├── .env.example              # Template for environment variables
├── .gitignore
└── .github/
    └── workflows/
        └── build-apk.yml     # CI pipeline for Android APK
```

---

## 🎨 Design

The app preserves the dark-mythological aesthetic of the original web version:

* **Colours:** deep black (`#0a0806`), sharp gold (`#c9a84c`), muted bronze (`#7a6230`)
* **Fonts:** *Cinzel* for headings, *Cormorant Garamond* for body text
* **UI:** glass-morphism panels, glowing gold accents, custom 3D chess pieces

---

## 📚 Documentation (legacy)

The following documents are from the original project setup and may no longer be accurate:

* `BUILD_INSTRUCTIONS.md`
* `INSTALLATION_GUIDE.md`
* `CAPACITOR_CONVERSION_GUIDE.md`
* `DEPLOYMENT_SUMMARY.md`

For current instructions, refer to this README and the inline comments in the source code.

---

## 🤝 Contributing

Pull requests and issues are welcome. This project is open-source and maintained by [brandon-300](https://github.com/brandon-300).

---

## ⚠️ Security Note

Never commit real secrets to the repository. The `.env.example` file contains **placeholder values only**.
Real credentials belong in:

* Your local `.env` file (ignored by Git)
* GitHub Actions repository secrets

---

Enjoy the game! ♟️
