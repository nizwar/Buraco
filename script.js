// Game State
let gameState = {
    playerHand: [],
    computerHand: [],
    playerMelds: [],
    computerMelds: [],
    deck: [],
    discardPile: [],
    pot: [],
    playerScore: 0,
    computerScore: 0,
    currentTurn: 'player',
    hasDrawn: false,
    playerUsedPot: false,
    computerUsedPot: false,
    selectedCards: []
};

// Card Suits and Values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const cardPoints = {
    'A': 15, 'K': 10, 'Q': 10, 'J': 10, '10': 10,
    '9': 10, '8': 10, '7': 5, '6': 5, '5': 5, '4': 5, '3': 5, '2': 20, 'JOKER': 50
};

// Initialize Game
function initGame() {
    gameState = {
        playerHand: [],
        computerHand: [],
        playerMelds: [],
        computerMelds: [],
        deck: [],
        discardPile: [],
        pot: [],
        playerScore: 0,
        computerScore: 0,
        currentTurn: 'player',
        hasDrawn: false,
        playerUsedPot: false,
        computerUsedPot: false,
        selectedCards: []
    };
    
    createDeck();
    shuffleDeck();
    dealCards();
    updateUI();
    updateStatus('Giliran Anda! Ambil kartu dari deck atau tumpukan buang.');
    enableButtons();
}

// Create Deck (2 decks + 4 jokers)
function createDeck() {
    gameState.deck = [];
    
    // Create 2 standard decks
    for (let d = 0; d < 2; d++) {
        for (let suit of suits) {
            for (let value of values) {
                gameState.deck.push({
                    suit: suit,
                    value: value,
                    displayValue: value + suit,
                    isWild: value === '2',
                    points: cardPoints[value]
                });
            }
        }
    }
    
    // Add 4 Jokers
    for (let i = 0; i < 4; i++) {
        gameState.deck.push({
            suit: '🃏',
            value: 'JOKER',
            displayValue: '🃏',
            isWild: true,
            points: cardPoints['JOKER']
        });
    }
}

// Shuffle Deck
function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

// Deal Cards
function dealCards() {
    // Deal 11 cards to each player
    for (let i = 0; i < 11; i++) {
        gameState.playerHand.push(gameState.deck.pop());
        gameState.computerHand.push(gameState.deck.pop());
    }
    
    // Create pot (11 cards for each player)
    for (let i = 0; i < 22; i++) {
        gameState.pot.push(gameState.deck.pop());
    }
    
    // First discard
    gameState.discardPile.push(gameState.deck.pop());
}

// Draw Card
function drawCard() {
    if (!gameState.hasDrawn) {
        if (gameState.deck.length > 0) {
            const card = gameState.deck.pop();
            gameState.playerHand.push(card);
            gameState.hasDrawn = true;
            updateUI();
            updateStatus('Kartu diambil! Sekarang buat kombinasi atau buang kartu.');
            document.getElementById('drawBtn').disabled = true;
            document.getElementById('meldBtn').disabled = false;
            document.getElementById('discardBtn').disabled = false;
        } else {
            updateStatus('Deck habis! Ambil pot jika belum diambil.');
        }
    }
}

// Take from Discard Pile
function takeFromDiscard() {
    if (!gameState.hasDrawn && gameState.discardPile.length > 0) {
        const card = gameState.discardPile.pop();
        gameState.playerHand.push(card);
        gameState.hasDrawn = true;
        updateUI();
        updateStatus('Kartu dari tumpukan buang diambil! Buat kombinasi atau buang kartu.');
        document.getElementById('drawBtn').disabled = true;
        document.getElementById('meldBtn').disabled = false;
        document.getElementById('discardBtn').disabled = false;
    }
}

// Take Pot
function takePot() {
    if (!gameState.playerUsedPot && gameState.pot.length > 0 && gameState.playerHand.length === 0) {
        // Take 11 cards from pot
        for (let i = 0; i < 11 && gameState.pot.length > 0; i++) {
            gameState.playerHand.push(gameState.pot.pop());
        }
        gameState.playerUsedPot = true;
        updateUI();
        updateStatus('Pot diambil! Lanjutkan permainan.');
        document.getElementById('takePotBtn').disabled = true;
    }
}

// Select/Deselect Card
function toggleCardSelection(index) {
    const cardIndex = gameState.selectedCards.indexOf(index);
    if (cardIndex > -1) {
        gameState.selectedCards.splice(cardIndex, 1);
    } else {
        gameState.selectedCards.push(index);
    }
    updateUI();
}

// Make Meld
function makeMeld() {
    if (gameState.selectedCards.length < 3) {
        updateStatus('Pilih minimal 3 kartu untuk membuat kombinasi!');
        return;
    }
    
    // Sort indices in ascending order to get the actual cards
    const sortedIndices = [...gameState.selectedCards].sort((a, b) => a - b);
    const selectedCards = sortedIndices.map(index => gameState.playerHand[index]);
    
    if (isValidMeld(selectedCards)) {
        // Remove cards from hand in reverse order to maintain indices
        const meld = [];
        for (let i = sortedIndices.length - 1; i >= 0; i--) {
            meld.unshift(gameState.playerHand.splice(sortedIndices[i], 1)[0]);
        }
        gameState.playerMelds.push(meld);
        
        // Calculate and add points immediately
        let meldPoints = 0;
        meld.forEach(card => {
            meldPoints += card.points;
        });
        
        // Bonus for Buraco and Dirty Run
        if (meld.length >= 7) {
            const hasWild = meld.some(c => c.isWild);
            if (hasWild) {
                meldPoints += 100; // Dirty Run
            } else {
                meldPoints += 200; // Buraco (Clean Run)
            }
        }
        
        gameState.playerScore += meldPoints;
        gameState.selectedCards = [];
        updateUI();
        updateStatus('Kombinasi berhasil dibuat! ' + getMeldDescription(meld) + ` +${meldPoints} poin!`);
    } else {
        updateStatus('Kombinasi tidak valid! Harus 3+ kartu berurutan atau sama.');
    }
}

// Check if Meld is Valid
function isValidMeld(cards) {
    if (cards.length < 3) return false;
    
    // Check for Set (same value)
    const values = cards.map(c => c.value);
    const uniqueValues = [...new Set(values.filter(v => v !== '2' && v !== 'JOKER'))];
    if (uniqueValues.length === 1) return true;
    
    // Check for Sequence (same suit, consecutive values)
    const suits = cards.map(c => c.suit);
    const uniqueSuits = [...new Set(suits.filter(s => s !== '🃏'))];
    if (uniqueSuits.length === 1) {
        return isSequence(cards);
    }
    
    return false;
}

// Check if cards form a sequence
function isSequence(cards) {
    const valueOrder = ['A', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let nonWildCards = cards.filter(c => !c.isWild);
    
    if (nonWildCards.length < 2) return true; // Needs at least 2 non-wild cards
    
    // Sort by value
    nonWildCards.sort((a, b) => {
        return valueOrder.indexOf(a.value) - valueOrder.indexOf(b.value);
    });
    
    // Check if consecutive
    for (let i = 1; i < nonWildCards.length; i++) {
        const prevIndex = valueOrder.indexOf(nonWildCards[i-1].value);
        const currIndex = valueOrder.indexOf(nonWildCards[i].value);
        const diff = currIndex - prevIndex;
        
        if (diff > cards.filter(c => c.isWild).length + 1) {
            return false;
        }
    }
    
    return true;
}

// Get Meld Description
function getMeldDescription(meld) {
    const hasWild = meld.some(c => c.isWild);
    const isClean = !hasWild;
    
    if (meld.length >= 7) {
        if (isClean) {
            return '🎉 BURACO! (Clean Run) +200 poin!';
        } else {
            return '✨ Dirty Run +100 poin!';
        }
    }
    return 'Kombinasi valid!';
}

// Discard Card
function discardCard(index) {
    if (gameState.hasDrawn) {
        const card = gameState.playerHand.splice(index, 1)[0];
        gameState.discardPile.push(card);
        gameState.hasDrawn = false;
        gameState.selectedCards = [];
        
        // Check if player finished
        if (gameState.playerHand.length === 0) {
            if (!gameState.playerUsedPot && gameState.pot.length > 0) {
                takePot();
                return;
            } else {
                endRound();
                return;
            }
        }
        
        updateUI();
        updateStatus('Giliran komputer...');
        document.getElementById('drawBtn').disabled = true;
        document.getElementById('meldBtn').disabled = true;
        document.getElementById('discardBtn').disabled = true;
        
        setTimeout(computerTurn, 1500);
    } else {
        updateStatus('Ambil kartu terlebih dahulu!');
    }
}

// Computer Turn
function computerTurn() {
    gameState.currentTurn = 'computer';
    
    // Draw card
    if (gameState.deck.length > 0) {
        gameState.computerHand.push(gameState.deck.pop());
    }
    
    // Try to make melds
    computerMakeMelds();
    
    // Discard
    if (gameState.computerHand.length > 0) {
        const discardIndex = Math.floor(Math.random() * gameState.computerHand.length);
        gameState.discardPile.push(gameState.computerHand.splice(discardIndex, 1)[0]);
    }
    
    // Check if computer finished
    if (gameState.computerHand.length === 0) {
        if (!gameState.computerUsedPot && gameState.pot.length > 0) {
            for (let i = 0; i < 11 && gameState.pot.length > 0; i++) {
                gameState.computerHand.push(gameState.pot.pop());
            }
            gameState.computerUsedPot = true;
        } else {
            endRound();
            return;
        }
    }
    
    gameState.currentTurn = 'player';
    updateUI();
    updateStatus('Giliran Anda! Ambil kartu dari deck atau tumpukan buang.');
    enableButtons();
}

// Computer Make Melds (Simple AI)
function computerMakeMelds() {
    let changed = true;
    while (changed) {
        changed = false;
        
        // Try to find sets
        const valueCounts = {};
        gameState.computerHand.forEach((card, index) => {
            if (!valueCounts[card.value]) valueCounts[card.value] = [];
            valueCounts[card.value].push(index);
        });
        
        for (let value in valueCounts) {
            if (valueCounts[value].length >= 3 && value !== '2' && value !== 'JOKER') {
                const meld = [];
                for (let i = 0; i < 3; i++) {
                    const index = valueCounts[value][i];
                    meld.push(gameState.computerHand[index]);
                }
                // Remove from hand
                valueCounts[value].slice(0, 3).reverse().forEach(index => {
                    gameState.computerHand.splice(index, 1);
                });
                gameState.computerMelds.push(meld);
                
                // Calculate and add points immediately
                let meldPoints = 0;
                meld.forEach(card => {
                    meldPoints += card.points;
                });
                
                // Bonus for Buraco and Dirty Run
                if (meld.length >= 7) {
                    const hasWild = meld.some(c => c.isWild);
                    if (hasWild) {
                        meldPoints += 100; // Dirty Run
                    } else {
                        meldPoints += 200; // Buraco (Clean Run)
                    }
                }
                
                gameState.computerScore += meldPoints;
                
                changed = true;
                break;
            }
        }
    }
}

// End Round
function endRound() {
    // Calculate penalty for cards remaining in hand
    let playerPenalty = 0;
    gameState.playerHand.forEach(card => {
        playerPenalty += card.points;
    });
    
    let computerPenalty = 0;
    gameState.computerHand.forEach(card => {
        computerPenalty += card.points;
    });
    
    // Subtract penalties from scores
    gameState.playerScore -= playerPenalty;
    gameState.computerScore -= computerPenalty;
    
    updateUI();
    
    let message = `Ronde Selesai!\n\n`;
    if (playerPenalty > 0) {
        message += `Penalti kartu tersisa Anda: -${playerPenalty} poin\n`;
    }
    if (computerPenalty > 0) {
        message += `Penalti kartu tersisa Komputer: -${computerPenalty} poin\n`;
    }
    message += `\nTotal Skor Anda: ${gameState.playerScore}\n`;
    message += `Total Skor Komputer: ${gameState.computerScore}\n\n`;
    
    if (gameState.playerScore > gameState.computerScore) {
        message += `🎉 Anda Menang!`;
    } else if (gameState.computerScore > gameState.playerScore) {
        message += `💻 Komputer Menang!`;
    } else {
        message += `🤝 Seri!`;
    }
    
    setTimeout(() => {
        alert(message);
        if (confirm('Mulai ronde baru?')) {
            initGame();
        }
    }, 500);
}

// Calculate Score
function calculateScore(melds, hand) {
    let score = 0;
    
    // Points from melds
    melds.forEach(meld => {
        meld.forEach(card => {
            score += card.points;
        });
        
        // Bonus for Buraco and Dirty Run
        if (meld.length >= 7) {
            const hasWild = meld.some(c => c.isWild);
            if (hasWild) {
                score += 100; // Dirty Run
            } else {
                score += 200; // Buraco (Clean Run)
            }
        }
    });
    
    // Subtract points from cards in hand
    hand.forEach(card => {
        score -= card.points;
    });
    
    return score;
}

// Enable Buttons
function enableButtons() {
    document.getElementById('drawBtn').disabled = false;
    document.getElementById('meldBtn').disabled = true;
    document.getElementById('discardBtn').disabled = true;
    document.getElementById('takePotBtn').disabled = gameState.playerUsedPot || gameState.playerHand.length > 0;
}

// Update Status
function updateStatus(message) {
    document.getElementById('gameStatus').textContent = message;
}

// Update UI
function updateUI() {
    // Update scores
    document.getElementById('playerScore').textContent = gameState.playerScore;
    document.getElementById('computerScore').textContent = gameState.computerScore;
    
    // Update player hand
    const playerHandEl = document.getElementById('playerHand');
    playerHandEl.innerHTML = '';
    gameState.playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, true);
        if (gameState.selectedCards.includes(index)) {
            cardEl.classList.add('selected');
        }
        cardEl.onclick = () => toggleCardSelection(index);
        cardEl.ondblclick = () => {
            if (gameState.hasDrawn) {
                discardCard(index);
            }
        };
        playerHandEl.appendChild(cardEl);
    });
    
    // Update computer hand
    const computerHandEl = document.getElementById('computerHand');
    computerHandEl.innerHTML = '';
    gameState.computerHand.forEach(() => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card back';
        cardEl.textContent = '🂠';
        computerHandEl.appendChild(cardEl);
    });
    
    // Update discard pile
    const discardPileEl = document.getElementById('discardPile');
    discardPileEl.innerHTML = '';
    if (gameState.discardPile.length > 0) {
        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        const cardEl = createCardElement(topCard, true);
        cardEl.onclick = takeFromDiscard;
        discardPileEl.appendChild(cardEl);
    }
    
    // Update draw pile
    const drawPileEl = document.getElementById('drawPile');
    if (gameState.deck.length > 0) {
        drawPileEl.innerHTML = '<div class="card back">🂠</div>';
        drawPileEl.onclick = drawCard;
    } else {
        drawPileEl.innerHTML = '<p>Kosong</p>';
    }
    
    // Update pot
    const potPileEl = document.getElementById('potPile');
    if (gameState.pot.length > 0) {
        potPileEl.innerHTML = '<div class="card back">🎁</div>';
    } else {
        potPileEl.innerHTML = '<p>Kosong</p>';
    }
    
    // Update melds
    updateMelds('playerMelds', gameState.playerMelds);
    updateMelds('computerMelds', gameState.computerMelds);
}

// Update Melds Display
function updateMelds(elementId, melds) {
    const meldsEl = document.getElementById(elementId);
    const label = meldsEl.querySelector('.meld-label');
    meldsEl.innerHTML = '';
    meldsEl.appendChild(label);
    
    melds.forEach(meld => {
        const meldEl = document.createElement('div');
        meldEl.className = 'meld';
        meld.forEach(card => {
            meldEl.appendChild(createCardElement(card, false));
        });
        meldsEl.appendChild(meldEl);
    });
}

// Create Card Element
function createCardElement(card, clickable) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    if (card.suit === '♥' || card.suit === '♦') {
        cardEl.classList.add('red');
    } else {
        cardEl.classList.add('black');
    }
    
    cardEl.textContent = card.displayValue;
    if (!clickable) {
        cardEl.style.cursor = 'default';
    }
    
    return cardEl;
}

// Event Listeners
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('drawBtn').addEventListener('click', drawCard);
document.getElementById('meldBtn').addEventListener('click', makeMeld);
document.getElementById('discardBtn').addEventListener('click', () => {
    if (gameState.selectedCards.length === 1) {
        discardCard(gameState.selectedCards[0]);
    } else {
        updateStatus('Pilih 1 kartu untuk dibuang!');
    }
});
document.getElementById('takePotBtn').addEventListener('click', takePot);

// Tutorial Modal
const modal = document.getElementById('tutorialModal');
const tutorialBtn = document.getElementById('tutorialBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const closeTutorialBtn = document.getElementsByClassName('close-tutorial')[0];

tutorialBtn.onclick = () => {
    modal.style.display = 'block';
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

closeTutorialBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Show tutorial on first load
window.onload = () => {
    modal.style.display = 'block';
};
