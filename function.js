document.addEventListener('DOMContentLoaded', () => {
    const presetDeckSelectWrapper = document.getElementById('presetDeckSelectWrapper');
    const presetDeckSelectMenu = document.getElementById('presetDeckSelectMenu');
    const presetDeckSelectLabel = document.getElementById('presetDeckSelectLabel');
    const selectDeckBtn = document.getElementById('selectDeckBtn');
    const infoBtn = document.getElementById('infoBtn');
    const createDeckSection = document.getElementById('createDeck');
    const playSection = document.getElementById('play');
    const deckSelection = document.getElementById('deckSelection');
    const backToDeckSelectionBtn = document.getElementById('backToDeckSelectionBtn');
    const backToDeckSelectionBtn2 = document.getElementById('backToDeckSelectionBtn2');
    const backToDeckSelectionBtn3 = document.getElementById('backToDeckSelectionBtn3');
    const locationInput = document.getElementById('locationInput');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const doneBtn = document.getElementById('doneBtn');
    const locationsList = document.getElementById('locationsList');
    const numPlayersInput = document.getElementById('numPlayersInput');
    const startGameBtn = document.getElementById('startGameBtn');
    const playerCardsSection = document.getElementById('playerCards');
    const currentCard = document.getElementById('currentCard');
    const nextCardBtn = document.getElementById('nextCardBtn');
    const infoSection = document.getElementById('info');

    let locations = [];
    let gameDeck = [];
    let currentPlayer = 0;
    let showCardTimeout;
    let showQuestionMarkTimeout;
    let isShowingQuestionMark = false;

    // Mazos predeterminados
    const presetDecks = {
        paises: ["Argentina", "Brasil", "Canadá", "China", "Egipto", "España", "Francia", "India", "Italia", "Japón", "México", "Rusia", "Sudáfrica", "Estados Unidos"],
        ciudades: ["Nueva York", "Londres", "Tokio", "París", "Roma", "Sídney", "Berlín", "Beijing", "São Paulo", "Moscú", "Toronto", "Dubái", "Madrid", "Los Ángeles"],
        animales: ["Elefante", "León", "Tigre", "Osos", "Jirafa", "Zebra", "Cebra", "Gorila", "Panda", "Canguro", "Hipopótamo", "Rinoceronte", "Lobo", "Águila"],
        frutas: ["Manzana", "Banana", "Naranja", "Fresa", "Kiwi", "Mango", "Pera", "Uvas", "Piña", "Cereza", "Melón", "Sandía", "Granada", "Papaya"],
        personajesHistoricos: ["Napoleón Bonaparte", "Albert Einstein", "Leonardo da Vinci", "Cleopatra", "William Shakespeare", "Mahatma Gandhi", "Julius Caesar", "George Washington", "Marilyn Monroe", "Martin Luther King Jr.", "Winston Churchill", "Sigmund Freud", "Isaac Newton", "Churchill"],
        peliculasClasicas: ["Casablanca", "Lo que el viento se llevó", "El Padrino", "Lawrence de Arabia", "Los Siete Samuráis", "Citizen Kane", "Psycho", "La ventana indiscreta", "El Mago de Oz", "A Place in the Sun", "Ben-Hur", "El Halcón Maltés", "2001: Odisea en el Espacio", "Vertigo"],
        deportes: ["Fútbol", "Baloncesto", "Tenis", "Rugby", "Golf", "Natación", "Atletismo", "Ciclismo", "Boxeo", "Artes Marciales Mixtas", "Voleibol", "Béisbol", "Hockey sobre Hielo", "Esquí"],
        espacio: ["Sol", "Luna", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno", "Plutón", "Vía Láctea", "Andrómeda", "Nebulosa", "Cometa Halley", "Agujeros Negros", "Estrella de Neutrones"],
        librosClasicos: ["Don Quijote de la Mancha", "Orgullo y Prejuicio", "Moby Dick", "Cumbres borrascosas", "1984", "El Gran Gatsby", "Crimen y Castigo", "Alicia en el País de las Maravillas", "Los Tres Mosqueteros", "El retrato de Dorian Gray", "En busca del tiempo perdido", "Ana Karenina", "El viejo y el mar", "El Conde de Montecristo"],
        naturaleza: ["Océano", "Montañas", "Bosques", "Desiertos", "Ríos", "Lagos", "Cascadas", "Selvas", "Playas", "Volcanes", "Árboles", "Animales Salvajes", "Praderas", "Cuevas"],
        niggas:["obama", "diddy", "TRAVIESO ESCROTO",""]
    };

    // Mostrar u ocultar el menú de selección
    presetDeckSelectWrapper.addEventListener('click', () => {
        presetDeckSelectMenu.style.display = presetDeckSelectMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Manejar la selección de mazo
    presetDeckSelectMenu.addEventListener('click', (e) => {
        if (e.target && e.target.dataset.value) {
            const selectedValue = e.target.dataset.value;
            presetDeckSelectLabel.textContent = e.target.textContent;
            presetDeckSelectLabel.dataset.value = selectedValue;
            presetDeckSelectMenu.style.display = 'none';
        }
    });

    // Evento para seleccionar un mazo
    selectDeckBtn.addEventListener('click', () => {
        const selectedDeck = presetDeckSelectLabel.dataset.value;
        if (selectedDeck === "custom") {
            createDeckSection.style.display = 'block';
            playSection.style.display = 'none';
            deckSelection.style.display = 'none';
        } else if (selectedDeck) {
            locations = presetDecks[selectedDeck];
            playSection.style.display = 'block';
            createDeckSection.style.display = 'none';
            deckSelection.style.display = 'none';
        } else {
            alert('Por favor, selecciona un mazo para continuar.');
        }
    });

    // Evento para mostrar la sección de información
    infoBtn.addEventListener('click', () => {
        infoSection.style.display = 'block';
        deckSelection.style.display = 'none';
    });

    // Volver a la selección de mazo desde la sección de creación
    backToDeckSelectionBtn.addEventListener('click', () => {
        createDeckSection.style.display = 'none';
        deckSelection.style.display = 'block';
    });

    // Volver a la selección de mazo desde la sección de juego
    backToDeckSelectionBtn2.addEventListener('click', () => {
        playSection.style.display = 'none';
        deckSelection.style.display = 'block';
    });

    // Volver a la selección de mazo desde la sección de información
    backToDeckSelectionBtn3.addEventListener('click', () => {
        infoSection.style.display = 'none';
        deckSelection.style.display = 'block';
    });

    // Añadir una ubicación al mazo creado
    addLocationBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            locations.push(location);
            const li = document.createElement('li');
            li.textContent = location;

            // Crear botón de eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.style.fontSize = '16px';
            deleteBtn.addEventListener('click', () => {
                const index = locations.indexOf(location);
                if (index > -1) {
                    locations.splice(index, 1);
                    locationsList.removeChild(li);
                }
            });

            li.appendChild(deleteBtn);
            locationsList.appendChild(li);
            locationInput.value = ''; // Limpiar el campo de entrada
        } else {
            alert('Por favor, introduce un sitio válido.');
        }
    });

    // Terminar la creación del mazo
    doneBtn.addEventListener('click', () => {
        if (locations.length > 0) {
            alert('Mazo creado con éxito.');
            createDeckSection.style.display = 'none';
            playSection.style.display = 'block';
        } else {
            alert('El mazo está vacío. Añade al menos un sitio.');
        }
    });

    // Iniciar el juego
    startGameBtn.addEventListener('click', () => {
        const numPlayers = parseInt(numPlayersInput.value);
        if (numPlayers < 3) {
            alert('El número de jugadores debe ser al menos 3.');
            return;
        }

        const location = locations[Math.floor(Math.random() * locations.length)];
        gameDeck = Array(numPlayers - 1).fill(location);
        gameDeck.push('Espía');
        shuffleArray(gameDeck);

        currentPlayer = 0;
        currentCard.textContent = '';
        nextCardBtn.disabled = false;

        playerCardsSection.style.display = 'block';
        showNextCard();
    });

    // Mostrar la siguiente carta
    nextCardBtn.addEventListener('click', () => {
        clearTimeout(showCardTimeout);
        clearTimeout(showQuestionMarkTimeout);
        if (isShowingQuestionMark) {
            currentCard.textContent = '';
            isShowingQuestionMark = false;
            showNextCard();
        } else {
            currentCard.textContent = '?';
            isShowingQuestionMark = true;
            showQuestionMark();
        }
    });

    // Función para mostrar la carta actual o el signo de interrogación
    function showNextCard() {
        if (currentPlayer < gameDeck.length) {
            currentCard.textContent = `Jugador ${currentPlayer + 1}: ${gameDeck[currentPlayer]}`;
            currentPlayer++;
            isShowingQuestionMark = false;

            showCardTimeout = setTimeout(() => {
                currentCard.textContent = '';
            }, 60000);
        } else {
            currentCard.textContent = 'Fin del juego';
            nextCardBtn.disabled = true;
        }
    }

    // Función para mostrar el signo de interrogación
    function showQuestionMark() {
        showQuestionMarkTimeout = setTimeout(() => {
            if (isShowingQuestionMark) {
                currentCard.textContent = '';
            }
        }, 60000);
    }

    // Función para mezclar un array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
