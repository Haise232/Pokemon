// ===== Game Configuration =====
const CONFIG = {
    difficulty: {
        easy: { min: 1, max: 151 },
        medium: { min: 1, max: 386 },
        hard: { min: 1, max: 898 }
    },
    modes: {
        normal: { time: null, lives: null },
        timed: { time: 60, lives: null },
        survival: { time: null, lives: 3 }
    },
    hintCost: 5,
    maxAttempts: 3
};

// ===== Game State =====
let gameState = {
    currentPokemon: null,
    score: 0,
    isGuessing: true,
    difficulty: 'medium',
    gameMode: 'normal',
    attempts: 3,
    timer: null,
    timerInterval: null,
    lives: 3,
    hintsUsed: [],
    currentStreak: 0,
    settings: {
        sound: true,
        animations: true,
        confetti: true
    },
    stats: {
        totalGuesses: 0,
        correctGuesses: 0,
        bestScore: 0,
        bestStreak: 0,
        achievements: []
    }
};

// ===== DOM Elements =====
const elements = {
    // Game controls
    difficultySelect: document.getElementById('difficulty'),
    gameModeSelect: document.getElementById('gameMode'),
    statsButton: document.getElementById('statsButton'),
    settingsButton: document.getElementById('settingsButton'),
    resetButton: document.getElementById('resetButton'),

    // Display elements
    pokemonImage: document.getElementById('pokemonImage'),
    guessInput: document.getElementById('guessInput'),
    guessButton: document.getElementById('guessButton'),
    hintButton: document.getElementById('hintButton'),
    nextButton: document.getElementById('nextButton'),
    scoreElement: document.getElementById('score'),
    messageElement: document.getElementById('message'),
    loadingElement: document.getElementById('loading'),
    inputArea: document.getElementById('inputArea'),
    cardContainer: document.getElementById('cardContainer'),
    hintDisplay: document.getElementById('hintDisplay'),
    attemptsCounter: document.getElementById('attemptsCounter'),
    attemptsLeft: document.getElementById('attemptsLeft'),

    // Timer and lives
    timerContainer: document.getElementById('timerContainer'),
    timerElement: document.getElementById('timer'),
    livesContainer: document.getElementById('livesContainer'),
    livesElement: document.getElementById('lives'),

    // Card elements
    cardName: document.getElementById('cardName'),
    cardId: document.getElementById('cardId'),
    cardHP: document.getElementById('cardHP'),
    cardStage: document.getElementById('cardStage'),
    cardImage: document.getElementById('cardImage'),
    cardTypes: document.getElementById('cardTypes'),
    cardAttacks: document.getElementById('cardAttacks'),
    cardWeakness: document.getElementById('cardWeakness'),
    cardResistance: document.getElementById('cardResistance'),
    cardHeight: document.getElementById('cardHeight'),
    cardWeight: document.getElementById('cardWeight'),
    cardCollection: document.getElementById('cardCollection'),

    // Modals
    statsModal: document.getElementById('statsModal'),
    settingsModal: document.getElementById('settingsModal'),
    gameOverModal: document.getElementById('gameOverModal'),
    tutorialOverlay: document.getElementById('tutorialOverlay'),

    // Stats modal elements
    totalGuesses: document.getElementById('totalGuesses'),
    accuracy: document.getElementById('accuracy'),
    bestScore: document.getElementById('bestScore'),
    bestStreak: document.getElementById('bestStreak'),
    achievementsList: document.getElementById('achievementsList'),

    // Settings elements
    soundToggle: document.getElementById('soundToggle'),
    animationsToggle: document.getElementById('animationsToggle'),
    confettiToggle: document.getElementById('confettiToggle'),
    resetStatsButton: document.getElementById('resetStatsButton'),

    // Game over
    gameOverTitle: document.getElementById('gameOverTitle'),
    finalScore: document.getElementById('finalScore'),
    gameOverStats: document.getElementById('gameOverStats'),
    playAgainButton: document.getElementById('playAgainButton'),

    // Tutorial
    closeTutorial: document.getElementById('closeTutorial'),
    dontShowAgain: document.getElementById('dontShowAgain'),

    // Confetti
    confettiCanvas: document.getElementById('confettiCanvas')
};

// ===== Initialize =====
function initGame() {
    loadStats();
    loadSettings();
    setupEventListeners();
    checkFirstTime();
    fetchRandomPokemon();
}

// ===== Local Storage Functions =====
function loadStats() {
    const saved = localStorage.getItem('pokemonGameStats');
    if (saved) {
        gameState.stats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('pokemonGameStats', JSON.stringify(gameState.stats));
}

function loadSettings() {
    const saved = localStorage.getItem('pokemonGameSettings');
    if (saved) {
        gameState.settings = JSON.parse(saved);
        elements.soundToggle.checked = gameState.settings.sound;
        elements.animationsToggle.checked = gameState.settings.animations;
        elements.confettiToggle.checked = gameState.settings.confetti;
    }
}

function saveSettings() {
    localStorage.setItem('pokemonGameSettings', JSON.stringify(gameState.settings));
}

function checkFirstTime() {
    const hasPlayed = localStorage.getItem('hasPlayedBefore');
    if (!hasPlayed) {
        showTutorial();
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Game controls
    elements.difficultySelect.addEventListener('change', changeDifficulty);
    elements.gameModeSelect.addEventListener('change', changeGameMode);
    elements.statsButton.addEventListener('click', () => openModal('statsModal'));
    elements.settingsButton.addEventListener('click', () => openModal('settingsModal'));
    elements.resetButton.addEventListener('click', resetGame);

    // Gameplay
    elements.guessButton.addEventListener('click', checkGuess);
    elements.hintButton.addEventListener('click', giveHint);
    elements.nextButton.addEventListener('click', loadNextPokemon);
    elements.guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
    });

    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.dataset.modal);
        });
    });

    // Settings
    elements.soundToggle.addEventListener('change', (e) => {
        gameState.settings.sound = e.target.checked;
        saveSettings();
    });
    elements.animationsToggle.addEventListener('change', (e) => {
        gameState.settings.animations = e.target.checked;
        saveSettings();
    });
    elements.confettiToggle.addEventListener('change', (e) => {
        gameState.settings.confetti = e.target.checked;
        saveSettings();
    });
    elements.resetStatsButton.addEventListener('click', confirmResetStats);

    // Tutorial
    elements.closeTutorial.addEventListener('click', closeTutorial);

    // Game over
    elements.playAgainButton.addEventListener('click', playAgain);
}

// ===== API Functions =====
async function fetchRandomPokemon() {
    try {
        elements.loadingElement.classList.remove('hidden');
        elements.pokemonImage.style.display = 'none';

        const range = CONFIG.difficulty[gameState.difficulty];
        const randomId = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        if (!response.ok) throw new Error('Error al cargar el Pokémon');

        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        gameState.currentPokemon = {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
            types: data.types.map(type => type.type.name),
            height: data.height,
            weight: data.weight,
            hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
            stats: {
                attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat
            },
            abilities: data.abilities.slice(0, 2).map(ability => ability.ability.name),
            generation: speciesData.generation.name,
            evolutionStage: getEvolutionStage(speciesData)
        };

        displayPokemonSilhouette();

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar el Pokémon. Intenta de nuevo.', 'error');
        setTimeout(fetchRandomPokemon, 2000);
    }
}

function getEvolutionStage(speciesData) {
    return speciesData.evolves_from_species === null ? 'Basic' : 'Stage 1';
}

function displayPokemonSilhouette() {
    elements.loadingElement.classList.add('hidden');

    elements.pokemonImage.src = gameState.currentPokemon.image;
    elements.pokemonImage.alt = 'Pokemon Silueta';
    elements.pokemonImage.classList.add('silhouette');
    elements.pokemonImage.classList.remove('revealed');
    elements.pokemonImage.style.display = 'block';

    // Reset state
    gameState.isGuessing = true;
    gameState.attempts = CONFIG.maxAttempts;
    gameState.hintsUsed = [];
    elements.guessInput.value = '';
    elements.guessInput.disabled = false;
    elements.guessButton.disabled = false;
    elements.hintButton.disabled = false;
    elements.messageElement.textContent = '';
    elements.messageElement.className = 'message';
    elements.hintDisplay.classList.add('hidden');
    elements.cardContainer.classList.add('hidden');
    elements.inputArea.style.display = 'flex';
    updateAttemptsDisplay();

    elements.guessInput.focus();
}

// ===== Game Logic =====
function checkGuess() {
    if (!gameState.isGuessing || !gameState.currentPokemon) return;

    const guess = elements.guessInput.value.trim().toLowerCase();

    if (!guess) {
        showMessage('¡Escribe un nombre!', 'error');
        playSound('error');
        return;
    }

    const targetName = gameState.currentPokemon.name.toLowerCase();
    const result = isCloseMatch(guess, targetName);

    if (result.match) {
        handleCorrectGuess(result.similarity);
    } else {
        handleIncorrectGuess(result.similarity);
    }
}

function handleCorrectGuess(similarity) {
    gameState.isGuessing = false;
    gameState.score += 10;
    gameState.currentStreak++;
    gameState.stats.correctGuesses++;
    gameState.stats.totalGuesses++;

    updateScore();
    checkAchievements();

    if (similarity === 100) {
        showMessage('¡Perfecto! 🎉', 'success');
    } else {
        showMessage(`¡Muy cerca! (${similarity}% similar) 🎉`, 'success');
    }

    playSound('success');

    if (gameState.settings.confetti) {
        launchConfetti();
    }

    revealPokemon();

    // Update best score
    if (gameState.score > gameState.stats.bestScore) {
        gameState.stats.bestScore = gameState.score;
    }
    if (gameState.currentStreak > gameState.stats.bestStreak) {
        gameState.stats.bestStreak = gameState.currentStreak;
    }

    saveStats();
}

function handleIncorrectGuess(similarity) {
    gameState.attempts--;
    gameState.stats.totalGuesses++;
    updateAttemptsDisplay();

    if (gameState.attempts <= 0) {
        // Game over for this Pokemon
        gameState.isGuessing = false;
        gameState.currentStreak = 0;

        showMessage(`¡Se acabaron los intentos! Era ${gameState.currentPokemon.name}`, 'error');
        playSound('error');

        // In survival mode, lose a life
        if (gameState.gameMode === 'survival') {
            gameState.lives--;
            updateLivesDisplay();

            if (gameState.lives <= 0) {
                endGame();
                return;
            }
        }

        saveStats();

        setTimeout(() => {
            elements.pokemonImage.classList.remove('silhouette');
            setTimeout(loadNextPokemon, 2000);
        }, 1500);

    } else {
        if (similarity >= 50) {
            showMessage(`¡Cerca! (${similarity}% similar) Te quedan ${gameState.attempts} intentos 🤔`, 'error');
        } else {
            showMessage(`¡Incorrecto! Te quedan ${gameState.attempts} intentos`, 'error');
        }

        playSound('error');
        elements.guessInput.value = '';
        elements.guessInput.focus();

        elements.pokemonImage.style.animation = 'none';
        setTimeout(() => {
            elements.pokemonImage.style.animation = '';
        }, 10);
    }

    saveStats();
}

function giveHint() {
    if (!gameState.isGuessing || !gameState.currentPokemon) return;

    if (gameState.score < CONFIG.hintCost) {
        showMessage(`¡Necesitas al menos ${CONFIG.hintCost} puntos para pedir una pista!`, 'error');
        return;
    }

    gameState.score -= CONFIG.hintCost;
    updateScore();

    const pokemon = gameState.currentPokemon;
    let hint = '';

    // Progressive hints
    if (!gameState.hintsUsed.includes('type')) {
        hint = `💡 Tipo: ${pokemon.types.map(t => t.toUpperCase()).join('/')}`;
        gameState.hintsUsed.push('type');
    } else if (!gameState.hintsUsed.includes('generation')) {
        hint = `💡 Generación: ${pokemon.generation.replace('generation-', 'Gen ')}`;
        gameState.hintsUsed.push('generation');
    } else if (!gameState.hintsUsed.includes('firstLetter')) {
        hint = `💡 Primera letra: ${pokemon.name.charAt(0).toUpperCase()}`;
        gameState.hintsUsed.push('firstLetter');
    } else if (!gameState.hintsUsed.includes('length')) {
        hint = `💡 Longitud del nombre: ${pokemon.name.length} letras`;
        gameState.hintsUsed.push('length');
    } else {
        showMessage('¡Ya usaste todas las pistas disponibles!', 'error');
        gameState.score += CONFIG.hintCost; // Refund
        updateScore();
        return;
    }

    elements.hintDisplay.textContent = hint;
    elements.hintDisplay.classList.remove('hidden');
    playSound('hint');
}

// ===== Levenshtein Distance =====
function getLevenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

function getSimilarityPercentage(str1, str2) {
    const distance = getLevenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 100 : ((maxLength - distance) / maxLength) * 100;
}

function isCloseMatch(guess, target) {
    if (guess === target) return { match: true, similarity: 100 };

    const similarity = getSimilarityPercentage(guess, target);
    const threshold = 70;

    return {
        match: similarity >= threshold,
        similarity: Math.round(similarity)
    };
}

// ===== Pokemon Card Display =====
function revealPokemon() {
    elements.pokemonImage.classList.remove('silhouette');
    elements.pokemonImage.classList.add('revealed');

    elements.guessInput.disabled = true;
    elements.guessButton.disabled = true;
    elements.hintButton.disabled = true;

    setTimeout(() => {
        elements.inputArea.style.display = 'none';
        elements.hintDisplay.classList.add('hidden');
        displayPokemonCard();
    }, 800);
}

function displayPokemonCard() {
    const primaryType = gameState.currentPokemon.types[0];

    elements.cardName.textContent = gameState.currentPokemon.name.toUpperCase();
    elements.cardId.textContent = `#${String(gameState.currentPokemon.id).padStart(3, '0')}`;
    elements.cardHP.innerHTML = `<span class="hp-number">${gameState.currentPokemon.hp}</span> HP`;
    elements.cardStage.textContent = gameState.currentPokemon.evolutionStage;
    elements.cardImage.src = gameState.currentPokemon.image;
    elements.cardImage.alt = gameState.currentPokemon.name;

    elements.cardTypes.innerHTML = '';
    gameState.currentPokemon.types.forEach(type => {
        const typeIcon = document.createElement('span');
        typeIcon.className = `type-icon type-${type}`;
        typeIcon.textContent = getTypeSymbol(type);
        elements.cardTypes.appendChild(typeIcon);
    });

    elements.cardAttacks.innerHTML = '';

    const attack1 = document.createElement('div');
    attack1.className = 'attack';
    attack1.innerHTML = `
        <div class="attack-cost">
            <span class="type-icon type-${primaryType}">${getTypeSymbol(primaryType)}</span>
        </div>
        <div class="attack-info">
            <div class="attack-name">${getAttackName(primaryType, 1)}</div>
            <div class="attack-damage">${gameState.currentPokemon.stats.attack}</div>
        </div>
    `;
    elements.cardAttacks.appendChild(attack1);

    const attack2 = document.createElement('div');
    attack2.className = 'attack';
    const secondType = gameState.currentPokemon.types[1] || primaryType;
    attack2.innerHTML = `
        <div class="attack-cost">
            <span class="type-icon type-${primaryType}">${getTypeSymbol(primaryType)}</span>
            <span class="type-icon type-${secondType}">${getTypeSymbol(secondType)}</span>
        </div>
        <div class="attack-info">
            <div class="attack-name">${getAttackName(primaryType, 2)}</div>
            <div class="attack-damage">${gameState.currentPokemon.stats.attack + 20}</div>
        </div>
    `;
    elements.cardAttacks.appendChild(attack2);

    const weaknessType = getWeaknessType(primaryType);
    elements.cardWeakness.innerHTML = `<span class="type-icon type-${weaknessType}">${getTypeSymbol(weaknessType)}</span> ×2`;

    const resistanceType = getResistanceType(primaryType);
    if (resistanceType) {
        elements.cardResistance.innerHTML = `<span class="type-icon type-${resistanceType}">${getTypeSymbol(resistanceType)}</span> -20`;
    } else {
        elements.cardResistance.textContent = 'None';
    }

    elements.cardHeight.textContent = `${(gameState.currentPokemon.height / 10).toFixed(1)} m`;
    elements.cardWeight.textContent = `${(gameState.currentPokemon.weight / 10).toFixed(1)} kg`;
    elements.cardCollection.textContent = `${gameState.currentPokemon.id}/898`;

    elements.cardContainer.classList.remove('hidden');
    playSound('cardReveal');
}

// Helper functions (getTypeSymbol, getAttackName, etc.) remain the same
function getTypeSymbol(type) {
    const symbols = {
        normal: '○', fire: '🔥', water: '💧', electric: '⚡',
        grass: '🌿', ice: '❄️', fighting: '👊', poison: '☠️',
        ground: '⛰️', flying: '🦅', psychic: '🔮', bug: '🐛',
        rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙',
        steel: '⚙️', fairy: '✨'
    };
    return symbols[type] || '○';
}

function getAttackName(type, number) {
    const attacks = {
        fire: ['Ember', 'Fire Blast'],
        water: ['Water Gun', 'Hydro Pump'],
        electric: ['Thunder Shock', 'Thunderbolt'],
        grass: ['Vine Whip', 'Solar Beam'],
        normal: ['Tackle', 'Hyper Beam'],
        psychic: ['Confusion', 'Psychic'],
        fighting: ['Karate Chop', 'Dynamic Punch'],
        poison: ['Poison Sting', 'Sludge Bomb'],
        ground: ['Mud Shot', 'Earthquake'],
        flying: ['Wing Attack', 'Sky Attack'],
        bug: ['Bug Bite', 'X-Scissor'],
        rock: ['Rock Throw', 'Stone Edge'],
        ghost: ['Shadow Ball', 'Phantom Force'],
        dragon: ['Dragon Breath', 'Dragon Claw'],
        dark: ['Bite', 'Dark Pulse'],
        steel: ['Metal Claw', 'Iron Tail'],
        ice: ['Ice Shard', 'Blizzard'],
        fairy: ['Fairy Wind', 'Moonblast']
    };
    return attacks[type] ? attacks[type][number - 1] : ['Quick Attack', 'Power Strike'][number - 1];
}

function getWeaknessType(type) {
    const weaknesses = {
        fire: 'water', water: 'electric', electric: 'ground',
        grass: 'fire', ice: 'fire', fighting: 'psychic',
        poison: 'psychic', ground: 'water', flying: 'electric',
        psychic: 'dark', bug: 'fire', rock: 'fighting',
        ghost: 'dark', dragon: 'ice', dark: 'fighting',
        steel: 'fire', normal: 'fighting', fairy: 'poison'
    };
    return weaknesses[type] || 'normal';
}

function getResistanceType(type) {
    const resistances = {
        fire: 'grass', water: 'fire', electric: 'flying',
        grass: 'water', ice: 'ice', fighting: 'bug',
        poison: 'grass', ground: 'electric', flying: 'fighting',
        psychic: 'fighting', bug: 'grass', rock: 'fire',
        ghost: 'poison', dragon: 'fire', dark: 'psychic',
        steel: 'psychic', normal: null, fairy: 'fighting'
    };
    return resistances[type];
}

// ===== Game Mode Functions =====
function changeGameMode(e) {
    gameState.gameMode = e.target.value;

    if (gameState.gameMode === 'timed') {
        elements.timerContainer.classList.remove('hidden');
        elements.livesContainer.classList.add('hidden');
        startTimer();
    } else if (gameState.gameMode === 'survival') {
        elements.livesContainer.classList.remove('hidden');
        elements.timerContainer.classList.add('hidden');
        gameState.lives = CONFIG.modes.survival.lives;
        updateLivesDisplay();
    } else {
        elements.timerContainer.classList.add('hidden');
        elements.livesContainer.classList.add('hidden');
        stopTimer();
    }

    resetGame();
}

function changeDifficulty(e) {
    gameState.difficulty = e.target.value;
    resetGame();
}

function startTimer() {
    gameState.timer = CONFIG.modes.timed.time;
    updateTimerDisplay();

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        updateTimerDisplay();

        if (gameState.timer <= 0) {
            stopTimer();
            endGame();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    elements.timerElement.textContent = gameState.timer;

    if (gameState.timer <= 10) {
        elements.timerElement.style.color = '#ff4444';
    } else {
        elements.timerElement.style.color = '#fff';
    }
}

function updateLivesDisplay() {
    elements.livesElement.textContent = gameState.lives;
}

function updateAttemptsDisplay() {
    elements.attemptsLeft.textContent = gameState.attempts;

    if (gameState.attempts <= 1) {
        elements.attemptsCounter.style.color = '#ff4444';
    } else {
        elements.attemptsCounter.style.color = '#666';
    }
}

// ===== UI Functions =====
function updateScore() {
    elements.scoreElement.textContent = gameState.score;

    if (gameState.settings.animations) {
        elements.scoreElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            elements.scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function showMessage(text, type) {
    elements.messageElement.textContent = text;
    elements.messageElement.className = `message ${type}`;
}

function loadNextPokemon() {
    elements.cardContainer.classList.add('hidden');
    elements.inputArea.style.display = 'flex';
    elements.messageElement.textContent = '';
    elements.messageElement.className = 'message';

    fetchRandomPokemon();
}

function resetGame() {
    stopTimer();
    gameState.score = 0;
    gameState.currentStreak = 0;
    gameState.attempts = CONFIG.maxAttempts;
    gameState.hintsUsed = [];

    if (gameState.gameMode === 'survival') {
        gameState.lives = CONFIG.modes.survival.lives;
        updateLivesDisplay();
    }

    updateScore();
    updateAttemptsDisplay();

    elements.cardContainer.classList.add('hidden');
    elements.inputArea.style.display = 'flex';
    elements.hintDisplay.classList.add('hidden');

    fetchRandomPokemon();

    if (gameState.gameMode === 'timed') {
        startTimer();
    }
}

// ===== Modals =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');

    if (modalId === 'statsModal') {
        updateStatsDisplay();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function updateStatsDisplay() {
    elements.totalGuesses.textContent = gameState.stats.correctGuesses;

    const accuracy = gameState.stats.totalGuesses > 0
        ? Math.round((gameState.stats.correctGuesses / gameState.stats.totalGuesses) * 100)
        : 0;
    elements.accuracy.textContent = `${accuracy}%`;

    elements.bestScore.textContent = gameState.stats.bestScore;
    elements.bestStreak.textContent = gameState.stats.bestStreak;

    displayAchievements();
}

// ===== Achievements =====
function checkAchievements() {
    const achievements = [
        { id: 'first_catch', name: 'Primera Captura', desc: 'Adivina tu primer Pokémon', condition: () => gameState.stats.correctGuesses >= 1 },
        { id: 'ten_catches', name: 'Entrenador Novato', desc: 'Adivina 10 Pokémon', condition: () => gameState.stats.correctGuesses >= 10 },
        { id: 'fifty_catches', name: 'Maestro Pokémon', desc: 'Adivina 50 Pokémon', condition: () => gameState.stats.correctGuesses >= 50 },
        { id: 'hundred_catches', name: 'Leyenda Pokémon', desc: 'Adivina 100 Pokémon', condition: () => gameState.stats.correctGuesses >= 100 },
        { id: 'streak_5', name: 'Racha de 5', desc: 'Consigue una racha de 5 aciertos', condition: () => gameState.currentStreak >= 5 },
        { id: 'streak_10', name: 'Racha de 10', desc: 'Consigue una racha de 10 aciertos', condition: () => gameState.currentStreak >= 10 },
        { id: 'high_score', name: 'Puntuación Alta', desc: 'Consigue 100 puntos', condition: () => gameState.score >= 100 }
    ];

    achievements.forEach(achievement => {
        if (!gameState.stats.achievements.includes(achievement.id) && achievement.condition()) {
            gameState.stats.achievements.push(achievement.id);
            showAchievementUnlocked(achievement.name);
        }
    });

    saveStats();
}

function showAchievementUnlocked(name) {
    const achievementNotif = document.createElement('div');
    achievementNotif.className = 'achievement-notification';
    achievementNotif.innerHTML = `🏆 ¡Logro desbloqueado!<br><strong>${name}</strong>`;
    document.body.appendChild(achievementNotif);

    setTimeout(() => {
        achievementNotif.classList.add('show');
    }, 100);

    setTimeout(() => {
        achievementNotif.classList.remove('show');
        setTimeout(() => achievementNotif.remove(), 300);
    }, 3000);

    playSound('achievement');
}

function displayAchievements() {
    const allAchievements = [
        { id: 'first_catch', name: 'Primera Captura', desc: 'Adivina tu primer Pokémon' },
        { id: 'ten_catches', name: 'Entrenador Novato', desc: 'Adivina 10 Pokémon' },
        { id: 'fifty_catches', name: 'Maestro Pokémon', desc: 'Adivina 50 Pokémon' },
        { id: 'hundred_catches', name: 'Leyenda Pokémon', desc: 'Adivina 100 Pokémon' },
        { id: 'streak_5', name: 'Racha de 5', desc: 'Consigue una racha de 5 aciertos' },
        { id: 'streak_10', name: 'Racha de 10', desc: 'Consigue una racha de 10 aciertos' },
        { id: 'high_score', name: 'Puntuación Alta', desc: 'Consigue 100 puntos' }
    ];

    elements.achievementsList.innerHTML = '';

    allAchievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = `achievement-item ${gameState.stats.achievements.includes(achievement.id) ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <div class="achievement-icon">${gameState.stats.achievements.includes(achievement.id) ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        elements.achievementsList.appendChild(div);
    });
}

function confirmResetStats() {
    if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas? Esta acción no se puede deshacer.')) {
        gameState.stats = {
            totalGuesses: 0,
            correctGuesses: 0,
            bestScore: 0,
            bestStreak: 0,
            achievements: []
        };
        saveStats();
        updateStatsDisplay();
        alert('Estadísticas reiniciadas');
    }
}

// ===== Tutorial =====
function showTutorial() {
    elements.tutorialOverlay.classList.remove('hidden');
}

function closeTutorial() {
    elements.tutorialOverlay.classList.add('hidden');

    if (elements.dontShowAgain.checked) {
        localStorage.setItem('hasPlayedBefore', 'true');
    }
}

// ===== Game Over =====
function endGame() {
    stopTimer();

    elements.finalScore.textContent = gameState.score;
    elements.gameOverTitle.textContent = gameState.gameMode === 'timed'
        ? '⏱️ ¡Tiempo Agotado!'
        : '💔 ¡Game Over!';

    elements.gameOverStats.innerHTML = `
        <p>Pokémon adivinados: ${gameState.stats.correctGuesses}</p>
        <p>Puntuación final: ${gameState.score}</p>
        ${gameState.score > gameState.stats.bestScore ? '<p class="new-record">🎉 ¡Nuevo récord!</p>' : ''}
    `;

    openModal('gameOverModal');
    playSound('gameOver');
}

function playAgain() {
    closeModal('gameOverModal');
    resetGame();
}

// ===== Sound Effects =====
function playSound(type) {
    if (!gameState.settings.sound) return;

    // Simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
        case 'success':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'error':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'hint':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.2;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case 'cardReveal':
            oscillator.frequency.value = 1000;
            gainNode.gain.value = 0.25;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'achievement':
            oscillator.frequency.value = 1200;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
        case 'gameOver':
            oscillator.frequency.value = 150;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
    }
}

// ===== Confetti Effect =====
function launchConfetti() {
    if (!gameState.settings.confetti) return;

    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700', '#4facfe'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ===== Initialize on Load =====
document.addEventListener('DOMContentLoaded', initGame);
