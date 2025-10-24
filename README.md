# BURACO - Brazilian/Italian Card Game

Authentic digital Buraco card game with complete rules following the original game.

![Buraco Game](https://img.shields.io/badge/Game-Buraco-green)
![Version](https://img.shields.io/badge/version-2.0-blue)
![PWA](https://img.shields.io/badge/PWA-enabled-orange)
![License](https://img.shields.io/badge/license-MIT-yellow)

## Game Features

### PWA (Progressive Web App) Support
- **Install on Device**: Install as native app on mobile/desktop
- **Offline Play**: Full game functionality works offline
- **Auto-Updates**: Automatic updates when new versions are available
- **Background Sync**: Save game data even when offline
- **Native Feel**: Runs like a native app when installed

### Authentic Buraco Rules
- **2 Card Decks**: 104 standard cards + 4 jokers
- **Separate Pot**: Each player has their own pot (11 cards)
- **Minimum Meld**: First combination must be 50+ points
- **Multi-Round**: Game continues until 2000 points
- **Buraco Required**: Must have 1 Buraco (7+ cards) to win round

### Game Mechanics
- Draw card from deck or take **ENTIRE** discard pile
- Create combinations: Set (3+ same cards) or Sequence (3+ consecutive)
- Add cards to existing combinations
- Wild cards: Joker (50 points) and number 2 (20 points)
- Clean Buraco (7+ without wild): **+200 bonus points**
- Dirty Run (7+ with wild): **+100 bonus points**

### Design
- Realistic casino green table display
- Cards with 3D effects and shadows
- Gold and luxury theme
- Responsive for various screen sizes
- Smooth and interactive animations
- Realistic card dealing animations

### Smart AI
- **Discard Pile Strategy**: AI evaluates whether it's worth taking discard pile
- **Card Evaluation**: AI assesses card quality for better decisions
- **Combination Priority**: AI seeks longest and best combinations
- **Add to Combinations**: AI actively adds cards to existing combinations
- **Smart Discard**: AI discards least useful cards
- **Adaptive**: AI adjusts strategy based on game situation

### AI Learning System (NEW!)
- **Automatic Tracking**: Game tracks your playing style in real-time
- **Adaptive AI**: AI learns from your habits and adjusts strategy
- **Player Profile**: System analyzes aggressiveness, risk tolerance, and preferences
- **Counter-Strategy**: AI develops counter strategies based on your style
  - Vs Aggressive Player → AI plays **DEFENSIVE**
  - Vs Conservative Player → AI plays **AGGRESSIVE**
  - Vs Risky Player → AI **EXPLOITS** weaknesses
  - Vs Cautious Player → AI plays **OPPORTUNISTIC**
- **Data Storage**: Learning data stored in **browser localStorage** (automatic)
- **Export/Import**: Download data as `gameStyle.json` for backup
- **Privacy**: All data stored locally in browser, no online tracking

#### Data Structure
AI learning data has JSON structure like this (see `gameStyle.template.json` for complete reference):
```json
{
  "playerProfile": {
    "gamesPlayed": 0,
    "totalMoves": 0,
    "style": {
      "aggressiveness": 50,    // 0-100: How aggressive you play
      "riskTolerance": 50,      // 0-100: How willing to take risks
      "meldSpeed": 50,          // 0-100: How fast you create combinations
      "wildCardUsage": 50       // 0-100: How often you use wild cards
    },
    "preferences": {
      "prefersSequences": 0,    // Number of sequences created
      "prefersSets": 0,         // Number of sets created
      "usesWildCardsEarly": 0,  // Frequency of early wild card usage
      "holdsForBigMelds": 0     // Frequency of holding for big melds
    }
  },
  "aiAdaptation": {
    "currentStrategy": "balanced",  // AI strategy: balanced/defensive/aggressive/patient/opportunistic
    "adaptationLevel": 0,           // 0-100: How adapted AI is
    "confidenceLevel": 0            // 0-100: AI confidence in analysis
  },
  "statistics": {
    "wins": 0,
    "losses": 0,
    "avgScore": 0,
    "totalBuracosCreated": 0
  }
}
```

#### How AI Learning Works
1. **Tracking**: Every move you make is analyzed (draw choice, meld creation, discard pattern)
2. **Analysis**: AI calculates metrics of your playing style
3. **Adaptation**: AI adjusts strategy based on detected patterns
4. **Counter-Play**: AI develops optimal strategy against your style

#### Managing Learning Data
- **Auto-Save**: Every action automatically saved to browser localStorage
- **View Statistics**: Click "View AI Statistics" button to see profile & analytics
- **Download Backup**: Click "Download gameStyle.json" to export & backup data
- **Reset Data**: Click "Reset AI Data" to start learning from scratch
- **Import Data**: Copy existing JSON data and replace in localStorage (via browser console)

#### Optimization Tips
- **Minimum 50 moves** for AI to start adapting well
- **100+ moves** for high AI confidence level
- After downloading new gameStyle.json, refresh browser to load latest data

## How to Run

### Method 1: PWA Installation (Recommended)
```bash
# Serve the files via HTTPS (required for PWA)
# Using Python:
python -m http.server 8000

# Or using Node.js:
npx http-server

# Open browser: https://localhost:8000
# Click "Install App" button when it appears
```

**Installation Steps:**
1. Open the game in a modern browser (Chrome, Firefox, Safari, Edge)
2. Look for the "Install App" button in the top-right corner
3. Click it and confirm installation
4. The game will be installed as a native app on your device
5. You can now play offline and get automatic updates!

### Method 2: Direct in Browser
```bash
# Clone repository
git clone https://github.com/masalfi/Buraco.git

# Open file
cd Buraco
open index.html
```

### Method 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server

# Open browser: http://localhost:8000
```

## How to Play

### Initial Setup
- Each player gets 11 cards
- Each player has their own pot (11 hidden cards)
- 1 card is placed as first discard pile

### Player Turn
1. **Draw Card**: From deck OR take entire discard pile
2. **Create Combinations** (optional):
   - First combination must be minimum 50 points
   - Sequence: 3+ consecutive cards of same suit
   - Set: 3+ cards of same value
3. **Discard 1 Card** to discard pile

### Card Values
- **Joker**: 50 points (wild card)
- **2 (Two)**: 20 points (wild card)
- **A (Ace)**: 15 points
- **K, Q, J, 10, 9, 8**: 10 points
- **7, 6, 5, 4, 3**: 5 points

### Buraco & Bonus
- **Buraco (Clean)**: 7+ cards without wild = +200 points
- **Dirty Run**: 7+ cards with wild = +100 points
- You MUST have at least 1 Buraco to exhaust cards!

### Pot
- When your cards run out, pot automatically opens
- Pot becomes your new hand
- Continue playing until pot is also exhausted

### Round End
- Round ends when a player exhausts all cards (including pot)
- That player MUST have at least 1 Buraco
- Remaining cards in hand = penalty (deducted from score)

### Winning Game
- Game continues several rounds until someone reaches **2000 points**
- Player with highest score is the winner!

## Game Controls

### Keyboard & Mouse
- **Click Card**: Select/deselect card
- **Double-click Card**: Discard card (when already drawn)
- **Click Combination**: View combination details

### Buttons
- **Start Game**: Start new game
- **Draw Card**: Draw from deck
- **Create New Combination**: Create combination from selected cards
- **Add to Combination**: Add card to existing combination
- **Discard Card**: Discard 1 selected card
- **Take Pot**: Take pot when cards run out
- **View Tutorial**: Open complete guide

## Tips & Strategy

### For Beginners
1. **Priority**: Focus on creating 1 Buraco first before exhausting cards
2. **First Meld**: Collect cards until you can create 50+ point combinations
3. **Don't Rush**: Pot can be a lifesaver or problem - use wisely

### Advanced Strategy
1. **Discard Pile**: Take only if you can immediately create strong combinations
2. **Wild Cards**: Save for completing Buraco
3. **Card Counting**: Pay attention to cards discarded by opponents
4. **Timing**: When is the right time to "go out" and end the round

## Technology

- **HTML5**: Game structure
- **CSS3**: Styling with casino effects
- **Vanilla JavaScript**: Game logic (no framework)
- **PWA**: Progressive Web App support
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Native app-like installation
- **Git**: Version control

## PWA Setup & Icons

### Icon Generation
To fully enable PWA features, you need to generate app icons:

1. **Quick Method**: Open `generate-basic-icons.html` in browser and download icons
2. **Advanced Method**: Open `icon-generator.html` for better quality icons  
3. **Manual Method**: Create PNG files in `icons/` folder with these sizes:
   - icon-192x192.png (required)
   - icon-512x512.png (required)

### PWA Features
- **Offline Mode**: Game works completely offline after first load
- **Install Prompt**: Automatic install button appears on supported browsers
- **Background Sync**: Game data saved even when offline
- **Auto Updates**: Notifications when new versions are available
- **Native Integration**: Appears in app drawer/dock when installed

### Browser Support
- ✅ Chrome/Chromium (full support)
- ✅ Firefox (full support) 
- ✅ Safari (partial support)
- ✅ Edge (full support)
- ⚠️ Older browsers (graceful degradation)

## File Structure

```
Buraco/
├── index.html                 # Main game page
├── style.css                  # Styling with green table theme
├── script.js                  # Buraco game logic
├── manifest.json              # PWA manifest file
├── sw.js                      # Service worker for offline support
├── icon-generator.html        # Advanced icon generator
├── generate-basic-icons.html  # Quick icon generator
├── generate-icons.sh          # Icon generation script (requires ImageMagick)
├── icons/                     # PWA icons directory
│   ├── README.md              # Icon setup instructions
│   └── icon-*.png             # App icons (generated)
└── README.md                  # Documentation (this file)
```

## Known Issues & Future Improvements

### To-Do List
- [x] Smarter AI for computer ✅
- [x] 4 player mode (2v2) ✅
- [x] Card dealing animations ✅
- [ ] Multiplayer online
- [ ] Sound effects
- [ ] Save game progress
- [ ] Leaderboard
- [ ] Mobile app version
- [ ] Interactive tutorial

## Complete Buraco Rules

### Official Rules
This game follows standard Buraco rules:
- Minimum opening meld: 50 points
- Buraco requirement to finish
- Pot system with 11 cards per player
- Multi-round game until 2000 points
- Wild cards: Joker and 2
- Penalty for remaining cards

### Differences from Canasta
Although similar to Canasta, Buraco has:
- Unique pot system
- Requirement to have Buraco before finish
- Different point values
- Different discard pile taking rules

---

## AI Learning System - Documentation

### How does AI Learn from You?

This game has a sophisticated AI learning system that **tracks and analyzes your playing style** automatically.

#### Data Tracked:

##### 1. **Player Profile** 
- **Aggressiveness** (0-100): How aggressive you play
  - Calculated from: Speed of creating melds, preference sequences vs sets
- **Risk Tolerance** (0-100): How often you take risks
  - Calculated from: How often you take discard pile vs deck
- **Meld Speed** (0-100): How fast you create combinations
- **Wild Card Usage** (0-100): How often you use wild cards

##### 2. **Preferences**
- Prefer Sequences or Sets?
- Use wild cards early or late?
- Like to hold cards for big melds?

##### 3. **Patterns**
- How many times take from discard pile vs deck
- Average meld size created
- Average turns before first meld
- Discard card patterns (high/low/middle cards)

##### 4. **Statistics**
- Total games, wins, losses
- Average score, highest score
- Total Buracos created (clean & dirty)

### AI Adaptation Strategy

AI will change its strategy based on collected data:

#### Against Aggressive Player (Aggressiveness > 65)
```
AI Strategy: DEFENSIVE
- More conservative with discard pile
- Hold cards longer
- Focus on defense rather than offense
- Wait for player mistakes
```

#### Against Conservative Player (Aggressiveness < 35)
```
AI Strategy: AGGRESSIVE
- More willing to take discard pile
- Create melds faster
- Put pressure on player
- Take calculated risks
```

#### Against Risky Player (Risk Tolerance > 65)
```
AI Strategy: EXPLOIT
- AI will exploit risky player habits
- Counter with more calculated strategy
- Let player make mistakes
```

#### Against Cautious Player (Risk Tolerance < 35)
```
AI Strategy: OPPORTUNISTIC
- AI will be more aggressive
- Take opportunities player misses
- Faster game pace
```

### Data Storage

#### File: `gameStyle.json`
Player style data stored in JSON format with structure:

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
Data is also automatically saved in browser localStorage with key `buracoPlayerStyle`.

### Developer Functions

Several functions available to manage data:

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

### Confidence Level

AI needs **minimum 20 moves** to start adapting strategy with confidence.

- **0-20 moves**: AI plays balanced (default)
- **20-100 moves**: AI starts adapting (confidence 20-100%)
- **100+ moves**: AI fully adapted with high confidence

### Privacy & Security

- **100% Local**: All data stored in your browser
- **No Server**: No data sent to server
- **No Tracking**: No external analytics or tracking
- **Full Control**: You can reset or download data anytime
- **Open Source**: Code can be reviewed on GitHub

### How to Use

1. **Automatic Tracking**: System automatically tracks every move you make
2. **Play Normally**: Play as usual, AI will learn
3. **Watch AI Adapt**: Check console to see strategy changes
4. **Review Stats**: View your statistics in localStorage
5. **Export Data**: Download JSON file for backup/analysis

### Advanced: Console Monitoring

Open browser console (F12) to see:
- Load confirmations
- Save notifications  
- AI strategy changes
- Pattern detections

Example logs:
```
Loaded player style data: {...}
Saved player style data
AI Strategy: DEFENSIVE (counter aggressive + risky player)
```

---

## Contributing

Contributions are welcome! Please:
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or educational purposes.

## Author

**Alfi Firdaus**
- GitHub: [@masalfi](https://github.com/masalfi)

## Acknowledgments

- Buraco rules based on traditional Brazilian/Italian game
- Design inspired by real casino tables
- Community feedback for improvement

---

**Have fun playing! Good luck creating many Buracos!**
