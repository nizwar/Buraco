# 🃏 BURACO - Permainan Kartu Brasil/Italia

Game kartu Buraco digital yang autentik dengan aturan lengkap sesuai permainan aslinya.

![Buraco Game](https://img.shields.io/badge/Game-Buraco-green)
![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🎮 Fitur Game

### ✨ Aturan Autentik Buraco
- **2 Deck Kartu**: 104 kartu standar + 4 joker
- **Pot Terpisah**: Setiap pemain punya pot sendiri (11 kartu)
- **Minimum Meld**: Kombinasi pertama harus 50+ poin
- **Multi-Round**: Game berlanjut sampai 2000 poin
- **Buraco Wajib**: Harus punya 1 Buraco (7+ kartu) untuk menang ronde

### 🎯 Mekanik Permainan
- Ambil kartu dari deck atau ambil **SELURUH** tumpukan buang
- Buat kombinasi: Set (3+ kartu sama) atau Sequence (3+ berurutan)
- Tambahkan kartu ke kombinasi yang sudah ada
- Wild cards: Joker (50 poin) dan angka 2 (20 poin)
- Clean Buraco (7+ tanpa wild): **+200 poin bonus**
- Dirty Run (7+ dengan wild): **+100 poin bonus**

### 🎨 Desain
- Tampilan meja hijau kasino yang realistis
- Kartu dengan efek 3D dan shadow
- Tema emas dan mewah
- Responsif untuk berbagai ukuran layar
- Animasi smooth dan interaktif
- Animasi pembagian kartu yang realistis

### 🤖 AI Pintar
- **Strategi Discard Pile**: AI mengevaluasi apakah worth it mengambil tumpukan buang
- **Evaluasi Kartu**: AI menilai kualitas kartu untuk keputusan yang lebih baik
- **Prioritas Kombinasi**: AI mencari kombinasi terpanjang dan terbaik
- **Menambah ke Kombinasi**: AI aktif menambahkan kartu ke kombinasi existing
- **Discard Cerdas**: AI membuang kartu paling tidak berguna
- **Adaptif**: AI menyesuaikan strategi berdasarkan situasi game

### 🧠 AI Learning System (NEW!)
- **📊 Tracking Otomatis**: Game melacak style bermain Anda secara real-time
- **🎯 Adaptive AI**: AI belajar dari kebiasaan Anda dan menyesuaikan strategi
- **📈 Profile Player**: Sistem menganalisis aggressiveness, risk tolerance, dan preferences
- **🤖 Counter-Strategy**: AI mengembangkan strategi counter berdasarkan style Anda
  - Vs Aggressive Player → AI main **DEFENSIVE**
  - Vs Conservative Player → AI main **AGGRESSIVE**
  - Vs Risky Player → AI **EXPLOIT** kelemahan
  - Vs Cautious Player → AI main **OPPORTUNISTIC**
- **💾 Data Storage**: Data learning disimpan di **localStorage browser** (otomatis)
- **📥 Export/Import**: Download data sebagai `gameStyle.json` untuk backup
- **🔒 Privacy**: Semua data disimpan lokal di browser, tidak ada tracking online

#### 📁 Data Structure
Data pembelajaran AI memiliki struktur JSON seperti ini (lihat `gameStyle.template.json` untuk referensi lengkap):
```json
{
  "playerProfile": {
    "gamesPlayed": 0,
    "totalMoves": 0,
    "style": {
      "aggressiveness": 50,    // 0-100: Seberapa agresif Anda bermain
      "riskTolerance": 50,      // 0-100: Seberapa berani ambil risiko
      "meldSpeed": 50,          // 0-100: Seberapa cepat buat kombinasi
      "wildCardUsage": 50       // 0-100: Seberapa sering gunakan wild cards
    },
    "preferences": {
      "prefersSequences": 0,    // Jumlah sequences dibuat
      "prefersSets": 0,         // Jumlah sets dibuat
      "usesWildCardsEarly": 0,  // Frekuensi pakai wild cards early
      "holdsForBigMelds": 0     // Frekuensi hold untuk melds besar
    }
  },
  "aiAdaptation": {
    "currentStrategy": "balanced",  // AI strategy: balanced/defensive/aggressive/patient/opportunistic
    "adaptationLevel": 0,           // 0-100: Seberapa adapt AI
    "confidenceLevel": 0            // 0-100: Confidence AI terhadap analisis
  },
  "statistics": {
    "wins": 0,
    "losses": 0,
    "avgScore": 0,
    "totalBuracosCreated": 0
  }
}
```

#### 🎮 Cara Kerja AI Learning
1. **Tracking**: Setiap move Anda dianalisis (draw choice, meld creation, discard pattern)
2. **Analysis**: AI menghitung metrics style bermain Anda
3. **Adaptation**: AI adjust strategi berdasarkan pattern yang terdeteksi
4. **Counter-Play**: AI develop strategi optimal melawan style Anda

#### 💾 Mengelola Data Learning
- **Auto-Save**: Setiap aksi otomatis disimpan ke localStorage browser
- **Lihat Statistik**: Klik button "📊 Lihat Statistik AI" untuk melihat profil & analytics
- **Download Backup**: Klik "💾 Download gameStyle.json" untuk export & backup data
- **Reset Data**: Klik "🔄 Reset Data AI" untuk mulai pembelajaran dari awal
- **Import Data**: Copy data JSON yang sudah ada dan replace di localStorage (via browser console)

#### 🔧 Tips Optimasi
- **Minimal 50 moves** untuk AI mulai adapt dengan baik
- **100+ moves** untuk AI confidence level tinggi
- Setelah download gameStyle.json baru, refresh browser untuk load data terbaru

## 🚀 Cara Menjalankan

### Method 1: Langsung di Browser
```bash
# Clone repository
git clone https://github.com/masalfi/Buraco.git

# Buka file
cd Buraco
open index.html
```

### Method 2: Local Server
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx http-server

# Buka browser: http://localhost:8000
```

## 📖 Cara Bermain

### 1️⃣ Setup Awal
- Setiap pemain mendapat 11 kartu
- Setiap pemain punya pot tersendiri (11 kartu tersembunyi)
- 1 kartu diletakkan sebagai discard pile pertama

### 2️⃣ Giliran Pemain
1. **Ambil Kartu**: Dari deck ATAU ambil seluruh tumpukan buang
2. **Buat Kombinasi** (opsional):
   - Kombinasi pertama harus minimal 50 poin
   - Sequence: 3+ kartu berurutan dengan suit sama
   - Set: 3+ kartu dengan nilai sama
3. **Buang 1 Kartu** ke tumpukan buang

### 3️⃣ Nilai Kartu
- **Joker**: 50 poin (wild card)
- **2 (Dua)**: 20 poin (wild card)
- **A (As)**: 15 poin
- **K, Q, J, 10, 9, 8**: 10 poin
- **7, 6, 5, 4, 3**: 5 poin

### 4️⃣ Buraco & Bonus
- **Buraco (Clean)**: 7+ kartu tanpa wild = +200 poin
- **Dirty Run**: 7+ kartu dengan wild = +100 poin
- Anda HARUS punya minimal 1 Buraco untuk menghabiskan kartu!

### 5️⃣ Pot
- Saat kartu Anda habis, pot otomatis terbuka
- Pot menjadi kartu tangan baru Anda
- Lanjutkan bermain sampai pot juga habis

### 6️⃣ Akhir Ronde
- Ronde berakhir saat ada pemain yang menghabiskan semua kartu (termasuk pot)
- Pemain tersebut HARUS punya minimal 1 Buraco
- Kartu tersisa di tangan = penalti (dikurangi dari skor)

### 7️⃣ Menang Game
- Game berlanjut beberapa ronde sampai ada yang mencapai **2000 poin**
- Pemain dengan skor tertinggi adalah pemenangnya!

## 🎯 Kontrol Game

### Keyboard & Mouse
- **Klik Kartu**: Pilih/batalkan pilihan kartu
- **Double-klik Kartu**: Buang kartu (saat sudah ambil kartu)
- **Klik Kombinasi**: Lihat detail kombinasi

### Tombol
- 🎮 **Mulai Game**: Mulai game baru
- 📥 **Ambil Kartu**: Ambil dari deck
- 📋 **Buat Kombinasi Baru**: Buat kombinasi dari kartu terpilih
- ➕ **Tambah ke Kombinasi**: Tambah kartu ke kombinasi existing
- 🗑️ **Buang Kartu**: Buang 1 kartu terpilih
- 🎁 **Ambil Pot**: Ambil pot saat kartu habis
- 📖 **Lihat Tutorial**: Buka panduan lengkap

## 💡 Tips & Strategi

### Untuk Pemula
1. **Prioritas**: Fokus buat 1 Buraco dulu sebelum menghabiskan kartu
2. **Meld Pertama**: Kumpulkan kartu sampai bisa buat kombinasi 50+ poin
3. **Jangan Buru-buru**: Pot bisa jadi penyelamat atau masalah - gunakan dengan bijak

### Advanced Strategy
1. **Discard Pile**: Ambil hanya jika bisa langsung membuat kombinasi kuat
2. **Wild Cards**: Simpan untuk melengkapi Buraco
3. **Card Counting**: Perhatikan kartu yang dibuang lawan
4. **Timing**: Kapan waktu tepat untuk "go out" dan mengakhiri ronde

## 🛠️ Teknologi

- **HTML5**: Struktur game
- **CSS3**: Styling dengan efek kasino
- **Vanilla JavaScript**: Logika game (no framework)
- **Git**: Version control

## 📂 Struktur File

```
Buraco/
├── index.html      # Halaman utama game
├── style.css       # Styling dengan tema meja hijau
├── script.js       # Logika game Buraco
└── README.md       # Dokumentasi (file ini)
```

## 🐛 Known Issues & Future Improvements

### To-Do List
- [x] AI yang lebih pintar untuk komputer ✅
- [x] Mode 4 pemain (2v2) ✅
- [x] Animasi pembagian kartu ✅
- [ ] Multiplayer online
- [ ] Sound effects
- [ ] Save game progress
- [ ] Leaderboard
- [ ] Mobile app version
- [ ] Tutorial interaktif

## 📜 Aturan Lengkap Buraco

### Peraturan Resmi
Game ini mengikuti aturan Buraco standar:
- Minimum opening meld: 50 poin
- Buraco requirement untuk finish
- Pot system dengan 11 kartu per pemain
- Multi-round game sampai 2000 poin
- Wild cards: Joker dan 2
- Penalty untuk kartu tersisa

### Perbedaan dengan Canasta
Meskipun mirip dengan Canasta, Buraco memiliki:
- Pot system yang unik
- Requirement untuk punya Buraco sebelum finish
- Nilai poin yang berbeda
- Aturan ambil discard pile yang berbeda

---

## 🧠 AI Learning System - Dokumentasi

### 📊 Bagaimana AI Belajar dari Anda?

Game ini memiliki sistem pembelajaran AI yang canggih yang **melacak dan menganalisis style bermain Anda** secara otomatis.

#### Data yang Dilacak:

##### 1. **Player Profile** 
- **Aggressiveness** (0-100): Seberapa agresif Anda bermain
  - Dihitung dari: Kecepatan membuat meld, preference sequences vs sets
- **Risk Tolerance** (0-100): Seberapa sering ambil risiko
  - Dihitung dari: Seberapa sering ambil discard pile vs deck
- **Meld Speed** (0-100): Seberapa cepat Anda membuat kombinasi
- **Wild Card Usage** (0-100): Seberapa sering gunakan wild cards

##### 2. **Preferences**
- Prefer Sequences atau Sets?
- Menggunakan wild cards di awal atau akhir?
- Suka menahan kartu untuk meld besar?

##### 3. **Patterns**
- Berapa kali ambil dari discard pile vs deck
- Rata-rata ukuran meld yang dibuat
- Rata-rata turns sebelum meld pertama
- Pattern kartu yang di-discard (high/low/middle cards)

##### 4. **Statistics**
- Total games, wins, losses
- Average score, highest score
- Total Buracas created (clean & dirty)

### 🤖 Strategi Adaptasi AI

AI akan mengubah strateginya berdasarkan data yang dikumpulkan:

#### Against Aggressive Player (Aggressiveness > 65)
```
🛡️ AI Strategy: DEFENSIVE
- More conservative dengan discard pile
- Hold cards lebih lama
- Focus pada defense daripada offense
- Wait for player mistakes
```

#### Against Conservative Player (Aggressiveness < 35)
```
⚡ AI Strategy: AGGRESSIVE
- Lebih berani ambil discard pile
- Create melds lebih cepat
- Put pressure pada player
- Take calculated risks
```

#### Against Risky Player (Risk Tolerance > 65)
```
🎯 AI Strategy: EXPLOIT
- AI akan exploit kebiasaan risky player
- Counter dengan strategi yang lebih calculated
- Biarkan player membuat mistakes
```

#### Against Cautious Player (Risk Tolerance < 35)
```
🚀 AI Strategy: OPPORTUNISTIC
- AI akan lebih agresif
- Take opportunities yang player lewatkan
- Faster game pace
```

### 💾 Data Storage

#### File: `gameStyle.json`
Data player style disimpan dalam format JSON dengan struktur:

```json
{
  "version": "1.0",
  "lastUpdated": "2025-10-23",
  "playerProfile": {
    "gamesPlayed": 0,
    "totalMoves": 0,
    "style": {
      "aggressiveness": 50,
      "riskTolerance": 50,
      "meldSpeed": 50,
      "wildCardUsage": 50
    },
    "preferences": {
      "prefersSequences": 0,
      "prefersSets": 0,
      "usesWildCardsEarly": 0,
      "holdsForBigMelds": 0
    },
    "patterns": {
      "drawFromDiscard": 0,
      "drawFromDeck": 0,
      "avgMeldSize": 0,
      "avgTurnsBeforeFirstMeld": 0
    },
    "discardPatterns": {
      "highCards": 0,
      "lowCards": 0,
      "middleCards": 0,
      "duplicates": 0,
      "isolatedCards": 0
    }
  },
  "aiAdaptation": {
    "currentStrategy": "balanced",
    "adaptationLevel": 0,
    "counterStrategies": {
      "againstAggressive": false,
      "againstConservative": false,
      "againstRisky": false,
      "againstCautious": false
    },
    "learningProgress": {
      "movesAnalyzed": 0,
      "patternsDetected": 0,
      "confidenceLevel": 0
    }
  },
  "statistics": {
    "wins": 0,
    "losses": 0,
    "avgScore": 0,
    "highestScore": 0,
    "totalBuracosCreated": 0
  }
}
```

#### localStorage
Data juga otomatis disimpan di browser localStorage dengan key `buracoPlayerStyle`.

### 🔧 Developer Functions

Tersedia beberapa functions untuk manage data:

```javascript
// Download style data as JSON file
downloadPlayerStyle();

// Reset all learning data
resetPlayerStyle();

// Manually trigger AI strategy update
updateAIStrategy();

// Get current AI adapted threshold
getAIAdaptedThreshold(baseThreshold);
```

### 📈 Confidence Level

AI perlu **minimal 20 moves** untuk mulai adapt strategi dengan confidence.

- **0-20 moves**: AI main balanced (default)
- **20-100 moves**: AI mulai adapt (confidence 20-100%)
- **100+ moves**: AI fully adapted dengan high confidence

### 🔒 Privacy & Security

- ✅ **100% Local**: Semua data disimpan di browser Anda
- ✅ **No Server**: Tidak ada data yang dikirim ke server
- ✅ **No Tracking**: Tidak ada analytics atau tracking external
- ✅ **Full Control**: Anda bisa reset atau download data kapan saja
- ✅ **Open Source**: Kode bisa di-review di GitHub

### 🎯 Cara Menggunakan

1. **Automatic Tracking**: Sistem otomatis melacak setiap move Anda
2. **Play Normally**: Main seperti biasa, AI akan belajar
3. **Watch AI Adapt**: Perhatikan console untuk melihat strategy changes
4. **Review Stats**: Lihat statistics Anda di localStorage
5. **Export Data**: Download JSON file untuk backup/analysis

### 🔬 Advanced: Console Monitoring

Buka browser console (F12) untuk melihat:
- ✅ Load confirmations
- 💾 Save notifications  
- 🤖 AI strategy changes
- 📊 Pattern detections

Example logs:
```
✅ Loaded player style data: {...}
💾 Saved player style data
🤖 AI Strategy: DEFENSIVE (counter aggressive + risky player)
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - feel free to use for personal or educational purposes.

## 👨‍💻 Author

**Alfi Firdaus**
- GitHub: [@masalfi](https://github.com/masalfi)

## 🙏 Acknowledgments

- Aturan Buraco berdasarkan permainan tradisional Brasil/Italia
- Desain terinspirasi dari meja kasino nyata
- Community feedback untuk improvement

---

**Selamat Bermain! Semoga beruntung membuat banyak Buraco! 🎉🃏**
