document.addEventListener('DOMContentLoaded', () => {
    const createDeckBtn = document.getElementById('createDeckBtn');
    const playGameBtn = document.getElementById('playGameBtn');
    const createDeckSection = document.getElementById('createDeck');
    const playSection = document.getElementById('play');
    const locationInput = document.getElementById('locationInput');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const doneBtn = document.getElementById('doneBtn');
    const locationsList = document.getElementById('locationsList');
    const numPlayersInput = document.getElementById('numPlayersInput');
    const startGameBtn = document.getElementById('startGameBtn');
    const playerCardsList = document.getElementById('playerCardsList');
    const playerCardsSection = document.getElementById('playerCards');

    let locations = [];

    createDeckBtn.addEventListener('click', () => {
        createDeckSection.style.display = 'block';
        playSection.style.display = 'none';
    });

    playGameBtn.addEventListener('click', () => {
        if (locations.length === 0) {
            alert('Primero debes crear un mazo de cartas.');
        } else {
            playSection.style.display = 'block';
            createDeckSection.style.display = 'none';
        }
    });

    addLocationBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            locations.push(location);
            const li = document.createElement('li');
            li.textContent = location;
            locationsList.appendChild(li);
            locationInput.value = '';
        }
    });

    doneBtn.addEventListener('click', () => {
        alert('Mazo creado con éxito.');
        createDeckSection.style.display = 'none';
        playSection.style.display = 'none';
    });

    startGameBtn.addEventListener('click', () => {
        const numPlayers = parseInt(numPlayersInput.value);
        if (numPlayers < 2) {
            alert('El número de jugadores debe ser al menos 2.');
            return;
        }

        const location = locations[Math.floor(Math.random() * locations.length)];
        const gameDeck = Array(numPlayers - 1).fill(location);
        gameDeck.push('Espía');
        shuffleArray(gameDeck);

        playerCardsList.innerHTML = '';
        gameDeck.forEach((card, index) => {
            const li = document.createElement('li');
            li.textContent = `Jugador ${index + 1}: ${card}`;
            playerCardsList.appendChild(li);
        });

        playerCardsSection.style.display = 'block';
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});