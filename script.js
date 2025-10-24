// Game State
let gameState = {
    playerHand: [],
    computerHand: [],
    computer2Hand: [],
    computer3Hand: [],
    playerMelds: [],
    computerMelds: [],
    computer2Melds: [],
    computer3Melds: [],
    deck: [],
    discardPile: [],
    playerPot: [],
    computerPot: [],
    computer2Pot: [],
    computer3Pot: [],
    playerScore: 0,
    computerScore: 0,
    computer2Score: 0,
    computer3Score: 0,
    playerRoundScore: 0,
    computerRoundScore: 0,
    computer2RoundScore: 0,
    computer3RoundScore: 0,
    playerHasBuraco: false,
    computerHasBuraco: false,
    computer2HasBuraco: false,
    computer3HasBuraco: false,
    playerFirstMeldMade: false,
    computerFirstMeldMade: false,
    computer2FirstMeldMade: false,
    computer3FirstMeldMade: false,
    currentTurn: 'player',
    hasDrawn: false,
    playerUsedPot: false,
    computerUsedPot: false,
    computer2UsedPot: false,
    computer3UsedPot: false,
    selectedCards: [],
    targetScore: 2000,
    roundNumber: 1,
    playerCount: 2,
    isDealing: false
};

// Player Style Tracking
let playerStyleData = {
    version: "1.0",
    lastUpdated: new Date().toISOString().split('T')[0],
    playerProfile: {
        gamesPlayed: 0,
        totalMoves: 0,
        style: {
            aggressiveness: 50,
            riskTolerance: 50,
            meldSpeed: 50,
            wildCardUsage: 50
        },
        preferences: {
            prefersSequences: 0,
            prefersSets: 0,
            usesWildCardsEarly: 0,
            holdsForBigMelds: 0
        },
        patterns: {
            drawFromDiscard: 0,
            drawFromDeck: 0,
            avgMeldSize: 0,
            avgTurnsBeforeFirstMeld: 0,
            avgCardsInHandBeforeMeld: 0
        },
        discardPatterns: {
            highCards: 0,
            lowCards: 0,
            middleCards: 0,
            duplicates: 0,
            isolatedCards: 0
        }
    },
    aiAdaptation: {
        currentStrategy: "balanced",
        adaptationLevel: 0,
        counterStrategies: {
            againstAggressive: false,
            againstConservative: false,
            againstRisky: false,
            againstCautious: false
        },
        learningProgress: {
            movesAnalyzed: 0,
            patternsDetected: 0,
            confidenceLevel: 0
        }
    },
    statistics: {
        wins: 0,
        losses: 0,
        draws: 0,
        avgScore: 0,
        highestScore: 0,
        totalBuracosCreated: 0,
        cleanBuracosCreated: 0,
        dirtyBuracosCreated: 0
    }
};

// Card Suits and Values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const cardPoints = {
    'A': 15, 'K': 10, 'Q': 10, 'J': 10, '10': 10,
    '9': 10, '8': 10, '7': 5, '6': 5, '5': 5, '4': 5, '3': 5, '2': 20, 'JOKER': 50
};

// Initialize Game (New Round)
async function initGame(newGame = true, playerCount = 2) {
    const keepScores = !newGame;
    const previousPlayerScore = keepScores ? gameState.playerScore : 0;
    const previousComputerScore = keepScores ? gameState.computerScore : 0;
    const previousComputer2Score = keepScores ? gameState.computer2Score : 0;
    const previousComputer3Score = keepScores ? gameState.computer3Score : 0;
    const previousRoundNumber = keepScores ? gameState.roundNumber : 1;
    const previousPlayerCount = keepScores ? gameState.playerCount : playerCount;
    
    gameState = {
        playerHand: [],
        computerHand: [],
        computer2Hand: [],
        computer3Hand: [],
        playerMelds: [],
        computerMelds: [],
        computer2Melds: [],
        computer3Melds: [],
        deck: [],
        discardPile: [],
        playerPot: [],
        computerPot: [],
        computer2Pot: [],
        computer3Pot: [],
        playerScore: previousPlayerScore,
        computerScore: previousComputerScore,
        computer2Score: previousComputer2Score,
        computer3Score: previousComputer3Score,
        playerRoundScore: 0,
        computerRoundScore: 0,
        computer2RoundScore: 0,
        computer3RoundScore: 0,
        playerHasBuraco: false,
        computerHasBuraco: false,
        computer2HasBuraco: false,
        computer3HasBuraco: false,
        playerFirstMeldMade: false,
        computerFirstMeldMade: false,
        computer2FirstMeldMade: false,
        computer3FirstMeldMade: false,
        currentTurn: 'player',
        hasDrawn: false,
        playerUsedPot: false,
        computerUsedPot: false,
        computer2UsedPot: false,
        computer3UsedPot: false,
        selectedCards: [],
        targetScore: 2000,
        roundNumber: previousRoundNumber,
        playerCount: previousPlayerCount,
        isDealing: false
    };
    
    createDeck();
    shuffleDeck();
    await dealCards();
    updateUI();
    updateStatus('Your turn! Draw card from deck or discard pile.');
    enableButtons();
}

// Show player selection modal
function showPlayerSelection() {
    document.getElementById('playerSelectModal').style.display = 'block';
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

// Deal Cards with Animation
async function dealCards() {
    gameState.isDealing = true;
    const dealingStatus = document.getElementById('dealingStatus');
    dealingStatus.style.display = 'block';
    dealingStatus.textContent = 'Dealing cards...';
    
    // Disable all buttons during dealing
    document.getElementById('startBtn').disabled = true;
    document.getElementById('drawBtn').disabled = true;
    document.getElementById('meldBtn').disabled = true;
    document.getElementById('addToMeldBtn').disabled = true;
    document.getElementById('discardBtn').disabled = true;
    
    const players = gameState.playerCount === 2 ? 
        ['player', 'computer'] : 
        ['player', 'computer', 'computer2', 'computer3'];
    
    // Deal 11 cards to each player with animation
    for (let i = 0; i < 11; i++) {
        for (let player of players) {
            await dealCardWithAnimation(player);
            await sleep(100); // Delay between each card
        }
    }
    
    dealingStatus.textContent = 'Creating pots...';
    await sleep(500);
    
    // Create separate pots (11 cards for each player)
    for (let player of players) {
        for (let i = 0; i < 11; i++) {
            gameState[`${player}Pot`].push(gameState.deck.pop());
        }
    }
    
    // First discard
    gameState.discardPile.push(gameState.deck.pop());
    
    dealingStatus.textContent = 'Finished! Have fun playing!';
    await sleep(1000);
    dealingStatus.style.display = 'none';
    gameState.isDealing = false;
}

// Deal single card with animation
async function dealCardWithAnimation(player) {
    const card = gameState.deck.pop();
    gameState[`${player}Hand`].push(card);
    
    // Update UI with animation
    updateUIWithAnimation();
    
    return new Promise(resolve => setTimeout(resolve, 50));
}

// Sleep helper function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Draw Card
function drawCard() {
    if (!gameState.hasDrawn) {
        if (gameState.deck.length > 0) {
            const card = gameState.deck.pop();
            gameState.playerHand.push(card);
            gameState.hasDrawn = true;
            
            // Track player draw choice
            trackDrawChoice(false);
            
            updateUI();
            updateStatus('Card drawn! Now create combinations or discard card.');
            document.getElementById('drawBtn').disabled = true;
            document.getElementById('meldBtn').disabled = false;
            document.getElementById('addToMeldBtn').disabled = false;
            document.getElementById('discardBtn').disabled = false;
        } else {
            updateStatus('Deck empty! Take pot if not taken yet.');
        }
    }
}

// Take from Discard Pile (Take ALL cards from discard pile)
function takeFromDiscard() {
    if (!gameState.hasDrawn && gameState.discardPile.length > 0) {
        // Take ALL cards from discard pile
        const takenCards = [...gameState.discardPile];
        gameState.playerHand.push(...takenCards);
        gameState.discardPile = [];
        gameState.hasDrawn = true;
        
        // Track player draw choice
        trackDrawChoice(true);
        
        updateUI();
        updateStatus(`${takenCards.length} cards from discard pile taken! Create combinations or discard card.`);
        document.getElementById('drawBtn').disabled = true;
        document.getElementById('meldBtn').disabled = false;
        document.getElementById('addToMeldBtn').disabled = false;
        document.getElementById('discardBtn').disabled = false;
    }
}

// Take Pot
function takePot() {
    if (!gameState.playerUsedPot && gameState.playerPot.length > 0 && gameState.playerHand.length === 0) {
        // Take player's pot
        gameState.playerHand.push(...gameState.playerPot);
        gameState.playerPot = [];
        gameState.playerUsedPot = true;
        gameState.hasDrawn = false;
        updateUI();
        updateStatus('Your pot taken! Continue playing.');
        document.getElementById('takePotBtn').disabled = true;
        enableButtons();
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
        updateStatus('Select at least 3 cards to create combination!');
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
        
        // Track player meld creation
        trackMeldCreation(meld);
        
        // Track Buraco if created
        if (meld.length >= 7) {
            const hasWild = meld.some(c => c.isWild);
            trackBuracoCreation(!hasWild);
            if (!gameState.playerHasBuraco) {
                gameState.playerHasBuraco = true;
            }
        }
        
        updateUI();
        updateStatus('Combination created successfully! ' + getMeldDescription(meld) + ` +${meldPoints} points!`);
    } else {
        updateStatus('Invalid combination! Must be 3+ consecutive or same cards.');
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
            return 'BURACO! (Clean Run) +200 bonus points!';
        } else {
            return 'Dirty Run (7+ cards with wild) +100 bonus points!';
        }
    }
        return 'Valid combination!';
}

// Discard Card
function discardCard(index) {
    if (gameState.hasDrawn) {
        const card = gameState.playerHand.splice(index, 1)[0];
        
        // Track player discard choice
        trackDiscardChoice(card);
        
        gameState.discardPile.push(card);
        gameState.hasDrawn = false;
        gameState.selectedCards = [];
        
        // Check if player finished
        if (gameState.playerHand.length === 0) {
            if (!gameState.playerUsedPot && gameState.playerPot.length > 0) {
                takePot();
                return;
            } else {
                // Check if player can finish (must have at least 1 Buraco)
                if (gameState.playerHasBuraco) {
                    endRound();
                    return;
                } else {
                    updateStatus('ERROR: Cannot exhaust cards without Buraco!');
                    gameState.playerHand.push(card);
                    gameState.discardPile.pop();
                    gameState.hasDrawn = true;
                    updateUI();
                    return;
                }
            }
        }
        
        updateUI();
        updateStatus('Computer turn...');
        document.getElementById('drawBtn').disabled = true;
        document.getElementById('meldBtn').disabled = true;
        document.getElementById('addToMeldBtn').disabled = true;
        document.getElementById('discardBtn').disabled = true;
        
        setTimeout(computerTurn, 1500);
    } else {
        updateStatus('Draw card first!');
    }
}

// Computer Turn
function computerTurn() {
    gameState.currentTurn = 'computer';
    
    // Smart decision: Should take from discard pile or deck?
    const shouldTakeDiscard = computerShouldTakeDiscardPile();
    
    if (shouldTakeDiscard && gameState.discardPile.length > 0) {
        // Take entire discard pile
        gameState.computerHand.push(...gameState.discardPile);
        updateStatus('Computer takes entire discard pile!');
        gameState.discardPile = [];
        updateUI();
    } else {
        // Draw from deck
        if (gameState.deck.length > 0) {
            gameState.computerHand.push(gameState.deck.pop());
        } else if (gameState.discardPile.length > 0) {
            // If deck is empty, must take from discard pile
            gameState.computerHand.push(...gameState.discardPile);
            gameState.discardPile = [];
        }
    }
    
    // Try to make melds
    const meldsBefore = gameState.computerMelds.length;
    computerMakeMelds();
    const meldsAfter = gameState.computerMelds.length;
    
    if (meldsAfter > meldsBefore) {
        updateStatus('Computer creates new combination!');
        updateUI();
        setTimeout(() => {}, 500);
    }
    
    // Try to add to existing melds
    const cardsBefore = gameState.computerHand.length;
    computerAddToExistingMelds();
    const cardsAfter = gameState.computerHand.length;
    
    if (cardsAfter < cardsBefore) {
        updateStatus('Computer adds card to combination!');
        updateUI();
        setTimeout(() => {}, 500);
    }
    
    // Smart discard: discard least useful card
    if (gameState.computerHand.length > 0) {
        const discardIndex = computerChooseDiscardCard();
        const discardedCard = gameState.computerHand[discardIndex];
        gameState.discardPile.push(gameState.computerHand.splice(discardIndex, 1)[0]);
        
        if (discardedCard.points >= 15) {
            updateStatus(`Computer discards ${discardedCard.displayValue} (${discardedCard.points} points)`);
        }
    }
    
    // Check if computer finished
    if (gameState.computerHand.length === 0) {
        if (!gameState.computerUsedPot && gameState.computerPot.length > 0) {
            gameState.computerHand.push(...gameState.computerPot);
            gameState.computerPot = [];
            gameState.computerUsedPot = true;
        } else {
            if (gameState.computerHasBuraco) {
                endRound();
                return;
            }
        }
    }
    
    gameState.currentTurn = 'player';
    updateUI();
    updateStatus('Your turn! Draw card from deck or discard pile.');
    enableButtons();
}

// AI: Decide if computer should take discard pile
function computerShouldTakeDiscardPile() {
    if (gameState.discardPile.length === 0) return false;
    
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    const pileSize = gameState.discardPile.length;
    
    // Get AI-adapted thresholds based on player style
    const baseThreshold80 = getAIAdaptedThreshold(80);
    const baseThreshold60 = getAIAdaptedThreshold(60);
    const baseThreshold40 = getAIAdaptedThreshold(40);
    const baseThreshold50 = getAIAdaptedThreshold(50);
    const baseThreshold30 = getAIAdaptedThreshold(30);
    
    // Strategy 1: If top card can complete a meld
    if (computerCanUseCard(topCard)) {
        // More likely to take if pile is small (1-3 cards)
        if (pileSize <= 3) return Math.random() * 100 < baseThreshold80;
        // Medium pile (4-7 cards)
        if (pileSize <= 7) return Math.random() * 100 < baseThreshold60;
        // Large pile (8+ cards) - be cautious
        return Math.random() * 100 < baseThreshold40;
    }
    
    // Strategy 2: If pile is small and top card is useful
    if (pileSize <= 2 && (topCard.isWild || topCard.points <= 5)) {
        return Math.random() * 100 < baseThreshold50;
    }
    
    // Strategy 3: Desperate mode - if hand is bad and pile is reasonable
    const handQuality = evaluateHandQuality(gameState.computerHand);
    if (handQuality < 30 && pileSize <= 5) {
        return Math.random() * 100 < baseThreshold30;
    }
    
    return false; // Default: don't take
}

// AI: Check if computer can use a card
function computerCanUseCard(card) {
    const hand = gameState.computerHand;
    
    // Check if card completes a set (same value)
    if (!card.isWild) {
        const sameValueCount = hand.filter(c => c.value === card.value).length;
        if (sameValueCount >= 2) return true; // Would make a set of 3+
    }
    
    // Check if card completes a sequence
    if (!card.isWild) {
        const sameSuitCards = hand.filter(c => c.suit === card.suit && !c.isWild);
        if (sameSuitCards.length >= 2) {
            // Check if forms sequence
            const valueOrder = ['A', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            const cardIndex = valueOrder.indexOf(card.value);
            
            for (let otherCard of sameSuitCards) {
                const otherIndex = valueOrder.indexOf(otherCard.value);
                const diff = Math.abs(cardIndex - otherIndex);
                if (diff <= 2) return true; // Close enough for sequence
            }
        }
    }
    
    // Wild cards are always useful
    if (card.isWild) return true;
    
    return false;
}

// AI: Evaluate hand quality (0-100)
function evaluateHandQuality(hand) {
    let quality = 0;
    
    // Count potential melds
    const valueCounts = {};
    hand.forEach(card => {
        if (!valueCounts[card.value]) valueCounts[card.value] = 0;
        valueCounts[card.value]++;
    });
    
    // Pairs and sets add quality
    for (let value in valueCounts) {
        if (valueCounts[value] >= 3) quality += 30;
        else if (valueCounts[value] === 2) quality += 15;
    }
    
    // Wild cards add quality
    const wildCount = hand.filter(c => c.isWild).length;
    quality += wildCount * 10;
    
    return Math.min(quality, 100);
}

// AI: Choose best card to discard
function computerChooseDiscardCard() {
    const hand = gameState.computerHand;
    if (hand.length === 1) return 0;
    
    let worstIndex = 0;
    let worstScore = -1000;
    
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        let score = 0;
        
        // Don't discard wild cards
        if (card.isWild) {
            score = -100;
        } else {
            // Check if card is part of potential meld
            const sameValueCount = hand.filter(c => c.value === card.value).length;
            if (sameValueCount >= 2) {
                score = -50; // Keep cards that can form sets
            }
            
            // Check if card can form sequence
            const sameSuitCards = hand.filter(c => c.suit === card.suit && !c.isWild);
            if (sameSuitCards.length >= 2) {
                score = -30; // Keep cards that might form sequences
            }
            
            // High value cards are worse to keep (higher penalty if discarded)
            score += card.points;
        }
        
        if (score > worstScore) {
            worstScore = score;
            worstIndex = i;
        }
    }
    
    return worstIndex;
}

// AI: Try to add cards to existing melds
function computerAddToExistingMelds() {
    if (gameState.computerMelds.length === 0) return;
    
    let changed = true;
    while (changed) {
        changed = false;
        
        for (let meldIndex = 0; meldIndex < gameState.computerMelds.length; meldIndex++) {
            const meld = gameState.computerMelds[meldIndex];
            
            for (let i = gameState.computerHand.length - 1; i >= 0; i--) {
                const card = gameState.computerHand[i];
                const testMeld = [...meld, card];
                
                if (isValidMeld(testMeld)) {
                    // Add card to meld
                    const addedCard = gameState.computerHand.splice(i, 1)[0];
                    meld.push(addedCard);
                    
                    // Calculate points
                    let addedPoints = addedCard.points;
                    
                    // Check if this makes it a Buraco
                    if (meld.length >= 7) {
                        const hasWild = meld.some(c => c.isWild);
                        if (!hasWild && !gameState.computerHasBuraco) {
                            addedPoints += 200;
                            gameState.computerHasBuraco = true;
                        } else if (hasWild && meld.length === 7) {
                            addedPoints += 100;
                        }
                    }
                    
                    gameState.computerRoundScore += addedPoints;
                    changed = true;
                    break;
                }
            }
            
            if (changed) break;
        }
    }
}

// Computer Make Melds (Improved AI)
function computerMakeMelds() {
    let changed = true;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    while (changed && attempts < maxAttempts) {
        changed = false;
        attempts++;
        
        // Strategy 1: Try to find the best meld (prioritize longer melds and sequences)
        const bestMeld = computerFindBestMeld();
        
        if (bestMeld && bestMeld.cards.length >= 3) {
            // Calculate meld points
            let meldPoints = 0;
            bestMeld.cards.forEach(card => {
                meldPoints += card.points;
            });
            
            // Check minimum requirement for first meld
            if (!gameState.computerFirstMeldMade) {
                if (meldPoints < 50) {
                    // Try to add wild cards to reach 50 points
                    const wildCards = gameState.computerHand.filter(c => c.isWild);
                    if (wildCards.length > 0 && isValidMeld([...bestMeld.cards, wildCards[0]])) {
                        bestMeld.cards.push(wildCards[0]);
                        meldPoints += wildCards[0].points;
                    }
                    
                    if (meldPoints < 50) {
                        continue; // Still not enough, skip this meld
                    }
                }
                gameState.computerFirstMeldMade = true;
            }
            
            // Remove cards from hand
            const meldToAdd = [];
            bestMeld.indices.sort((a, b) => b - a).forEach(index => {
                meldToAdd.unshift(gameState.computerHand.splice(index, 1)[0]);
            });
            
            gameState.computerMelds.push(meldToAdd);
            
            // Bonus for Buraco and Dirty Run
            if (meldToAdd.length >= 7) {
                const hasWild = meldToAdd.some(c => c.isWild);
                if (hasWild) {
                    meldPoints += 100; // Dirty Run
                } else {
                    meldPoints += 200; // Buraco (Clean Run)
                    gameState.computerHasBuraco = true;
                }
            }
            
            gameState.computerRoundScore += meldPoints;
            changed = true;
        }
    }
}

// AI: Find the best possible meld in hand
function computerFindBestMeld() {
    const hand = gameState.computerHand;
    let bestMeld = null;
    let bestScore = 0;
    
    // Try to find sets (same value)
    const valueCounts = {};
    hand.forEach((card, index) => {
        if (!valueCounts[card.value]) valueCounts[card.value] = { cards: [], indices: [] };
        valueCounts[card.value].cards.push(card);
        valueCounts[card.value].indices.push(index);
    });
    
    for (let value in valueCounts) {
        if (value === '2' || value === 'JOKER') continue; // Skip wild cards for sets
        
        const group = valueCounts[value];
        if (group.cards.length >= 3) {
            // Calculate score: prefer longer sets
            const score = group.cards.length * 20 + group.cards.reduce((sum, c) => sum + c.points, 0);
            
            if (score > bestScore) {
                bestScore = score;
                bestMeld = {
                    cards: [...group.cards],
                    indices: [...group.indices],
                    type: 'set'
                };
            }
        } else if (group.cards.length === 2) {
            // Try to add a wild card
            const wildIndex = hand.findIndex(c => c.isWild);
            if (wildIndex >= 0) {
                const score = 3 * 15 + group.cards.reduce((sum, c) => sum + c.points, 0) + hand[wildIndex].points;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMeld = {
                        cards: [...group.cards, hand[wildIndex]],
                        indices: [...group.indices, wildIndex],
                        type: 'set-with-wild'
                    };
                }
            }
        }
    }
    
    // Try to find sequences (same suit, consecutive)
    const suitGroups = { '♠': [], '♥': [], '♦': [], '♣': [] };
    hand.forEach((card, index) => {
        if (!card.isWild && suitGroups[card.suit]) {
            suitGroups[card.suit].push({ card, index });
        }
    });
    
    const valueOrder = ['A', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    for (let suit in suitGroups) {
        const cards = suitGroups[suit];
        if (cards.length < 2) continue;
        
        // Sort by value
        cards.sort((a, b) => {
            return valueOrder.indexOf(a.card.value) - valueOrder.indexOf(b.card.value);
        });
        
        // Find longest sequence
        for (let i = 0; i < cards.length; i++) {
            const sequence = [cards[i]];
            let lastValue = valueOrder.indexOf(cards[i].card.value);
            
            for (let j = i + 1; j < cards.length; j++) {
                const currentValue = valueOrder.indexOf(cards[j].card.value);
                const gap = currentValue - lastValue;
                
                if (gap === 1) {
                    // Consecutive
                    sequence.push(cards[j]);
                    lastValue = currentValue;
                } else if (gap === 2) {
                    // One card gap - can use wild
                    const wildIndex = hand.findIndex(c => c.isWild);
                    if (wildIndex >= 0 && sequence.length + 1 >= 3) {
                        sequence.push({ card: hand[wildIndex], index: wildIndex });
                        sequence.push(cards[j]);
                        lastValue = currentValue;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            
            if (sequence.length >= 3) {
                // Prefer longer sequences
                const score = sequence.length * 25 + sequence.reduce((sum, item) => sum + item.card.points, 0);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMeld = {
                        cards: sequence.map(item => item.card),
                        indices: sequence.map(item => item.index),
                        type: 'sequence'
                    };
                }
            }
        }
    }
    
    return bestMeld;
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
    
    // Apply round scores and penalties
    const playerFinalRoundScore = gameState.playerRoundScore - playerPenalty;
    const computerFinalRoundScore = gameState.computerRoundScore - computerPenalty;
    
    gameState.playerScore += playerFinalRoundScore;
    gameState.computerScore += computerFinalRoundScore;
    
    updateUI();
    
    let message = `Round ${gameState.roundNumber} Complete!\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `PLAYER:\n`;
    message += `  Points from combinations: +${gameState.playerRoundScore}\n`;
    if (playerPenalty > 0) {
        message += `  Penalty for remaining cards: -${playerPenalty}\n`;
    }
    message += `  Round points: ${playerFinalRoundScore > 0 ? '+' : ''}${playerFinalRoundScore}\n`;
    message += `  Total Score: ${gameState.playerScore}\n\n`;
    
    message += `COMPUTER:\n`;
    message += `  Points from combinations: +${gameState.computerRoundScore}\n`;
    if (computerPenalty > 0) {
        message += `  Penalty for remaining cards: -${computerPenalty}\n`;
    }
    message += `  Round points: ${computerFinalRoundScore > 0 ? '+' : ''}${computerFinalRoundScore}\n`;
    message += `  Total Score: ${gameState.computerScore}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Check if game is won
    if (gameState.playerScore >= gameState.targetScore || gameState.computerScore >= gameState.targetScore) {
        const playerWon = gameState.playerScore > gameState.computerScore;
        const isDraw = gameState.playerScore === gameState.computerScore;
        
        // Track game result
        trackGameResult(playerWon, gameState.playerScore);
        
        if (playerWon) {
            message += `YOU WIN THE GAME!\n`;
            message += `Skor Akhir: ${gameState.playerScore} vs ${gameState.computerScore}`;
        } else if (!isDraw) {
            message += `Computer Wins Game!\n`;
            message += `Skor Akhir: ${gameState.computerScore} vs ${gameState.playerScore}`;
        } else {
            message += `DRAW! Game ends in a tie!\n`;
            message += `Skor Akhir: ${gameState.playerScore} - ${gameState.computerScore}`;
        }
        
        setTimeout(() => {
            alert(message);
            if (confirm('Start new game?')) {
                initGame(true); // New game, reset all scores
            }
        }, 500);
    } else {
        // Continue to next round
        message += `Target: ${gameState.targetScore} points\n`;
        if (gameState.playerScore > gameState.computerScore) {
            message += `You are leading!\n`;
        } else if (gameState.computerScore > gameState.playerScore) {
            message += `Computer is leading!\n`;
        } else {
            message += `Tied score!\n`;
        }
        
        setTimeout(() => {
            alert(message);
            if (confirm('Continue to next round?')) {
                gameState.roundNumber++;
                initGame(false); // Keep scores
            }
        }, 500);
    }
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
    document.getElementById('addToMeldBtn').disabled = true;
    document.getElementById('discardBtn').disabled = true;
    document.getElementById('takePotBtn').disabled = gameState.playerUsedPot || gameState.playerHand.length > 0 || gameState.playerPot.length === 0;
}

// Update Status
function updateStatus(message) {
    document.getElementById('gameStatus').textContent = message;
}

// Update UI
function updateUI() {
    // Update scores (show round score + total score)
    if (gameState.playerCount === 2) {
        document.getElementById('playerScore').textContent = `${gameState.playerScore} (+${gameState.playerRoundScore})`;
        document.getElementById('computerScore').textContent = `${gameState.computerScore} (+${gameState.computerRoundScore})`;
    } else {
        // 4 players: show team scores (player + computer2 vs computer + computer3)
        const team1Score = gameState.playerScore + gameState.computer2Score;
        const team2Score = gameState.computerScore + gameState.computer3Score;
        const team1RoundScore = gameState.playerRoundScore + gameState.computer2RoundScore;
        const team2RoundScore = gameState.computerRoundScore + gameState.computer3RoundScore;
        document.getElementById('playerScore').textContent = `Tim 1: ${team1Score} (+${team1RoundScore})`;
        document.getElementById('computerScore').textContent = `Tim 2: ${team2Score} (+${team2RoundScore})`;
    }
    document.getElementById('roundNumber').textContent = gameState.roundNumber;
    document.getElementById('targetScore').textContent = gameState.targetScore;
    
    // Update player hand
    const playerHandEl = document.getElementById('playerHand');
    playerHandEl.innerHTML = '';
    gameState.playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, true);
        if (gameState.selectedCards.includes(index)) {
            cardEl.classList.add('selected');
        }
        if (gameState.isDealing) {
            cardEl.classList.add('dealing');
            cardEl.style.animationDelay = `${index * 0.1}s`;
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
    gameState.computerHand.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card back';
        cardEl.textContent = '🂠';
        if (gameState.isDealing) {
            cardEl.classList.add('dealing');
            cardEl.style.animationDelay = `${index * 0.1}s`;
        }
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
    
    // Update pot (show player's pot status)
    const potPileEl = document.getElementById('potPile');
    if (gameState.playerPot.length > 0) {
        potPileEl.innerHTML = `<div class="card back">🎁</div><p style="color: #ffd700; font-size: 0.8em; margin-top: 5px;">${gameState.playerPot.length} kartu</p>`;
    } else if (gameState.computerPot.length > 0) {
        potPileEl.innerHTML = `<div class="card back" style="opacity: 0.5;">🎁</div><p style="color: #999; font-size: 0.8em; margin-top: 5px;">Pot lawan</p>`;
    } else {
        potPileEl.innerHTML = '<p style="color: #999;">Kosong</p>';
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

// Update UI with animation helper
function updateUIWithAnimation() {
    if (gameState.isDealing) {
        updateUI();
    }
}

// Event Listeners
document.getElementById('startBtn').addEventListener('click', showPlayerSelection);
document.getElementById('select2Players').addEventListener('click', () => {
    document.getElementById('playerSelectModal').style.display = 'none';
    initGame(true, 2);
});
document.getElementById('select4Players').addEventListener('click', () => {
    document.getElementById('playerSelectModal').style.display = 'none';
    initGame(true, 4);
});
document.getElementById('drawBtn').addEventListener('click', drawCard);
document.getElementById('meldBtn').addEventListener('click', makeMeld);
document.getElementById('discardBtn').addEventListener('click', () => {
    if (gameState.selectedCards.length === 1) {
        discardCard(gameState.selectedCards[0]);
    } else {
        updateStatus('Select 1 card to discard!');
    }
});
document.getElementById('takePotBtn').addEventListener('click', takePot);
document.getElementById('addToMeldBtn').addEventListener('click', () => {
    if (gameState.playerMelds.length === 0) {
        updateStatus('No combinations to add to!');
        return;
    }
    if (gameState.selectedCards.length === 0) {
        updateStatus('Select cards to add!');
        return;
    }
    // For simplicity, add to first valid meld found
    for (let i = 0; i < gameState.playerMelds.length; i++) {
        const sortedIndices = [...gameState.selectedCards].sort((a, b) => a - b);
        const selectedCards = sortedIndices.map(index => gameState.playerHand[index]);
        const testMeld = [...gameState.playerMelds[i], ...selectedCards];
        
        if (isValidMeld(testMeld)) {
            addToMeld(i);
            return;
        }
    }
    updateStatus('Card cannot be added to any combination!');
});



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
    if (event.target === document.getElementById('playerSelectModal')) {
        // Don't allow closing player select modal by clicking outside
    }
};

// Show player selection on first load
window.onload = () => {
    loadPlayerStyle();
    showPlayerSelection();
};

// ============================================
// PLAYER STYLE TRACKING & AI LEARNING SYSTEM
// ============================================

// Load player style from gameStyle.json
// Load player style from localStorage (NO FILE ACCESS - avoid CORS)
function loadPlayerStyle() {
    const saved = localStorage.getItem('buracoPlayerStyle');
    if (saved) {
        try {
            playerStyleData = JSON.parse(saved);
            console.log('✅ Loaded player style from localStorage:', playerStyleData);
            updateAIStrategy();
        } catch (e) {
            console.error('Error loading player style:', e);
            console.log('⚠️ Using default player style data');
        }
    } else {
        console.log('📝 No saved data found. Starting fresh!');
    }
}

// Save player style to localStorage (auto-save after every action)
function savePlayerStyle() {
    playerStyleData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Save with PWA support (includes background sync)
    if (typeof savePlayerStyleDataPWA === 'function') {
        savePlayerStyleDataPWA(playerStyleData);
    } else {
        // Fallback to regular localStorage
        localStorage.setItem('buracoPlayerStyle', JSON.stringify(playerStyleData));
        console.log('💾 Saved to localStorage');
    }
    
    // Display current state in console for debugging
    console.log('💾 Saved to localStorage');
    console.log('📊 Stats:', {
        gamesPlayed: playerStyleData.playerProfile.gamesPlayed,
        totalMoves: playerStyleData.playerProfile.totalMoves,
        aggressiveness: playerStyleData.playerProfile.style.aggressiveness.toFixed(1),
        riskTolerance: playerStyleData.playerProfile.style.riskTolerance.toFixed(1),
        aiStrategy: playerStyleData.aiAdaptation.currentStrategy,
        confidence: playerStyleData.aiAdaptation.learningProgress.confidenceLevel.toFixed(1)
    });
    
    // Show notification every 10 moves
    if (playerStyleData.playerProfile.totalMoves % 10 === 0 && playerStyleData.playerProfile.totalMoves > 0) {
        updateStatus(`AI is learning your style... (${playerStyleData.playerProfile.totalMoves} moves analyzed)`);
    }
}

// Track when player draws a card
function trackDrawChoice(fromDiscard) {
    if (fromDiscard) {
        playerStyleData.playerProfile.patterns.drawFromDiscard++;
    } else {
        playerStyleData.playerProfile.patterns.drawFromDeck++;
    }
    playerStyleData.playerProfile.totalMoves++;
    
    // Calculate risk tolerance (higher if often takes discard pile)
    const total = playerStyleData.playerProfile.patterns.drawFromDiscard + 
                  playerStyleData.playerProfile.patterns.drawFromDeck;
    const discardRatio = playerStyleData.playerProfile.patterns.drawFromDiscard / total;
    playerStyleData.playerProfile.style.riskTolerance = Math.min(100, discardRatio * 150);
    
    savePlayerStyle();
}

// Track when player creates a meld
function trackMeldCreation(meld) {
    const meldSize = meld.length;
    
    // Update average meld size
    const currentAvg = playerStyleData.playerProfile.patterns.avgMeldSize;
    const totalMelds = gameState.playerMelds.length;
    playerStyleData.playerProfile.patterns.avgMeldSize = 
        (currentAvg * (totalMelds - 1) + meldSize) / totalMelds;
    
    // Check if it's a sequence or set
    const isSequence = checkIfSequence(meld);
    if (isSequence) {
        playerStyleData.playerProfile.preferences.prefersSequences++;
    } else {
        playerStyleData.playerProfile.preferences.prefersSets++;
    }
    
    // Check for wild cards
    const hasWildCards = meld.some(card => card.value === '2' || card.value === 'Joker');
    if (hasWildCards) {
        playerStyleData.playerProfile.preferences.usesWildCardsEarly++;
        playerStyleData.playerProfile.style.wildCardUsage = Math.min(100, 
            playerStyleData.playerProfile.style.wildCardUsage + 5);
    }
    
    // Check if holding for big melds
    if (meldSize >= 5) {
        playerStyleData.playerProfile.preferences.holdsForBigMelds++;
    }
    
    // Calculate meld speed (how quickly player makes melds)
    const turnsBeforeMeld = playerStyleData.playerProfile.totalMoves;
    if (!gameState.playerFirstMeldMade) {
        playerStyleData.playerProfile.patterns.avgTurnsBeforeFirstMeld = turnsBeforeMeld;
        playerStyleData.playerProfile.style.meldSpeed = Math.max(0, 100 - (turnsBeforeMeld * 10));
    }
    
    // Calculate aggressiveness
    const seqRatio = playerStyleData.playerProfile.preferences.prefersSequences / 
                     (playerStyleData.playerProfile.preferences.prefersSequences + 
                      playerStyleData.playerProfile.preferences.prefersSets + 1);
    playerStyleData.playerProfile.style.aggressiveness = 30 + (seqRatio * 40) + 
                                                          (playerStyleData.playerProfile.style.meldSpeed * 0.3);
    
    savePlayerStyle();
}

// Track when player discards a card
function trackDiscardChoice(card) {
    const points = card.points;
    
    // Categorize card
    if (points >= 15) {
        playerStyleData.playerProfile.discardPatterns.highCards++;
    } else if (points <= 5) {
        playerStyleData.playerProfile.discardPatterns.lowCards++;
    } else {
        playerStyleData.playerProfile.discardPatterns.middleCards++;
    }
    
    // Check if it's a duplicate (player has another card with same value)
    const hasDuplicate = gameState.playerHand.some(c => c.value === card.value && c !== card);
    if (hasDuplicate) {
        playerStyleData.playerProfile.discardPatterns.duplicates++;
    } else {
        playerStyleData.playerProfile.discardPatterns.isolatedCards++;
    }
    
    savePlayerStyle();
}

// Track game results
function trackGameResult(won, score) {
    playerStyleData.playerProfile.gamesPlayed++;
    
    if (won) {
        playerStyleData.statistics.wins++;
    } else {
        playerStyleData.statistics.losses++;
    }
    
    // Update average score
    const currentAvg = playerStyleData.statistics.avgScore;
    const totalGames = playerStyleData.playerProfile.gamesPlayed;
    playerStyleData.statistics.avgScore = (currentAvg * (totalGames - 1) + score) / totalGames;
    
    if (score > playerStyleData.statistics.highestScore) {
        playerStyleData.statistics.highestScore = score;
    }
    
    savePlayerStyle();
}

// Track Buraco creation
function trackBuracoCreation(isClean) {
    playerStyleData.statistics.totalBuracosCreated++;
    if (isClean) {
        playerStyleData.statistics.cleanBuracosCreated++;
    } else {
        playerStyleData.statistics.dirtyBuracosCreated++;
    }
    savePlayerStyle();
}

// Helper: Check if meld is a sequence
function checkIfSequence(meld) {
    const nonWilds = meld.filter(c => c.value !== '2' && c.value !== 'Joker');
    if (nonWilds.length < 2) return false;
    
    const suit = nonWilds[0].suit;
    const allSameSuit = nonWilds.every(c => c.suit === suit);
    
    if (!allSameSuit) return false;
    
    const valueOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const indices = nonWilds.map(c => valueOrder.indexOf(c.value)).sort((a, b) => a - b);
    
    for (let i = 1; i < indices.length; i++) {
        const gap = indices[i] - indices[i-1];
        if (gap > 2) return false; // Too big gap even for wilds
    }
    
    return true;
}

// ============================================
// AI ADAPTATION SYSTEM
// ============================================

// Update AI strategy based on player style
function updateAIStrategy() {
    const profile = playerStyleData.playerProfile;
    const ai = playerStyleData.aiAdaptation;
    
    // Analyze player style
    const isAggressive = profile.style.aggressiveness > 65;
    const isConservative = profile.style.aggressiveness < 35;
    const isRisky = profile.style.riskTolerance > 65;
    const isCautious = profile.style.riskTolerance < 35;
    
    // Determine AI counter-strategy
    if (isAggressive && isRisky) {
        ai.currentStrategy = "defensive";
        ai.counterStrategies.againstAggressive = true;
        ai.counterStrategies.againstRisky = true;
        console.log('🤖 AI Strategy: DEFENSIVE (counter aggressive + risky player)');
    } else if (isConservative && isCautious) {
        ai.currentStrategy = "aggressive";
        ai.counterStrategies.againstConservative = true;
        ai.counterStrategies.againstCautious = true;
        console.log('🤖 AI Strategy: AGGRESSIVE (counter conservative + cautious player)');
    } else if (isAggressive) {
        ai.currentStrategy = "patient";
        ai.counterStrategies.againstAggressive = true;
        console.log('🤖 AI Strategy: PATIENT (counter aggressive player)');
    } else if (isConservative) {
        ai.currentStrategy = "opportunistic";
        ai.counterStrategies.againstConservative = true;
        console.log('🤖 AI Strategy: OPPORTUNISTIC (counter conservative player)');
    } else {
        ai.currentStrategy = "balanced";
        console.log('🤖 AI Strategy: BALANCED (neutral player)');
    }
    
    // Update confidence level
    const totalMoves = profile.totalMoves;
    ai.learningProgress.movesAnalyzed = totalMoves;
    ai.learningProgress.confidenceLevel = Math.min(100, totalMoves / 10);
    
    // Detect patterns
    ai.learningProgress.patternsDetected = 0;
    if (profile.preferences.prefersSequences > profile.preferences.prefersSets * 1.5) {
        ai.learningProgress.patternsDetected++;
    }
    if (profile.patterns.drawFromDiscard > profile.patterns.drawFromDeck * 1.5) {
        ai.learningProgress.patternsDetected++;
    }
    if (profile.discardPatterns.highCards > profile.discardPatterns.lowCards * 1.5) {
        ai.learningProgress.patternsDetected++;
    }
    
    ai.adaptationLevel = Math.min(100, (ai.learningProgress.confidenceLevel + 
                                         ai.learningProgress.patternsDetected * 10));
}

// Modify AI decision based on learned player style
function getAIAdaptedThreshold(baseThreshold) {
    const ai = playerStyleData.aiAdaptation;
    const profile = playerStyleData.playerProfile;
    
    // If not enough data, use base threshold
    if (ai.learningProgress.confidenceLevel < 20) {
        return baseThreshold;
    }
    
    let modifier = 0;
    
    // Against aggressive players: be more conservative
    if (ai.counterStrategies.againstAggressive) {
        modifier -= 15;
    }
    
    // Against conservative players: be more aggressive
    if (ai.counterStrategies.againstConservative) {
        modifier += 15;
    }
    
    // Against risky players: exploit their risks
    if (ai.counterStrategies.againstRisky) {
        modifier -= 10;
    }
    
    // Against cautious players: take more risks
    if (ai.counterStrategies.againstCautious) {
        modifier += 10;
    }
    
    return Math.max(0, Math.min(100, baseThreshold + modifier));
}

// Export/Download player style as JSON
function downloadPlayerStyle() {
    const dataStr = JSON.stringify(playerStyleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `buraco-style-${playerStyleData.lastUpdated}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('📥 Downloaded player style as JSON');
}



// =============================================
// PWA (Progressive Web App) Support
// =============================================

let deferredPrompt;
let installButton;

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ PWA: Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 PWA: New version available! Please refresh to update.');
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ PWA: Service Worker registration failed:', error);
            });
    });
}

// Handle PWA installation
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('💾 PWA: Install prompt triggered');
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton();
});

// Show install button
function showInstallButton() {
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.textContent = 'Install App';
        installButton.className = 'btn install-btn';
        installButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a4d2e;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        installButton.addEventListener('click', installPWA);
        installButton.addEventListener('mouseenter', () => {
            installButton.style.transform = 'translateY(-2px)';
            installButton.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
        });
        installButton.addEventListener('mouseleave', () => {
            installButton.style.transform = 'translateY(0)';
            installButton.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
        });
        
        document.body.appendChild(installButton);
    }
}

// Install PWA
async function installPWA() {
    if (!deferredPrompt) return;
    
    console.log('🚀 PWA: Installing app...');
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 PWA: User choice: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('✅ PWA: App installed successfully');
        updateStatus('App installed successfully! You can now use Buraco offline.');
    } else {
        console.log('❌ PWA: App installation declined');
    }
    
    deferredPrompt = null;
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.95);
            color: #1a4d2e;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-weight: bold;
            max-width: 300px;
            text-align: center;
        ">
            🔄 New version available!
            <br>
            <button onclick="window.location.reload()" style="
                margin-top: 10px;
                background: #1a4d2e;
                color: #ffd700;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">
                Update Now
            </button>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-top: 10px;
                margin-left: 10px;
                background: transparent;
                color: #1a4d2e;
                border: 1px solid #1a4d2e;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
            ">
                Later
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Handle app installed event
window.addEventListener('appinstalled', () => {
    console.log('PWA: App installed via browser');
    updateStatus('Welcome! Buraco is now installed on your device.');
    
    // Hide install button if still visible
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 PWA: Back online');
    updateStatus('Connection restored! All features available.');
});

window.addEventListener('offline', () => {
    console.log('📴 PWA: Gone offline');
    updateStatus('You are offline. Game continues with cached data.');
});

// Enhanced localStorage save with background sync
function savePlayerStyleDataPWA(data) {
    try {
        // Save to localStorage as usual
        localStorage.setItem('buracoPlayerStyle', JSON.stringify(data));
        console.log('💾 PWA: Player style data saved locally');
        
        // Request background sync if service worker supports it
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('save-game-data');
            }).then(() => {
                console.log('🔄 PWA: Background sync registered for game data');
            }).catch(error => {
                console.warn('⚠️ PWA: Background sync not supported:', error);
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ PWA: Failed to save player style data:', error);
        return false;
    }
}

// Check if app is running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// PWA-specific UI adjustments
function initPWAFeatures() {
    if (isPWA()) {
        console.log('📱 PWA: Running as installed app');
        document.body.classList.add('pwa-mode');
        
        // Add PWA-specific styles
        const pwaStyles = document.createElement('style');
        pwaStyles.textContent = `
            .pwa-mode {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
            }
            
            .pwa-mode .container {
                padding-top: max(20px, env(safe-area-inset-top));
            }
        `;
        document.head.appendChild(pwaStyles);
    }
    
    // Show offline indicator if offline
    if (!navigator.onLine) {
        updateStatus('You are offline. Game continues with cached data.');
    }
}

// Orientation and layout handling
function handleOrientationChange() {
    // Add a small delay to allow the browser to complete the orientation change
    setTimeout(() => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = window.innerWidth <= 768;
        
        if (isLandscape && isMobile) {
            console.log('Landscape mobile mode activated');
            document.body.classList.add('landscape-mobile');
            
            // Adjust game board height for landscape
            const gameBoard = document.querySelector('.game-board');
            if (gameBoard) {
                gameBoard.style.maxHeight = `${window.innerHeight - 120}px`;
            }
            
            // Show landscape tip for first time users
            if (!localStorage.getItem('landscapeTipShown')) {
                setTimeout(() => {
                    updateStatus('Tip: Swipe horizontally to scroll through your cards in landscape mode!');
                    localStorage.setItem('landscapeTipShown', 'true');
                }, 1000);
            }
        } else {
            document.body.classList.remove('landscape-mobile');
            
            // Reset game board height for portrait
            const gameBoard = document.querySelector('.game-board');
            if (gameBoard) {
                gameBoard.style.maxHeight = 'none';
            }
        }
        
        // Force re-render of cards to adjust positioning
        updateUI();
    }, 100);
}

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);

// Initialize orientation handling
document.addEventListener('DOMContentLoaded', () => {
    initPWAFeatures();
    handleOrientationChange();
    
    // Prevent zoom on double tap for better mobile experience
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
